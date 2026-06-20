import { Router } from 'express';

export const voiceRouter = Router();

type ElevenLabsJson = Record<string, unknown>;

let cachedDiscoveredAgentId: string | null = null;

function findAgentId(value: unknown): string | null {
  if (typeof value !== 'object' || value === null) return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findAgentId(item);
      if (found) return found;
    }
    return null;
  }

  const data = value as ElevenLabsJson;
  for (const key of ['agent_id', 'agentId', 'id']) {
    const candidate = data[key];
    if (typeof candidate === 'string' && candidate.startsWith('agent_')) return candidate;
  }

  for (const nested of Object.values(data)) {
    const found = findAgentId(nested);
    if (found) return found;
  }

  return null;
}

async function discoverAgentId(apiKey: string): Promise<string | null> {
  if (cachedDiscoveredAgentId) return cachedDiscoveredAgentId;

  const url = new URL('https://api.elevenlabs.io/v1/convai/agents');
  url.searchParams.set('page_size', '1');

  const upstream = await fetch(url, {
    headers: {
      'xi-api-key': apiKey,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    console.error(
      `[voice] ElevenLabs agent discovery failed (${upstream.status}). Check ELEVENLABS_API_KEY:`,
      detail,
    );
    return null;
  }

  cachedDiscoveredAgentId = findAgentId(await upstream.json());
  return cachedDiscoveredAgentId;
}

async function getAgentId(apiKey: string): Promise<string | null> {
  const configuredAgentId = process.env.ELEVENLABS_AGENT_ID?.trim();
  if (configuredAgentId) return configuredAgentId;
  return discoverAgentId(apiKey);
}

// GET /api/voice/session - exchanges the server-only ElevenLabs credentials
// for a short-lived signed URL. The API key is never exposed to the browser.
voiceRouter.get('/session', async (_req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

  if (!apiKey) {
    res.status(503).json({
      error: 'Add ELEVENLABS_API_KEY in Railway to enable voice.',
      code: 'voice_not_configured',
    });
    return;
  }

  try {
    const agentId = await getAgentId(apiKey);
    if (!agentId) {
      res.status(503).json({
        error: 'No ElevenLabs agent found. Create one in Conversational AI, or set ELEVENLABS_AGENT_ID.',
        code: 'voice_agent_not_found',
      });
      return;
    }

    const url = new URL('https://api.elevenlabs.io/v1/convai/conversation/get_signed_url');
    url.searchParams.set('agent_id', agentId);

    const upstream = await fetch(url, {
      headers: {
        'xi-api-key': apiKey,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error(
        `[voice] ElevenLabs signed URL failed (${upstream.status}) for ${agentId}. Check ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID:`,
        detail,
      );
      res.status(502).json({
        error:
          upstream.status === 401 || upstream.status === 403
            ? 'ElevenLabs key cannot access this agent.'
            : upstream.status === 404
              ? 'ElevenLabs agent was not found. Check ELEVENLABS_AGENT_ID.'
              : 'Voice service is unavailable right now.',
      });
      return;
    }

    const data = (await upstream.json()) as { signed_url?: string };
    if (!data.signed_url) {
      res.status(502).json({ error: 'Voice service returned an invalid session.' });
      return;
    }

    res.setHeader('Cache-Control', 'no-store');
    res.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('[voice] Could not create ElevenLabs session:', error);
    res.status(502).json({ error: 'Could not start voice right now.' });
  }
});

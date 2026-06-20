import { Router } from 'express';

export const voiceRouter = Router();

// GET /api/voice/session - exchanges the server-only ElevenLabs credentials
// for a short-lived signed URL. The API key is never exposed to the browser.
voiceRouter.get('/session', async (_req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const agentId = process.env.ELEVENLABS_AGENT_ID?.trim();

  if (!apiKey || !agentId) {
    res.status(503).json({
      error: 'Voice is not configured yet.',
      code: 'voice_not_configured',
    });
    return;
  }

  try {
    const url = new URL('https://api.elevenlabs.io/v1/convai/conversation/get-signed-url');
    url.searchParams.set('agent_id', agentId);

    const upstream = await fetch(url, {
      headers: { 'xi-api-key': apiKey },
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error(`[voice] ElevenLabs signed URL failed (${upstream.status}):`, detail);
      res.status(502).json({ error: 'Voice service is unavailable right now.' });
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

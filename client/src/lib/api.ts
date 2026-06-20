import type { AnalysisResult, AnalyzeRequest, ChatRequest } from '@shared/types';

// Thin client over the backend proxy. The backend keeps the API key server-side
// and falls back to a deterministic analyzer when no key is set.

export type ServerMode = 'live' | 'mock' | 'unknown';

export async function fetchMode(): Promise<ServerMode> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return 'unknown';
    const json = (await res.json()) as { mode?: string };
    return json.mode === 'live' ? 'live' : 'mock';
  } catch {
    return 'unknown';
  }
}

export interface AnalyzeResponse {
  analysis: AnalysisResult;
  source: 'claude' | 'mock';
}

export async function createVoiceSession(): Promise<{ signedUrl: string }> {
  const res = await fetch('/api/voice/session', { cache: 'no-store' });
  const data = (await res.json().catch(() => ({}))) as { signedUrl?: string; error?: string };
  if (!res.ok || !data.signedUrl) {
    throw new Error(data.error ?? 'Could not start voice right now.');
  }
  return { signedUrl: data.signedUrl };
}

/** Sends an entry for structured analysis. Returns null on failure (UI degrades gracefully). */
export async function analyzeEntry(req: AnalyzeRequest): Promise<AnalyzeResponse | null> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) return null;
    return (await res.json()) as AnalyzeResponse;
  } catch {
    return null;
  }
}

/** Streams a companion reply, invoking `onDelta` with each text chunk. */
export async function streamChat(
  req: ChatRequest,
  onDelta: (text: string) => void,
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok || !res.body) throw new Error('Chat request failed');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    full += chunk;
    onDelta(chunk);
  }
  return full;
}

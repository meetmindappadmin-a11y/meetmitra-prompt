import { Router } from 'express';
import { chatSchema } from '../lib/validate.js';
import { isLive, streamCompanion } from '../ai/claude.js';
import { mockCompanionReply } from '../ai/mockCompanion.js';

export const chatRouter = Router();

// POST /api/chat — streams a companion (Mitra) reply as plain text chunks.
chatRouter.post('/', async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');

  if (!isLive()) {
    res.end(mockCompanionReply(parsed.data));
    return;
  }

  let wroteAny = false;
  try {
    await streamCompanion(parsed.data, (delta) => {
      wroteAny = true;
      res.write(delta);
    });
    res.end();
  } catch (err) {
    console.error('[chat] Claude failed, using mock fallback:', err);
    // If nothing has streamed yet, send the full deterministic fallback.
    if (!wroteAny) res.write(mockCompanionReply(parsed.data));
    res.end();
  }
});

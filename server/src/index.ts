import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import { analyzeRouter } from './routes/analyze.js';
import { chatRouter } from './routes/chat.js';
import { voiceRouter } from './routes/voice.js';
import { isLive } from './ai/claude.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8787;

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

// Health/status — lets the client show whether it's in live or mock mode.
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mode: isLive() ? 'live' : 'mock' });
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/voice', voiceRouter);

// Optionally serve the built client (so `npm run build && npm start` is a
// single-port demo). Skipped in dev, where Vite serves the client and proxies /api.
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// Centralised error handler.
app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[server] Unhandled error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Something went wrong' });
  },
);

app.listen(PORT, () => {
  console.log(`MindMitra API listening on http://localhost:${PORT} (${isLive() ? 'live' : 'mock'} mode)`);
});

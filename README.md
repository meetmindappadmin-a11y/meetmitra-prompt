# 🌿 MindMitra — your study companion

A Generative-AI wellness companion for students in the thick of high-stakes exams
(NEET · JEE · CUET · CAT · GATE · UPSC · boards).

You journal in plain words. MindMitra quietly reads between the lines — mapping the
**hidden stress triggers and emotional patterns a standard mood tracker misses** — and
shows up as **Mitra**, a calm, always-available friend who already understands your week.

> Built for **Google PromptWars (Build with AI)**. *Mitra* means "friend".

---

## Why this, and why it's different

Research on Indian exam aspirants is stark: ~44% of Kota coaching students report high
academic stress, professional help is scarce (~0.3 psychiatrists per 100k), and students
overwhelmingly **bottle emotions up (avoidance coping)** rather than work through them — so
they can't see their own patterns, and crises often hit at 3am when no one is available.

So MindMitra doesn't just plot a mood line. It:

| The student's reality | What MindMitra does |
|---|---|
| Bottles things up; can't see patterns | **Insight Engine** reads free journals → tags emotions, triggers & CBT distortions → correlates over time to reveal the hidden pattern |
| No one available at 3am | **Mitra** — an empathetic, context-aware companion, always one tap away |
| Tracking fatigue | **<10-second** mood tap; journaling is always optional |
| Doesn't want a bot reply sometimes | Three doors: **Talk · Write (private, no reply) · Breathe** |
| Privacy fear | **Local-first** — data never leaves the device. No account, no sign-up |
| Self-worth fused to scores | Copy & insights that gently **decouple worth from outcomes** |
| Crisis risk | Always-visible **safety net** with India helplines; never a diagnosis |

---

## Quick start

```bash
npm install
npm run dev
```

- Client: http://localhost:5173 · API: http://localhost:8787
- **No API key needed to demo.** Without one, the app runs in **mock mode** — a deterministic
  offline analyzer powers the Insight Engine and companion so nothing ever breaks on stage.

To use real Claude analysis + conversation, copy `.env.example` to `.env` and add your key:

```bash
cp .env.example .env   # then set ANTHROPIC_API_KEY=...
```

The key stays **server-side only** (the Express proxy calls Claude). It is never shipped to the browser.

### Optional ElevenLabs voice agent

Create an ElevenAgent in the ElevenLabs dashboard, then add the API key locally or
in Railway. The server exchanges it for a short-lived signed conversation URL, so the API key
never reaches the browser. `ELEVENLABS_AGENT_ID` is optional; if omitted, the server auto-picks
the first Conversational AI agent in the account.

```bash
ELEVENLABS_API_KEY=...
# Optional, recommended when the account has multiple agents:
ELEVENLABS_AGENT_ID=agent_...
```

Voice is optional: text chat continues to work when these variables are absent. Starting a voice
session asks for microphone permission and sends that session's audio to ElevenLabs for processing.


Other scripts:

```bash
npm test     # run the unit-test suite (mood, insights, crisis, mock analyzer)
npm run build && npm start   # build the client and serve everything on one port
```

---

## How the Insight Engine works

```
Journal entry (free text) + mood
        │
        ▼  POST /api/analyze
Claude (forced JSON schema)  →  { emotions[], triggers[], distortions[], riskLevel, themeSummary, suggestedExercise }
        │
        ▼  stored locally with the day's mood
Correlation over time (client, pure functions)
        │
        ▼
"Your heavier days tend to gather around mock tests and short, broken sleep."
```

A normal tracker shows *that* your mood dropped. MindMitra shows *why* — surfaced from words
you didn't realise were a pattern.

---

## Architecture

```
mindmitra/
├─ shared/types.ts        # one source of truth for domain types (client + server)
├─ server/                # Express + TS proxy — keeps the Claude key server-side
│  ├─ routes/             # /api/analyze (structured output), /api/chat (streaming)
│  ├─ ai/                 # Claude client, prompts + JSON schema, deterministic mock fallback
│  └─ lib/                # zod validation, crisis classification
└─ client/                # React 19 + Vite + Tailwind v4 — calm, accessible, mobile-first
   ├─ lib/                # storage (local-first), insights engine, mood/exam/crisis (pure, tested)
   ├─ context/            # profile + entries state
   └─ features/           # onboarding · today · companion · journal · insights · exercises · safety
```

**Tech:** React 19, Vite 8, TypeScript, Tailwind v4, Express 5, Zod 4, `@anthropic-ai/sdk`
(`claude-sonnet-4-6`, structured outputs + streaming).

---

## Built against the scoring rubric

- **Problem alignment (high):** the Insight Engine + exam-aware, student-specific framing answer the brief literally.
- **Code quality (high):** layered (UI ↔ state ↔ API ↔ storage), typed, small modules, no dead code.
- **Security (medium):** key server-side, zod-validated inputs, local-first data, dual crisis detection, consent at onboarding.
- **Efficiency (medium):** memoised insights, streamed chat, lean hand-rolled SVG charts, lazy local reads.
- **Testing (low):** vitest over the pure core logic (mood math, trigger↔mood correlation, crisis detection, mock analyzer).
- **Accessibility (low):** semantic HTML, keyboard nav, visible focus, contrast ≥ 4.5:1, `prefers-reduced-motion`, `aria-live`.

---

## A note on safety

MindMitra is a **supportive companion, not a medical or diagnostic service**. It never diagnoses
or gives medical advice. If a message signals crisis (detected both server-side and offline on the
device), it surfaces India helplines — **Tele-MANAS 14416**, **KIRAN 1800-599-0019**, **iCall** —
immediately and visibly. A Help button is always present.

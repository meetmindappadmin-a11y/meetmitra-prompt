# MindMitra — Agent Handoff

> Last updated mid-session, during a **UI polish pass**. Read the "Current status"
> and "In progress / pending" sections first — they tell you exactly where to resume.

## 1. What this is

**MindMitra** — a Generative-AI mental-wellness companion for Indian students preparing for
high-stakes exams (NEET / JEE / CUET / CAT / GATE / UPSC / boards). Built for the
**Google PromptWars (Build with AI)** challenge "Mental Wellness Tracker".

The differentiator: students journal in plain words; a Claude-powered **Insight Engine**
extracts emotions / stress triggers / CBT distortions and **correlates them with mood over
time to surface the hidden pattern** ("Your heavier days tend to gather around mock tests and
short, broken sleep"). Plus **Mitra**, an empathetic always-available chat companion, calming
exercises, and a crisis safety net. Local-first (no auth).

Full product rationale: `README.md`. Original approved plan:
`C:\Users\Abhi\.claude\plans\sleepy-splashing-ocean.md`.

## 2. Tech stack

- **Monorepo** via npm workspaces. Root scripts run both halves with `concurrently`.
- **client/** — React 19 + Vite 8 + TypeScript + **Tailwind v4** (CSS-first; tokens in
  `client/src/styles/tokens.css` via `@tailwindcss/vite`). Router: react-router-dom 7.
- **server/** — Express 5 + Zod 4 + `@anthropic-ai/sdk`, run with `tsx`. Proxies Claude so
  the API key stays server-side. Model default = **`claude-sonnet-4-6`** (overridable via
  `ANTHROPIC_MODEL`).
- **shared/types.ts** — types-only, imported via the `@shared` alias by both client & server.
- Node 24, npm 11 on Windows.

## 3. Run / test / build

```bash
npm install
npm run dev      # client http://localhost:5173  +  server http://localhost:8787
npm test         # vitest — 22 unit tests (pure logic)
npm run build    # vite build (client)
npm start        # serve built client + API on one port (after build)
```

- **No API key required.** Without `ANTHROPIC_API_KEY`, the server runs in **mock mode**:
  a deterministic offline analyzer (`server/src/ai/mockAnalyzer.ts`) and companion
  (`server/src/ai/mockCompanion.ts`) keep everything working. This is what protects the live demo.
- For real Claude: `cp .env.example .env` and set `ANTHROPIC_API_KEY` (+ optional `ANTHROPIC_MODEL`).

Type-check (tsx does NOT type-check at runtime, so run this before shipping):

```bash
npx tsc -p client/tsconfig.json --noEmit
npx tsc -p server/tsconfig.json --noEmit
```

## 4. Current status — what's DONE and verified

Fully built and verified end-to-end (in-browser walkthrough + API curl + tests):

- ✅ Conversational onboarding (name → exam → date → concerns → consent), local-first profile.
- ✅ Today home: greeting, exam countdown, mood tap, three doors (Talk / Write / Breathe).
- ✅ Insight Engine: `/api/analyze` (Claude structured output, mock fallback) → triggers,
  emotions, distortions, riskLevel, themeSummary, suggestedExercise.
- ✅ Insights view: hidden-pattern headline, mood sparkline, trigger map, emotions, coping nudge,
  "Erase my data".
- ✅ Mitra chat: `/api/chat` streaming, context-aware, first message feeds the Insight Engine.
- ✅ Private journal (Write mode, no AI reply) → reflection + CBT reframe + exercise suggestion.
- ✅ Calm: box-breathing animation + 5-4-3-2-1 grounding (motion-respecting).
- ✅ Crisis safety net: always-visible Help → India helplines; dual detection (server keyword
  scan + client offline scan); model riskLevel is max'd with the keyword scan (safety-first).
- ✅ 22/22 vitest tests pass; both projects `tsc --noEmit` clean; `vite build` clean (~85 KB gz JS).
- ✅ Model switched to `claude-sonnet-4-6` (this session).

## 5. ⚠️ In progress / PENDING — resume here

A **UI polish pass** is partly applied (user feedback: "workflow is good but UI is basic").
A new design system is in place; a few items remain:

### 5a. Finish the chat bubble restyle (small)
`client/src/features/companion/MitraChat.tsx`:
- The chat **header** now shows a `MitraAvatar` ✅, but the `ChatBubble` component at the bottom
  of that file still uses the OLD styling: `isMitra ? 'bg-surface text-ink' : 'bg-primary text-primary-ink'`.
- **TODO:** update `ChatBubble` to match the onboarding `Bubble` style — i.e. an avatar next to
  Mitra messages, `bg-grad-primary` for the user's bubbles, `shadow-soft` + a rounded "tail"
  corner on Mitra bubbles. Import `MitraAvatar` (already created at
  `client/src/components/MitraAvatar.tsx`). Mirror the markup in
  `client/src/features/onboarding/MitraOnboarding.tsx` → `Bubble`.

### 5b. Re-verify after the UI edits
Run, in order:
1. `npx tsc -p client/tsconfig.json --noEmit` (watch for unused imports — `noUnusedLocals` is on).
2. `npm test`
3. `npm run build`
4. Visual check in the preview (see §7).

### 5c. Git push (NOT done yet — user asked for this)
Target repo: **https://github.com/meetmindappadmin-a11y/meetmitra-prompt.git**
The working dir is NOT yet a git repo. Steps:
```bash
git init
git add -A
git commit -m "MindMitra: GenAI wellness companion for exam aspirants"   # see footer rule below
git branch -M main
git remote add origin https://github.com/meetmindappadmin-a11y/meetmitra-prompt.git
git push -u origin main
```
Notes:
- `.gitignore` already excludes `node_modules/`, `dist/`, `.env`.
- Auth: may need `gh auth login` or a credential helper / PAT for that account
  (owner `meetmindappadmin-a11y`). If push fails on auth, report it — don't hardcode credentials.
- Commit-message footer (house rule): end with
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## 6. UI design system (what changed this pass)

`client/src/styles/tokens.css` is the source of truth:
- Warmer, deeper palette (light = warm cream/sand; dark = warm charcoal), layered surfaces.
- `--shadow-soft` / `--shadow-lift` (depth), `.bg-grad-primary` / `.bg-grad-calm` (brand gradients).
- `--font-serif` (system serif stack) exposed as `.font-display` — used on the Today greeting,
  Insights headline, brand wordmark, breathing labels for an editorial, less-generic feel.
- Subtle page background gradient; `prefers-reduced-motion` fully respected.

Components updated: `components/ui.tsx` (Card/Button/Chip), `components/Layout.tsx` (branded
header + framed shell), `components/BottomNav.tsx` (clean SVG icons + active pill),
`components/MitraAvatar.tsx` (new), `features/today/MoodTap.tsx`, `features/today/TodayHome.tsx`,
`features/insights/InsightsView.tsx`, `features/exercises/CalmView.tsx`, `features/onboarding/MitraOnboarding.tsx`.

**Bug fixed this pass:** the breathing circle's absolutely-positioned rings had no positioned
ancestor and escaped their container, overlapping the bottom nav. Fixed by making the circle
wrapper `relative` and using `inset-*` rings (`features/exercises/CalmView.tsx`).

## 7. Previewing

A preview server config exists at `.claude/launch.json` (client on 5173, server on 8787).
If using the Claude Preview MCP: `preview_start` name `client` (it reuses if already running).
The Vite dev server hot-reloads UI edits. The API server, if started via `npm start`
(non-watch `tsx`), must be restarted to pick up server-code changes — but mock mode is
unaffected by the model swap, so it's fine for UI work.

To reset app state during testing: in the browser console, `localStorage.clear()` then reload,
or use the in-app "Erase my data" on the Insights screen.

## 8. Architecture / file map

```
shared/types.ts                 # domain types (types-only)
server/src/
  index.ts                      # Express app, /api/health, static serve of client/dist
  routes/analyze.ts             # POST /api/analyze  (Claude structured output OR mock)
  routes/chat.ts                # POST /api/chat     (streaming OR mock)
  ai/claude.ts                  # Anthropic client; MODEL default = claude-sonnet-4-6
  ai/prompts.ts                 # analyst system prompt + JSON schema + companion system prompt
  ai/mockAnalyzer.ts            # deterministic offline analysis
  ai/mockCompanion.ts           # deterministic offline chat reply (incl. crisis reply)
  lib/validate.ts               # zod request schemas
  lib/crisis.ts                 # keyword risk scan + maxRisk (safety-first)
client/src/
  main.tsx, App.tsx             # router; onboarding gate (hasOnboarded)
  context/AppContext.tsx        # profile + entries state, persisted to localStorage
  lib/
    storage.ts                  # typed localStorage repo
    api.ts                      # fetch wrappers (analyze, streamChat, fetchMode)
    insights.ts                 # trigger↔mood correlation, weekly insight (PURE, tested)
    mood.ts, crisis.ts, exam.ts # PURE helpers (tested where logic-bearing)
    entry.ts, labels.ts         # entry factory; UI label maps + helplines
  components/                   # ui.tsx, Layout, BottomNav, MitraAvatar
  features/
    safety/                     # SafetyProvider + CrisisCard (always-available help)
    onboarding/MitraOnboarding.tsx
    today/TodayHome.tsx, MoodTap.tsx
    companion/MitraChat.tsx     # <-- §5a pending: ChatBubble restyle
    journal/PrivateJournal.tsx
    insights/InsightsView.tsx
    exercises/CalmView.tsx
```

## 9. Scoring rubric (what we're optimizing — keep these intact)

Sum of 6, weighted: **HIGH** = Problem Alignment (Insight Engine + exam-specific framing) &
Code Quality (layered, typed, small modules). **MEDIUM** = Security (server-side key, zod,
local-first, crisis safety) & Efficiency (memoized insights, streamed chat, lean SVG charts).
**LOW** = Testing (vitest on core logic) & Accessibility (semantic, keyboard, contrast,
reduced-motion, aria-live). Don't regress accessibility or the crisis path during UI work.

## 10. Key decisions (don't undo without reason)

- **No auth** — local-first storage IS the privacy guarantee and removes the auth requirement.
- **Mock mode** — the app must fully work with no API key (demo safety). Keep both AI paths.
- **Crisis safety is non-negotiable** — keep dual detection + always-visible Help + helplines +
  "not a medical service" disclaimer + no diagnosis.
- **shared/types.ts stays types-only** so `import type` works in both client (Vite alias) and
  server (tsx) without runtime coupling. Put runtime label maps in `client/src/lib/labels.ts`.
- **Provider = Claude** (`claude-sonnet-4-6`). The `claude-api` skill is the reference for SDK usage.

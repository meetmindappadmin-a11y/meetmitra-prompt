---
name: wellbeing-ux
description: Playbook for designing and building mental-health, wellbeing, and psychology-informed user interfaces. Use whenever the task involves mood tracking, journaling, meditation, therapy/CBT, stress/anxiety, self-care, emotional support, habit/wellbeing apps, or any UI that must be calm, safe, accessible, and psychologically supportive. Covers UX patterns, behavioral psychology, trust & safety (crisis handling), accessible/calming visual design, and a build checklist mapped to scoring criteria.
---

# Wellbeing UX — Mental Health × Psychology × UI Playbook

A field guide for building interfaces that genuinely support mental health. Apply these
principles to design decisions, copy, component structure, and code. When a problem
statement lands, map its objectives to the relevant sections below.

## 0. First principles (read before building anything)
- **Do no harm.** A wellbeing app can affect a vulnerable person's day. Default to calm, safe, non-judgmental.
- **The user is not a metric.** Avoid manipulative streaks, guilt, FOMO, or dark patterns. Support > engagement-at-all-costs.
- **Psychological safety is a feature.** Privacy, consent, and gentle tone are core requirements, not polish.
- **Meet people where they are.** Low-energy, anxious, or distracted states are the design target — not the happy path.

## 1. Behavioral psychology you can ship
Use these as named, justifiable design decisions (great for impressing judges):

- **Tiny habits / minimal friction (BJ Fogg):** Make the core action take <10 seconds. One-tap mood log beats a 5-field form.
- **Self-determination theory:** Support Autonomy (user chooses, never forced), Competence (small wins, visible progress), Relatedness (feeling understood). Design for all three.
- **CBT loop:** Situation → Thought → Emotion → Behavior. Journaling/reframing tools should make this loop visible and gently challengeable.
- **Implementation intentions:** "When X, I will Y." Habit/reminder features should bind a cue to an action, not just nag.
- **Positive reinforcement, not punishment:** Celebrate showing up. Never shame a missed day — soften broken streaks ("Welcome back" not "You lost your streak").
- **Cognitive load reduction:** One primary action per screen. Anxiety narrows attention; respect that.
- **Emotional granularity:** Offer a richer vocabulary than happy/sad (e.g., a feelings wheel) — naming emotions precisely improves regulation.
- **Progress over perfection:** Show trends and effort, not pass/fail scores.

## 2. Core UX patterns for wellbeing apps
- **Check-in / mood logging:** Fast, gentle, emoji or slider based. Optional note. Never required fields.
- **Journaling / reflection:** Prompts that invite, don't interrogate. Autosave. Private by default.
- **Guided exercises:** Breathing (4-7-8, box breathing), grounding (5-4-3-2-1), meditation timers — with calming pacing and clear exits.
- **Insights / trends:** Compassionate framing. Patterns, not verdicts. "You tend to feel calmer after walks" not "Your score dropped."
- **Reminders / nudges:** Opt-in, respectful timing, easy to mute. Encouraging tone.
- **Onboarding:** Short, warm, sets expectations, explains privacy up front, asks consent.
- **Empty states:** Reassuring and inviting, never empty-and-cold ("Nothing here yet — whenever you're ready.").

## 3. Trust, safety & crisis handling (NON-NEGOTIABLE)
This is the section that separates a real wellbeing app from a toy. Implement deliberately:

- **Crisis pathway:** If a user expresses self-harm / suicidal ideation (in text, mood, or screening), surface immediate, visible help: crisis hotline, "you're not alone" messaging, option to reach a trusted contact. Never bury it. (Reference resource locally: 988 in the US, or a region-appropriate line.)
- **No medical claims / no diagnosis:** The app supports, it does not treat or diagnose. State this clearly. Avoid clinical absolutes.
- **Consent & transparency:** Tell users what's stored and why before collecting it. Plain language.
- **Privacy by default:** Local-first or encrypted storage where possible. No selling/sharing emotional data. Easy export & delete.
- **Gentle, human tone:** No clinical coldness, no toxic positivity. Validate feelings first ("That sounds hard").
- **Safe AI behavior (if using an LLM):** Empathetic, non-judgmental, never gives medical advice, always escalates crisis to real resources, never pretends to be a licensed therapist. Sanitize and guard prompts.

## 4. Calming, accessible visual design
- **Palette:** Soft, low-saturation (muted blues/greens/warm neutrals). Avoid alarming reds and harsh high-contrast clashes. Reserve red strictly for true emergencies.
- **Space & rhythm:** Generous whitespace, large touch targets (≥44px), unhurried layout. Breathing room = emotional room.
- **Typography:** Readable sizes (≥16px body), comfortable line-height (~1.5), humanist sans-serif. Warm, plain language.
- **Motion:** Slow, soft transitions. **Always honor `prefers-reduced-motion`.** No jarring or attention-grabbing animation.
- **Imagery:** Calm, inclusive, diverse. Avoid stock "perfect happiness" that can alienate.
- **Tone of copy:** Second person, warm, concise, validating. Read every string aloud — would it land kindly on a bad day?

### Accessibility (a scored criterion — never skip)
- Semantic HTML (`<button>`, `<nav>`, `<main>`, headings in order).
- Full keyboard navigation + visible focus states.
- Color contrast ≥ 4.5:1 (3:1 for large text). Never encode meaning by color alone.
- `alt` text on meaningful images; `aria-label`/`aria-live` for dynamic content & announcements.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Forms: real labels, clear errors, no time pressure.

## 5. Build checklist (mapped to PromptWars scoring)
Run this before calling any wellbeing feature "done":

- [ ] **Alignment (HIGH):** Every screen maps to a stated objective. Solves the core mental-health need, not a tangent.
- [ ] **Code Quality (HIGH):** Components small & named by intent; logic separated from UI; no dead code; consistent style.
- [ ] **Security (MED):** Inputs validated, outputs escaped, secrets in `.env`, emotional data stored safely, consent captured.
- [ ] **Efficiency (MED):** Core action is fast & cheap; memoize/lazy-load; no jank on low-end devices.
- [ ] **Testing (LOW):** Core logic (mood calc, streak, CBT reframe, crisis trigger) has unit tests.
- [ ] **Accessibility (LOW):** Keyboard, contrast, semantic, reduced-motion, alt text all verified.
- [ ] **Safety:** Crisis pathway present & visible. No diagnosis. Gentle tone. Privacy explained.

## 6. Tooling available in this environment
For UI generation/design you may use (when helpful, not mandatory):
- **Stitch** MCP (`mcp__stitch__*`) — generate/edit screens from text, design systems.
- **Figma** MCP — design-to-code and code-to-design.
- **show_widget** (visualize) — quick inline SVG/HTML mockups to align on direction fast.
Prefer hand-written, accessible, clean code for the final deliverable — generated UI is for speed/exploration.

## 7. Anti-patterns — do NOT do these
- ❌ Guilt-trip streaks, loss-aversion nags, manipulative notifications.
- ❌ Required mood/journal fields or forced daily check-ins.
- ❌ Diagnosing, scoring users pass/fail, or clinical/cold language.
- ❌ Alarming reds, flashing/auto-playing motion, tiny text, low contrast.
- ❌ Hiding the crisis path, selling emotional data, dark-pattern consent.
- ❌ Toxic positivity ("Just think positive!") — validate first, then support.

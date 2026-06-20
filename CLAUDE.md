# CLAUDE.md — Google PromptWars Battle Plan

> This file is loaded automatically every session. It is the single source of truth for how
> we build to WIN the Google for Developers "PromptWars" (Build with AI) in-person challenge.

## 🎯 The Mission
Win the leaderboard. **Final score = sum of all 6 parameters. No category is ignored.**
Optimize in this priority order (weight-aware):

| Weight | Parameter | What judges look for | Our non-negotiables |
|--------|-----------|----------------------|---------------------|
| 🟢 HIGH | **Problem Statement Alignment** | Targets the *core* challenge, real user needs & stated objectives | Re-read the problem statement before every commit. Map each feature → a stated objective. Solve THE problem, not a tangent. |
| 🟢 HIGH | **Code Quality** | Clean, readable, well-structured | Small functions, clear names, consistent style, no dead code, meaningful comments only where intent isn't obvious, modular files. |
| 🟡 MEDIUM | **Security** | Safe practices, avoids common vulns | Validate/sanitize all input, no secrets in code (.env + .gitignore), parameterized queries, escape output (XSS), authn/authz checks, safe deps. |
| 🟡 MEDIUM | **Efficiency** | Optimal time & memory | Right data structures, avoid N+1 / nested loops on hot paths, debounce/memoize UI, lazy-load, no needless re-renders. |
| ⚪ LOW | **Testing** | Easily testable & maintainable | Pure functions, dependency injection, at least key unit tests for core logic + a test script. |
| ⚪ LOW | **Accessibility** | Usable for diverse users & environments | Semantic HTML, ARIA where needed, keyboard nav, color contrast ≥ 4.5:1, alt text, respects reduced-motion. |

**Judges' note:** High Impact gets you on the board. Medium keeps points you'd otherwise lose.
Low Impact is the tie-breaker between ranks — **never leave those points on the table.**

## ✅ Definition of Done (run through this before declaring anything finished)
1. **Alignment:** Every feature traces to a line in the problem statement. No scope creep, no missing core ask.
2. **Quality:** Readable at a glance. Consistent naming. No commented-out junk. Logical file structure.
3. **Security:** Inputs validated, outputs escaped, no hardcoded secrets, deps trusted.
4. **Efficiency:** No obvious wasted compute; UI stays responsive.
5. **Testing:** Core logic has tests; `npm test` (or equivalent) runs.
6. **Accessibility:** Keyboard-usable, contrast-checked, semantic, alt text present.
7. **Demo-ready:** Runs from a clean clone with a one-line command. README explains it in 30 seconds.

## 🧠 How we work during the war
- **Speed with discipline:** ship a vertical slice that's correct on all 6 axes, then deepen.
- When the problem statement arrives, **first action** = restate it in our own words and list the explicit objectives. Confirm before building.
- Prefer the latest, most capable models when the solution itself uses AI (Claude Opus 4.8 / Fable 5).
- Keep a visible mapping: *objective → feature → file*. This is our alignment evidence for judges.
- The domain is expected to be **UI + mental health + psychology** — use the `wellbeing-ux` skill for that.

## 📦 Project context
- Working dir: `C:\Users\Abhi\Desktop\Main challenge`
- Skill installed: `.claude/skills/wellbeing-ux` (UI + mental health + psychology playbook)
- Problem statement: **TBD — user will provide. Do not assume; wait for it, then restate it.**

import type { ChatRequest, TriggerTag } from '@shared/types';
import { keywordRisk } from '../lib/crisis.js';

// Deterministic, warm companion fallback used in mock mode (no API key) or if a
// Claude stream fails. It still validates feelings, stays safe, and offers a
// small next step — so the chat experience degrades gracefully, never breaks.

const CRISIS_REPLY = `I'm really glad you told me this, and I want you to know you're not alone — you matter, even on the days it doesn't feel that way. Please reach out right now to someone who can help: in India you can call Tele-MANAS at 14416 or KIRAN at 1800-599-0019, any time, free. If you can, also tell one person near you how you're feeling. I'm staying right here with you.`;

const TRIGGER_REFLECTION: Record<TriggerTag, string> = {
  'mock-tests': 'It sounds like the tests have been weighing on you. One mock is a snapshot, not a verdict on you.',
  sleep: 'Running on so little sleep makes everything feel heavier than it is. Your mind deserves rest too.',
  parents: 'Carrying family expectations on top of your own is a lot. Your worth was never up for the exam to decide.',
  comparison: "Comparing your chapter 3 to someone else's chapter 20 is exhausting and unfair to you. Your pace is yours.",
  backlog: 'A huge syllabus can feel like a wall. We only ever climb it one small block at a time.',
  'self-doubt': "That harsh inner voice isn't telling you the truth — showing up like you do takes real strength.",
  isolation: "Feeling alone in this is so hard. I'm here, and reaching out to one person today can help too.",
  health: 'Your body is asking for some care right now, and that matters as much as any chapter.',
  other: "Thank you for trusting me with what's on your mind.",
};

function lastUserText(req: ChatRequest): string {
  for (let i = req.messages.length - 1; i >= 0; i--) {
    const m = req.messages[i];
    if (m && m.role === 'user') return m.content;
  }
  return '';
}

function detectTrigger(text: string, context: string): TriggerTag | null {
  const hay = `${text}\n${context}`.toLowerCase();
  const checks: [TriggerTag, RegExp][] = [
    ['mock-tests', /mock|test|exam|score|marks|rank|result/],
    ['sleep', /sleep|tired|awake|night/],
    ['parents', /parent|family|mom|dad|expectation/],
    ['comparison', /compar|everyone|others|topper|behind/],
    ['backlog', /backlog|syllabus|pending|revision|portion/],
    ['self-doubt', /doubt|not good enough|fail|can'?t do|stupid/],
    ['isolation', /alone|lonely|no one|nobody/],
  ];
  for (const [tag, re] of checks) if (re.test(hay)) return tag;
  return null;
}

/** Builds a deterministic, safe, supportive reply. */
export function mockCompanionReply(req: ChatRequest): string {
  const text = lastUserText(req);
  if (keywordRisk(text) === 'elevated') return CRISIS_REPLY;

  const name = req.profile.name?.trim();
  const greeting = name ? `${name}, ` : '';
  const trigger = detectTrigger(text, req.recentContext);
  const reflection = trigger
    ? TRIGGER_REFLECTION[trigger]
    : "That sounds genuinely hard, and it makes sense that you're feeling it.";

  const step =
    trigger === 'health' || /panic|anxious|can'?t breathe|overwhelm/i.test(text)
      ? "Want to try one minute of slow breathing together? Tap “Calm” whenever you're ready."
      : 'What feels like the one smallest, kindest next step for the next hour? We can start there.';

  return `${greeting}${reflection} ${step}`;
}

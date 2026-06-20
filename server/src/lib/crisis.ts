import type { RiskLevel } from '@shared/types';

// Server-side crisis safety net. Runs alongside the model's own riskLevel so a
// crisis is caught even if the model under-rates it (or in mock mode). This is a
// deliberately high-recall keyword scan — false positives are acceptable here;
// missing a real crisis is not.

const ELEVATED_PATTERNS: RegExp[] = [
  /\bkill (myself|me)\b/i,
  /\bsuicid/i,
  /\bend (my|this) life\b/i,
  /\bdon'?t want to (live|be alive|exist)\b/i,
  /\b(want|going) to die\b/i,
  /\bno (point|reason) (in )?living\b/i,
  /\bhang myself\b/i,
  /\bhurt myself\b/i,
  /\bself[-\s]?harm/i,
  /\bcut myself\b/i,
  /\bbetter off (without me|dead)\b/i,
  /\b(can'?t|cannot) go on\b/i,
  /\bwant (it|everything) to (stop|end)\b/i,
];

/** Returns 'elevated' if the text matches any crisis pattern, else 'none'. */
export function keywordRisk(text: string): RiskLevel {
  const t = text || '';
  return ELEVATED_PATTERNS.some((re) => re.test(t)) ? 'elevated' : 'none';
}

const ORDER: Record<RiskLevel, number> = { none: 0, low: 1, elevated: 2 };

/** Returns whichever risk level is more severe (safety-first). */
export function maxRisk(a: RiskLevel, b: RiskLevel): RiskLevel {
  return ORDER[a] >= ORDER[b] ? a : b;
}

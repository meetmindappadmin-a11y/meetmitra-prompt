// Client-side crisis safety net. Mirrors the server scan so a crisis is caught
// even with no network/API (offline). Deliberately high-recall.

const PATTERNS: RegExp[] = [
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
];

/** True when text contains a crisis signal that should surface the safety card. */
export function clientCrisisRisk(text: string): boolean {
  const t = text || '';
  return PATTERNS.some((re) => re.test(t));
}

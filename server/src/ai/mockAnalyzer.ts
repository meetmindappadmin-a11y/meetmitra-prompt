import type {
  AnalysisResult,
  Distortion,
  Emotion,
  Mood,
  TriggerTag,
} from '@shared/types';
import { keywordRisk } from '../lib/crisis.js';

// Deterministic, offline Insight Engine. Used whenever ANTHROPIC_API_KEY is
// absent (or a Claude call fails) so the live demo always works. Same input ->
// same output, which also makes it unit-testable.

// Leading word-boundary + stems, so inflections (parents, disappointed, slept)
// are matched. This is a heuristic net — slight over-matching is acceptable.
const TRIGGER_KEYWORDS: Record<Exclude<TriggerTag, 'other'>, RegExp> = {
  'mock-tests': /\b(mock|test|exam|paper|score|marks?|rank|result|cutoff)/i,
  sleep: /\b(sleep|slept|insomnia|tired|exhaust|all[-\s]?nighter|awake|[34]\s?am)/i,
  parents: /\b(parents?|mom|mother|dad|father|family|expectation|disappoint)/i,
  comparison: /\b(everyone else|others|friend|topper|compar|behind|instagram|social media)/i,
  backlog: /\b(backlog|syllabus|pending|revision|so much|behind on|cover|portion)/i,
  'self-doubt': /\b(can'?t do|not good enough|stupid|fail|doubt|worthless|give up)/i,
  isolation: /\b(alone|lonely|no one|isolate|nobody|by myself)/i,
  health: /\b(headache|sick|ill|anxiety attack|panic|chest|breathe|stomach)/i,
};

const DISTORTION_KEYWORDS: Record<Distortion, RegExp> = {
  catastrophizing: /\b(ruined|over|disaster|never recover|end of|worst|doomed)\b/i,
  'all-or-nothing': /\b(always|never|everything|nothing|completely|totally failed)\b/i,
  'mind-reading': /\b(they think|everyone thinks|they'?ll judge|knows i)\b/i,
  overgeneralization: /\b(every time|i always|nothing ever|keeps happening)\b/i,
  'should-statements': /\b(should have|must|have to be|supposed to)\b/i,
  personalization: /\b(my fault|because of me|i ruined|i let .* down)\b/i,
  'fortune-telling': /\b(i'?ll fail|won'?t pass|going to lose|never get)\b/i,
  labeling: /\b(i'?m (a )?(loser|failure|idiot|stupid|worthless))\b/i,
};

function matchAll<K extends string>(text: string, map: Record<K, RegExp>): K[] {
  return (Object.keys(map) as K[]).filter((key) => map[key].test(text));
}

// Mood-led baseline emotions, refined by detected triggers.
function inferEmotions(mood: Mood, triggers: TriggerTag[], text: string): Emotion[] {
  const emotions: Emotion[] = [];
  const heavy = mood <= 2;
  const low = mood === 3;

  if (heavy) emotions.push({ label: 'overwhelmed', intensity: 0.8 });
  else if (low) emotions.push({ label: 'unsettled', intensity: 0.5 });
  else emotions.push({ label: 'steady', intensity: 0.6 });

  if (triggers.includes('self-doubt')) emotions.push({ label: 'discouraged', intensity: 0.7 });
  if (triggers.includes('comparison')) emotions.push({ label: 'inadequate', intensity: 0.6 });
  if (triggers.includes('isolation')) emotions.push({ label: 'lonely', intensity: 0.65 });
  if (triggers.includes('parents')) emotions.push({ label: 'pressured', intensity: 0.6 });
  if (triggers.includes('mock-tests')) emotions.push({ label: 'anxious', intensity: 0.6 });
  if (/\bhope|better|proud|okay|grateful|calm\b/i.test(text))
    emotions.push({ label: 'hopeful', intensity: 0.4 });

  return emotions.slice(0, 4);
}

function buildSummary(mood: Mood, triggers: TriggerTag[]): string {
  if (triggers.length === 0) {
    return mood <= 2
      ? 'It sounds like today carried some weight — thank you for putting it into words.'
      : 'Thanks for checking in and noticing how today felt.';
  }
  const human: Record<TriggerTag, string> = {
    'mock-tests': 'the pressure around tests and scores',
    sleep: 'how little rest you have been getting',
    parents: "the weight of family expectations",
    comparison: 'measuring yourself against others',
    backlog: 'the mountain of syllabus left',
    'self-doubt': 'the voice of self-doubt',
    isolation: 'feeling alone in this',
    health: 'your body feeling the strain',
    other: 'what is on your mind',
  };
  const lead = human[triggers[0]!];
  return `It sounds like ${lead} is sitting heavily with you right now — that is completely understandable.`;
}

/** Produces a deterministic AnalysisResult for an entry. */
export function mockAnalyze(text: string, mood: Mood): AnalysisResult {
  const triggers = matchAll(text, TRIGGER_KEYWORDS) as TriggerTag[];
  if (triggers.length === 0 && text.trim().length > 0) triggers.push('other');

  const distortions = matchAll(text, DISTORTION_KEYWORDS);
  const emotions = inferEmotions(mood, triggers, text);

  let riskLevel = keywordRisk(text);
  if (riskLevel === 'none' && mood === 1 && triggers.includes('self-doubt')) {
    riskLevel = 'low';
  }

  const suggestedExercise: AnalysisResult['suggestedExercise'] =
    triggers.includes('health') || mood === 1
      ? 'breathing'
      : mood <= 2 || triggers.includes('backlog')
        ? 'grounding'
        : 'none';

  return {
    emotions,
    triggers,
    distortions,
    riskLevel,
    themeSummary: buildSummary(mood, triggers),
    suggestedExercise,
  };
}

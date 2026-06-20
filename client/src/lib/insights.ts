import type {
  Entry,
  TriggerInsight,
  TriggerTag,
  WeeklyInsight,
} from '@shared/types';
import { averageMood } from './mood';

// The Insight Engine's client-side correlation layer. Pure functions over the
// entries the GenAI analyst has already tagged. This is what turns "your mood
// dropped" into "WHY it dropped" — the hidden pattern a standard tracker misses.

// Lowercase phrases used to compose compassionate, human headlines.
const TRIGGER_PHRASE: Record<TriggerTag, string> = {
  'mock-tests': 'mock tests and scores',
  sleep: 'short, broken sleep',
  parents: 'family expectations',
  comparison: 'comparing yourself to others',
  backlog: 'the syllabus backlog',
  'self-doubt': 'self-doubt',
  isolation: 'feeling alone',
  health: 'your body feeling the strain',
  other: "what's been on your mind",
};

/**
 * For each trigger, how often it appeared and the average mood on those days.
 * Sorted so the most distressing (lowest avg mood) surfaces first.
 */
export function computeTriggerInsights(entries: Entry[]): TriggerInsight[] {
  const acc = new Map<TriggerTag, { count: number; moodSum: number }>();

  for (const entry of entries) {
    const triggers = entry.analysis?.triggers ?? [];
    for (const tag of new Set(triggers)) {
      const cur = acc.get(tag) ?? { count: 0, moodSum: 0 };
      cur.count += 1;
      cur.moodSum += entry.mood;
      acc.set(tag, cur);
    }
  }

  return [...acc.entries()]
    .map(([tag, v]) => ({ tag, count: v.count, avgMood: v.moodSum / v.count }))
    .sort((a, b) => a.avgMood - b.avgMood || b.count - a.count);
}

/** Counts emotion labels across all analysed entries, most frequent first. */
export function computeTopEmotions(entries: Entry[]): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const emotion of entry.analysis?.emotions ?? []) {
      counts.set(emotion.label, (counts.get(emotion.label) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/** Builds the "hidden pattern" headline from the strongest trigger signal. */
function buildHeadline(triggers: TriggerInsight[], entryCount: number): string {
  if (entryCount < 2 || triggers.length === 0) {
    return 'A few more check-ins and patterns in your week will start to show here.';
  }
  // Primary = recurring trigger with the lowest average mood.
  const recurring = triggers.filter((t) => t.count >= 2);
  const primary = (recurring[0] ?? triggers[0])!;
  const primaryPhrase = TRIGGER_PHRASE[primary.tag];

  const secondary = (recurring[1] ?? triggers[1]);
  if (secondary && secondary.tag !== primary.tag && primary.count >= 2) {
    return `Your heavier days tend to gather around ${primaryPhrase} and ${TRIGGER_PHRASE[secondary.tag]}.`;
  }
  if (primary.count >= 2) {
    return `Your heavier days tend to gather around ${primaryPhrase}.`;
  }
  return `${primaryPhrase[0]!.toUpperCase()}${primaryPhrase.slice(1)} has come up on a tougher day — worth keeping an eye on together.`;
}

/** A research-backed nudge from avoidance coping toward active coping. */
function buildCopingNudge(triggers: TriggerInsight[]): string {
  const tags = new Set(triggers.map((t) => t.tag));
  if (tags.has('isolation')) {
    return 'When things feel heavy, reaching out — even one message to someone you trust — tends to lift it more than carrying it alone.';
  }
  if (tags.has('self-doubt')) {
    return 'On self-doubt days, naming one small thing you did handle can quietly chip away at that inner critic.';
  }
  if (tags.has('sleep')) {
    return 'Protecting even 30 more minutes of sleep tonight is one of the kindest, most useful things you can do for tomorrow.';
  }
  if (tags.has('comparison')) {
    return 'Try a gentle experiment: a day off the comparison feeds, measuring today only against yesterday.';
  }
  return 'Putting feelings into words — like you just did — is itself active coping. It beats bottling them up.';
}

/** Full compassionate weekly synthesis. */
export function computeWeeklyInsight(entries: Entry[]): WeeklyInsight {
  const triggers = computeTriggerInsights(entries);
  const ordered = [...entries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return {
    entryCount: entries.length,
    avgMood: averageMood(entries),
    moodTrend: ordered.map((e) => e.mood),
    topTriggers: triggers.slice(0, 4),
    topEmotions: computeTopEmotions(entries),
    headline: buildHeadline(triggers, entries.length),
    copingNudge: buildCopingNudge(triggers),
  };
}

/** Compact context string injected into the companion's system prompt. */
export function buildRecentContext(entries: Entry[]): string {
  if (entries.length === 0) return '';
  const recent = [...entries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const lines = recent.map((e) => {
    const triggers = e.analysis?.triggers?.length
      ? ` · triggers: ${e.analysis.triggers.join(', ')}`
      : '';
    const theme = e.analysis?.themeSummary ? ` · ${e.analysis.themeSummary}` : '';
    return `- mood ${e.mood}/5${triggers}${theme}`;
  });

  const weekly = computeWeeklyInsight(entries);
  return [`Recent check-ins (newest first):`, ...lines, `Pattern so far: ${weekly.headline}`].join('\n');
}

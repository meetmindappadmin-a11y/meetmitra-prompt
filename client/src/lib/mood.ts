import type { Entry, Mood } from '@shared/types';

export interface MoodMeta {
  label: string;
  emoji: string;
}

// 1 = heaviest, 5 = lightest. Gentle, non-clinical language.
export const MOOD_META: Record<Mood, MoodMeta> = {
  1: { label: 'Really heavy', emoji: '😞' },
  2: { label: 'Low', emoji: '😕' },
  3: { label: 'Okay', emoji: '😐' },
  4: { label: 'Good', emoji: '🙂' },
  5: { label: 'Light', emoji: '😌' },
};

export const MOODS: Mood[] = [1, 2, 3, 4, 5];

export function moodLabel(m: Mood): string {
  return MOOD_META[m].label;
}

export function moodEmoji(m: Mood): string {
  return MOOD_META[m].emoji;
}

/** Average mood across entries, or null when there are none. */
export function averageMood(entries: Entry[]): number | null {
  if (entries.length === 0) return null;
  const sum = entries.reduce((acc, e) => acc + e.mood, 0);
  return sum / entries.length;
}

/** Rounds an average mood to the nearest valid Mood value. */
export function roundMood(avg: number): Mood {
  const r = Math.min(5, Math.max(1, Math.round(avg)));
  return r as Mood;
}

import { describe, it, expect } from 'vitest';
import type { Entry } from '@shared/types';
import { averageMood, moodLabel, roundMood } from './mood';

function entry(mood: Entry['mood']): Entry {
  return {
    id: Math.random().toString(36),
    createdAt: new Date().toISOString(),
    mood,
    text: '',
    source: 'checkin',
    analysis: null,
  };
}

describe('mood helpers', () => {
  it('returns null average for no entries', () => {
    expect(averageMood([])).toBeNull();
  });

  it('averages moods correctly', () => {
    expect(averageMood([entry(2), entry(4)])).toBe(3);
  });

  it('rounds to a valid Mood and clamps to range', () => {
    expect(roundMood(3.4)).toBe(3);
    expect(roundMood(4.6)).toBe(5);
    expect(roundMood(9)).toBe(5);
    expect(roundMood(-1)).toBe(1);
  });

  it('labels each mood', () => {
    expect(moodLabel(1)).toBe('Really heavy');
    expect(moodLabel(5)).toBe('Light');
  });
});

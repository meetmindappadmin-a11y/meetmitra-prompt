import { describe, it, expect } from 'vitest';
import type { AnalysisResult, Entry, Mood, TriggerTag } from '@shared/types';
import { computeTriggerInsights, computeWeeklyInsight, buildRecentContext } from './insights';

let seq = 0;
function entry(mood: Mood, triggers: TriggerTag[], emotions: string[] = []): Entry {
  seq += 1;
  const analysis: AnalysisResult = {
    emotions: emotions.map((label) => ({ label, intensity: 0.6 })),
    triggers,
    distortions: [],
    riskLevel: 'none',
    themeSummary: 'A heavy day.',
    suggestedExercise: 'none',
  };
  return {
    id: `e${seq}`,
    createdAt: new Date(2026, 0, seq).toISOString(),
    mood,
    text: 'entry',
    source: 'write',
    analysis,
  };
}

describe('computeTriggerInsights', () => {
  it('correlates triggers with average mood, lowest mood first', () => {
    const entries = [
      entry(1, ['mock-tests']),
      entry(2, ['mock-tests']),
      entry(4, ['sleep']),
    ];
    const insights = computeTriggerInsights(entries);
    expect(insights[0]!.tag).toBe('mock-tests'); // avg mood 1.5 — most distressing
    expect(insights[0]!.count).toBe(2);
    expect(insights[0]!.avgMood).toBe(1.5);
    expect(insights[1]!.tag).toBe('sleep');
  });

  it('counts a trigger once per entry even if duplicated', () => {
    const e = entry(3, ['parents', 'parents']);
    const insights = computeTriggerInsights([e]);
    expect(insights[0]!.count).toBe(1);
  });
});

describe('computeWeeklyInsight', () => {
  it('surfaces a hidden-pattern headline from a recurring trigger', () => {
    const entries = [
      entry(1, ['mock-tests']),
      entry(2, ['mock-tests']),
      entry(4, ['sleep']),
    ];
    const weekly = computeWeeklyInsight(entries);
    expect(weekly.entryCount).toBe(3);
    expect(weekly.headline.toLowerCase()).toContain('mock tests');
    expect(weekly.moodTrend).toEqual([1, 2, 4]);
    expect(weekly.copingNudge.length).toBeGreaterThan(0);
  });

  it('gives an encouraging placeholder when there is too little data', () => {
    const weekly = computeWeeklyInsight([entry(3, ['sleep'])]);
    expect(weekly.headline.toLowerCase()).toContain('check-ins');
  });

  it('tailors the coping nudge to loneliness', () => {
    const weekly = computeWeeklyInsight([entry(1, ['isolation']), entry(2, ['isolation'])]);
    expect(weekly.copingNudge.toLowerCase()).toContain('reaching out');
  });
});

describe('buildRecentContext', () => {
  it('is empty with no entries and summarises with some', () => {
    expect(buildRecentContext([])).toBe('');
    const ctx = buildRecentContext([entry(1, ['mock-tests']), entry(2, ['mock-tests'])]);
    expect(ctx).toContain('mood');
    expect(ctx.toLowerCase()).toContain('pattern so far');
  });
});

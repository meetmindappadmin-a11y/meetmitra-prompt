import { describe, it, expect } from 'vitest';
import { mockAnalyze } from './mockAnalyzer.js';

describe('mockAnalyze', () => {
  it('extracts triggers from a stressful exam entry', () => {
    const r = mockAnalyze(
      'I bombed my physics mock again and my parents will be so disappointed. I only slept 3 hours.',
      1,
    );
    expect(r.triggers).toContain('mock-tests');
    expect(r.triggers).toContain('parents');
    expect(r.triggers).toContain('sleep');
  });

  it('is deterministic — same input yields identical output', () => {
    const input = 'Everyone else is so far ahead, I feel like a failure.';
    expect(mockAnalyze(input, 2)).toEqual(mockAnalyze(input, 2));
  });

  it('detects CBT distortions in catastrophising language', () => {
    const r = mockAnalyze('This is a complete disaster, my life is ruined and I always fail.', 1);
    expect(r.distortions).toContain('catastrophizing');
    expect(r.distortions).toContain('all-or-nothing');
  });

  it('flags elevated risk on self-harm language regardless of mood', () => {
    const r = mockAnalyze("I don't want to be alive anymore.", 3);
    expect(r.riskLevel).toBe('elevated');
  });

  it('suggests breathing when mood is at its lowest', () => {
    const r = mockAnalyze('Panic attack before the exam, my chest hurts.', 1);
    expect(r.suggestedExercise).toBe('breathing');
  });

  it('returns a gentle summary and no "other" trigger for empty text', () => {
    const r = mockAnalyze('', 4);
    expect(r.triggers).not.toContain('other');
    expect(r.themeSummary.length).toBeGreaterThan(0);
  });
});

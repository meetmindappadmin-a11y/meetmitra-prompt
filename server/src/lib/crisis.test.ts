import { describe, it, expect } from 'vitest';
import { keywordRisk, maxRisk } from './crisis.js';

describe('keywordRisk', () => {
  it('flags explicit self-harm phrases as elevated', () => {
    expect(keywordRisk('I want to kill myself')).toBe('elevated');
    expect(keywordRisk("there's no point in living")).toBe('elevated');
    expect(keywordRisk('I keep thinking about self-harm')).toBe('elevated');
  });

  it('does not flag ordinary exam stress', () => {
    expect(keywordRisk('I am so stressed about my JEE mock tomorrow')).toBe('none');
    expect(keywordRisk('I feel like a failure today')).toBe('none');
  });

  it('handles empty input safely', () => {
    expect(keywordRisk('')).toBe('none');
  });
});

describe('maxRisk', () => {
  it('returns the more severe of two levels', () => {
    expect(maxRisk('none', 'elevated')).toBe('elevated');
    expect(maxRisk('low', 'none')).toBe('low');
    expect(maxRisk('low', 'elevated')).toBe('elevated');
  });
});

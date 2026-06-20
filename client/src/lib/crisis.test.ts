import { describe, it, expect } from 'vitest';
import { clientCrisisRisk } from './crisis';

describe('clientCrisisRisk', () => {
  it('detects crisis language offline', () => {
    expect(clientCrisisRisk('I want to kill myself')).toBe(true);
    expect(clientCrisisRisk("I can't go on like this")).toBe(true);
    expect(clientCrisisRisk('thinking about self harm')).toBe(true);
  });

  it('does not over-trigger on ordinary stress', () => {
    expect(clientCrisisRisk('this exam is killing my schedule')).toBe(false);
    expect(clientCrisisRisk('I feel hopeless about chemistry')).toBe(false);
    expect(clientCrisisRisk('')).toBe(false);
  });
});

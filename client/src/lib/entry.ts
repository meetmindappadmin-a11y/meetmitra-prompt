import type { AnalysisResult, Entry, EntrySource, Mood } from '@shared/types';

let counter = 0;

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  counter += 1;
  return `e-${Date.now()}-${counter}`;
}

/** Builds a fresh Entry with id + timestamp. */
export function createEntry(
  mood: Mood,
  text: string,
  source: EntrySource,
  analysis: AnalysisResult | null,
): Entry {
  return {
    id: newId(),
    createdAt: new Date().toISOString(),
    mood,
    text,
    source,
    analysis,
  };
}

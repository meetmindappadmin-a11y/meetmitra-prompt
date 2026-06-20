import type { Distortion, ExamType, TriggerTag } from '@shared/types';

// Human-readable, compassionate labels for the taxonomies. UI-only runtime data.

export const TRIGGER_LABEL: Record<TriggerTag, string> = {
  'mock-tests': 'Mock tests & scores',
  sleep: 'Sleep',
  parents: 'Family expectations',
  comparison: 'Comparing to others',
  backlog: 'Syllabus backlog',
  'self-doubt': 'Self-doubt',
  isolation: 'Loneliness',
  health: 'Health & body',
  other: 'Other',
};

export const TRIGGER_EMOJI: Record<TriggerTag, string> = {
  'mock-tests': '📝',
  sleep: '🌙',
  parents: '👨‍👩‍👧',
  comparison: '🪞',
  backlog: '📚',
  'self-doubt': '🌧️',
  isolation: '🫂',
  health: '🩺',
  other: '💭',
};

export const DISTORTION_LABEL: Record<Distortion, string> = {
  catastrophizing: 'Catastrophising',
  'all-or-nothing': 'All-or-nothing thinking',
  'mind-reading': 'Mind-reading',
  overgeneralization: 'Overgeneralising',
  'should-statements': '“Should” pressure',
  personalization: 'Self-blame',
  'fortune-telling': 'Predicting the worst',
  labeling: 'Harsh self-labels',
};

// A gentle CBT-style reframe prompt for each distortion (an invitation, not a verdict).
export const DISTORTION_REFRAME: Record<Distortion, string> = {
  catastrophizing: 'Is the very worst case truly the most likely one?',
  'all-or-nothing': 'Could there be some middle ground between perfect and failure?',
  'mind-reading': 'Do you know for certain what they think — or is it a guess?',
  overgeneralization: 'Is “always/never” the whole story, or just today?',
  'should-statements': 'What would you say to a friend who “should” have done it?',
  personalization: 'How much of this was actually within your control?',
  'fortune-telling': 'Is this a fact about the future, or a fear about it?',
  labeling: 'One hard day does not define who you are.',
};

export const EXAM_LABEL: Record<ExamType, string> = {
  NEET: 'NEET',
  JEE: 'JEE',
  CUET: 'CUET',
  CAT: 'CAT',
  GATE: 'GATE',
  UPSC: 'UPSC',
  Boards: 'Board exams',
  Other: 'your exam',
};

export interface Helpline {
  name: string;
  number: string;
  note: string;
}

// India-appropriate crisis resources, surfaced on the safety card.
export const HELPLINES: Helpline[] = [
  { name: 'Tele-MANAS (Govt. of India)', number: '14416', note: 'Free, 24×7 mental health support' },
  { name: 'KIRAN Helpline', number: '1800-599-0019', note: 'Free, 24×7, multi-language' },
  { name: 'iCall (TISS)', number: '9152987821', note: 'Mon–Sat, 8am–10pm counselling' },
];

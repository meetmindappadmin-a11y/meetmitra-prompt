// Shared domain types for MindMitra.
// This module is intentionally TYPES-ONLY (no runtime values) so it can be
// imported with `import type` from both the Vite client and the tsx server
// without any bundler/runtime coupling.

/** High-stakes exams our students prepare for. Drives tone + trigger taxonomy. */
export type ExamType =
  | 'NEET'
  | 'JEE'
  | 'CUET'
  | 'CAT'
  | 'GATE'
  | 'UPSC'
  | 'Boards'
  | 'Other';

/** The student's profile, captured during the conversational onboarding. */
export interface Profile {
  name: string;
  exam: ExamType | null;
  examDate: string | null; // ISO date (yyyy-mm-dd) or null if not shared
  concerns: TriggerTag[]; // what's weighing on them, seeded at onboarding
  consentedAt: string | null; // ISO timestamp of consent
  createdAt: string; // ISO timestamp
}

/** Mood on a gentle 5-point scale. 1 = really heavy, 5 = light. */
export type Mood = 1 | 2 | 3 | 4 | 5;

/**
 * Research-derived stress triggers for Indian exam aspirants. These are the
 * "hidden patterns standard trackers miss" that the Insight Engine surfaces.
 */
export type TriggerTag =
  | 'mock-tests'
  | 'sleep'
  | 'parents'
  | 'comparison'
  | 'backlog'
  | 'self-doubt'
  | 'isolation'
  | 'health'
  | 'other';

/** A named emotion with an intensity in [0, 1]. */
export interface Emotion {
  label: string;
  intensity: number;
}

/** CBT cognitive distortions the analyst gently flags (never diagnoses). */
export type Distortion =
  | 'catastrophizing'
  | 'all-or-nothing'
  | 'mind-reading'
  | 'overgeneralization'
  | 'should-statements'
  | 'personalization'
  | 'fortune-telling'
  | 'labeling';

/** Crisis risk tier. `elevated` surfaces the safety card immediately. */
export type RiskLevel = 'none' | 'low' | 'elevated';

export type ExerciseSuggestion = 'breathing' | 'grounding' | 'none';

/** Structured output of the GenAI Insight Engine for a single entry. */
export interface AnalysisResult {
  emotions: Emotion[];
  triggers: TriggerTag[];
  distortions: Distortion[];
  riskLevel: RiskLevel;
  themeSummary: string; // one compassionate sentence
  suggestedExercise: ExerciseSuggestion;
}

/** How an entry was created. */
export type EntrySource = 'talk' | 'write' | 'checkin';

/** A daily entry: a mood tap plus optional free text, plus its analysis. */
export interface Entry {
  id: string;
  createdAt: string; // ISO timestamp
  mood: Mood;
  text: string; // may be empty for a mood-only check-in
  source: EntrySource;
  analysis: AnalysisResult | null;
}

/** A single turn in the Mitra companion conversation. */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ---- Computed insight types (produced client-side, pure functions) ----

/** A trigger correlated with the average mood on the days it appeared. */
export interface TriggerInsight {
  tag: TriggerTag;
  count: number;
  avgMood: number; // average mood across entries where this trigger appeared
}

/** A compassionate weekly synthesis of the student's recent entries. */
export interface WeeklyInsight {
  entryCount: number;
  avgMood: number | null;
  moodTrend: Mood[]; // chronological moods for the sparkline
  topTriggers: TriggerInsight[];
  topEmotions: { label: string; count: number }[];
  headline: string; // the "hidden pattern", framed gently
  copingNudge: string; // avoidance -> active coping nudge
}

// ---- API request/response contracts ----

export interface AnalyzeRequest {
  text: string;
  mood: Mood;
  exam: ExamType | null;
}

export interface ChatRequest {
  messages: ChatMessage[];
  profile: Pick<Profile, 'name' | 'exam' | 'examDate'>;
  recentContext: string; // compact summary of recent entries + detected patterns
}

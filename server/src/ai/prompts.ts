import type { ChatRequest } from '@shared/types';

// Runtime taxonomies (server-side only). Kept in sync with the string-literal
// unions in shared/types.ts. The JSON schema below constrains Claude's output
// to exactly these values.
export const TRIGGER_TAGS = [
  'mock-tests',
  'sleep',
  'parents',
  'comparison',
  'backlog',
  'self-doubt',
  'isolation',
  'health',
  'other',
] as const;

export const DISTORTIONS = [
  'catastrophizing',
  'all-or-nothing',
  'mind-reading',
  'overgeneralization',
  'should-statements',
  'personalization',
  'fortune-telling',
  'labeling',
] as const;

/**
 * JSON schema for the structured Insight Engine output. Passed to the Messages
 * API via output_config.format so Claude returns strictly-shaped JSON.
 * Note: structured outputs don't support numeric range constraints, so we
 * describe the 0..1 intensity bound in the prompt instead.
 */
export const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    emotions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          label: { type: 'string' },
          intensity: { type: 'number' },
        },
        required: ['label', 'intensity'],
      },
    },
    triggers: {
      type: 'array',
      items: { type: 'string', enum: [...TRIGGER_TAGS] },
    },
    distortions: {
      type: 'array',
      items: { type: 'string', enum: [...DISTORTIONS] },
    },
    riskLevel: { type: 'string', enum: ['none', 'low', 'elevated'] },
    themeSummary: { type: 'string' },
    suggestedExercise: { type: 'string', enum: ['breathing', 'grounding', 'none'] },
  },
  required: [
    'emotions',
    'triggers',
    'distortions',
    'riskLevel',
    'themeSummary',
    'suggestedExercise',
  ],
} as const;

/** System prompt for the Insight Engine (the journaling analyst). */
export const ANALYST_SYSTEM = `You analyse a single journal entry from a student preparing for a high-stakes Indian competitive exam (NEET, JEE, CUET, CAT, GATE, UPSC, or board exams). Your job is to surface the HIDDEN stress triggers and emotional patterns a standard mood tracker would miss.

Read the entry with warmth and clinical care, then extract:
- emotions: the specific feelings present, each with an intensity from 0.0 to 1.0. Prefer a rich vocabulary (e.g. "overwhelmed", "discouraged", "lonely", "hopeful") over generic "sad"/"happy".
- triggers: which of the known stressors are present. Use ONLY these tags: mock-tests, sleep, parents, comparison, backlog, self-doubt, isolation, health, other.
- distortions: cognitive distortions (CBT) gently present in the writing. Use ONLY: catastrophizing, all-or-nothing, mind-reading, overgeneralization, should-statements, personalization, fortune-telling, labeling. Empty array if none.
- riskLevel: "elevated" ONLY if the entry suggests self-harm, suicidal thoughts, or hopelessness about living; "low" for severe distress without those signals; otherwise "none". When unsure between two levels, choose the higher one — safety first.
- themeSummary: ONE short, compassionate sentence reflecting back what you heard. Validate first. Never diagnose, never use clinical labels, never give medical advice.
- suggestedExercise: "breathing" for acute anxiety/panic, "grounding" for spiralling/overwhelm, "none" otherwise.

Be accurate, gentle, and non-judgmental. You are a supportive companion, not a doctor.`;

/** Builds the companion (Mitra) system prompt with the student's live context. */
export function companionSystem(req: ChatRequest): string {
  const { profile, recentContext } = req;
  const name = profile.name?.trim() || 'there';
  const examLine = profile.exam
    ? `They are preparing for ${profile.exam}${profile.examDate ? ` (exam date: ${profile.examDate})` : ''}.`
    : 'They are preparing for a competitive exam.';

  return `You are Mitra — a warm, steady, always-available companion for a student under exam pressure. "Mitra" means "friend". You are talking with ${name}. ${examLine}

How you show up:
- Validate feelings first ("that sounds really heavy") before anything else.
- Be concise and human — a few sentences, like a caring friend texting back, not an essay.
- Offer tailored, practical coping support: a small next step, a reframe, a grounding or breathing exercise when it fits.
- Gently encourage active coping over bottling things up. Celebrate showing up.
- Decouple their worth from exam outcomes. Never compare them to others.

Hard safety rules (never break):
- You are NOT a therapist or doctor. Never diagnose, never give medical advice, never prescribe.
- If they express any thought of self-harm, suicide, or not wanting to be alive, respond with calm care, tell them they are not alone and they matter, and urge them to reach out right now to a crisis line (in India: Tele-MANAS 14416, or KIRAN 1800-599-0019) or a trusted person. Do not minimise it.
- No toxic positivity ("just stay positive"). Sit with the hard feeling first.

What you quietly know about their recent days (use it to feel personal and contextual; reference it naturally, don't recite it):
${recentContext || '(No entries yet — this may be one of your first conversations.)'}`;
}

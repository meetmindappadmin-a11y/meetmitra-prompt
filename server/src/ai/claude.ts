import Anthropic from '@anthropic-ai/sdk';
import type { AnalysisResult, ChatRequest, ExamType, Mood } from '@shared/types';
import { ANALYSIS_SCHEMA, ANALYST_SYSTEM, companionSystem } from './prompts.js';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

/** True when a real API key is configured (otherwise the app runs in mock mode). */
export function isLive(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function firstText(content: Anthropic.Messages.ContentBlock[]): string {
  const block = content.find((b) => b.type === 'text');
  return block && block.type === 'text' ? block.text : '';
}

/**
 * Runs the Insight Engine through Claude with a forced JSON schema, so the
 * response is guaranteed to be a strictly-shaped AnalysisResult.
 */
export async function analyzeWithClaude(
  text: string,
  mood: Mood,
  exam: ExamType | null,
): Promise<AnalysisResult> {
  const c = getClient();
  if (!c) throw new Error('No API key configured');

  const userMessage = `Exam context: ${exam ?? 'unspecified'}\nMood (1 heavy – 5 light): ${mood}\n\nJournal entry:\n"""${text}"""`;

  const res = await c.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: ANALYST_SYSTEM,
    messages: [{ role: 'user', content: userMessage }],
    // Structured output: the first text block is guaranteed valid JSON for this schema.
    output_config: { format: { type: 'json_schema', schema: ANALYSIS_SCHEMA } },
  } as Anthropic.Messages.MessageCreateParamsNonStreaming);

  return JSON.parse(firstText(res.content)) as AnalysisResult;
}

/**
 * Streams a companion (Mitra) reply. Each text delta is passed to `onText`;
 * the full reply is returned once streaming completes.
 */
export async function streamCompanion(
  req: ChatRequest,
  onText: (delta: string) => void,
): Promise<string> {
  const c = getClient();
  if (!c) throw new Error('No API key configured');

  const stream = c.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: companionSystem(req),
    messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  stream.on('text', (delta) => onText(delta));
  const final = await stream.finalMessage();
  return firstText(final.content);
}

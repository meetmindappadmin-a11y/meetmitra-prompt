import { z } from 'zod';

const examEnum = z.enum([
  'NEET',
  'JEE',
  'CUET',
  'CAT',
  'GATE',
  'UPSC',
  'Boards',
  'Other',
]);

export const analyzeSchema = z.object({
  text: z.string().max(5000),
  mood: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  exam: examEnum.nullable(),
});

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(5000),
});

export const chatSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(40),
  profile: z.object({
    name: z.string().max(60),
    exam: examEnum.nullable(),
    examDate: z.string().max(20).nullable(),
  }),
  recentContext: z.string().max(4000),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
export type ChatInput = z.infer<typeof chatSchema>;

import type { ExamType } from '@shared/types';
import { EXAM_LABEL } from './labels';

export type Tone = 'gentle' | 'steady' | 'energizing';

export interface ExamContext {
  days: number | null;
  tone: Tone;
  /** Short chip text shown under the header, or null if no date is set. */
  countdown: string | null;
}

/** Whole days from today until the exam date (local), or null. */
export function daysUntil(examDate: string | null): number | null {
  if (!examDate) return null;
  const target = new Date(`${examDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - startToday.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Maps the exam timeline to a tone. Close to the exam → gentler, steadier;
 * far out → calmly energizing. Tone nudges how the UI frames encouragement.
 */
export function examContext(exam: ExamType | null, examDate: string | null): ExamContext {
  const days = daysUntil(examDate);
  let tone: Tone = 'steady';
  if (days !== null) {
    if (days <= 14) tone = 'gentle';
    else if (days >= 90) tone = 'energizing';
  }

  let countdown: string | null = null;
  if (days !== null) {
    const examName = exam ? EXAM_LABEL[exam] : 'your exam';
    if (days > 1) countdown = `${days} days to ${examName}`;
    else if (days === 1) countdown = `${examName} is tomorrow`;
    else if (days === 0) countdown = `${examName} is today — breathe`;
    else countdown = `${examName} is behind you`;
  }

  return { days, tone, countdown };
}

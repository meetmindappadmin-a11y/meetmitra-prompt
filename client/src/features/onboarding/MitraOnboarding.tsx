import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExamType, Profile, TriggerTag } from '@shared/types';
import { useApp } from '../../context/AppContext';
import { Button, Chip } from '../../components/ui';
import { MitraAvatar } from '../../components/MitraAvatar';
import { EXAM_LABEL, TRIGGER_EMOJI, TRIGGER_LABEL } from '../../lib/labels';

type From = 'mitra' | 'you';
interface Msg {
  from: From;
  text: string;
}

const EXAMS: ExamType[] = ['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'Boards', 'Other'];
const CONCERNS: TriggerTag[] = [
  'mock-tests',
  'parents',
  'comparison',
  'sleep',
  'backlog',
  'self-doubt',
  'isolation',
  'health',
];

const INTRO =
  "Hi, I'm Mitra — think of me as a friend who's here for the whole exam stretch, not just the good days. Before anything: everything you tell me stays on this device. No account, no sign-up, nothing shared. Ready?";

export function MitraOnboarding() {
  const { saveProfile } = useApp();
  const navigate = useNavigate();

  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'mitra', text: INTRO }]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);

  const [name, setName] = useState('');
  const [exam, setExam] = useState<ExamType | null>(null);
  const [examDate, setExamDate] = useState('');
  const [concerns, setConcerns] = useState<TriggerTag[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  // Push a "you" reply, then (after a short, friendly pause) the next Mitra line.
  function advance(youText: string, mitraText: string, nextStep: number) {
    setMsgs((m) => [...m, { from: 'you', text: youText }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: 'mitra', text: mitraText }]);
      setStep(nextStep);
    }, 450);
  }

  function toggleConcern(tag: TriggerTag) {
    setConcerns((c) => (c.includes(tag) ? c.filter((t) => t !== tag) : [...c, tag]));
  }

  function finish() {
    const now = new Date().toISOString();
    const profile: Profile = {
      name: name.trim() || 'friend',
      exam,
      examDate: examDate || null,
      concerns,
      consentedAt: now,
      createdAt: now,
    };
    saveProfile(profile);
    navigate('/', { replace: true });
  }

  return (
    <div className="flex h-[100dvh] justify-center sm:items-center">
      <div className="flex h-full w-full max-w-[440px] flex-col overflow-hidden bg-bg sm:h-[min(100dvh-2rem,900px)] sm:rounded-[32px] sm:shadow-lift sm:ring-1 sm:ring-line">
        <header className="flex shrink-0 items-center gap-2.5 border-b border-line bg-surface/85 px-4 py-3 backdrop-blur">
          <MitraAvatar size={36} />
          <div>
            <div className="font-display text-[17px] leading-tight font-semibold">
              <span className="text-grad-primary">MindMitra</span>
            </div>
            <div className="text-xs text-muted">Getting to know each other</div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <Bubble key={i} from={m.from} text={m.text} />
          ))}
          {typing && <TypingBubble />}
        </div>

        <div className="shrink-0 border-t border-line bg-surface p-4">
          {step === 0 && (
            <Button
              className="w-full"
              onClick={() => advance("I'm in", 'Lovely. What should I call you?', 1)}
            >
              I’m in
            </Button>
          )}

          {step === 1 && (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                advance(
                  name.trim(),
                  `Good to meet you, ${name.trim()}. Which mountain are you climbing right now?`,
                  2,
                );
              }}
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or nickname"
                aria-label="Your name"
                className="flex-1 rounded-xl border border-line bg-surface px-4 text-[15px] text-ink outline-none"
              />
              <Button type="submit" disabled={!name.trim()}>
                Next
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-wrap gap-2">
              {EXAMS.map((ex) => {
                const chipLabel = ex === 'Other' ? 'Other' : EXAM_LABEL[ex];
                return (
                  <Chip
                    key={ex}
                    label={chipLabel}
                    selected={exam === ex}
                    onClick={() => {
                      setExam(ex);
                      advance(
                        chipLabel,
                        "When's the big day? You can pick a date, or skip — totally your call.",
                        3,
                      );
                    }}
                  />
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                aria-label="Exam date (optional)"
                className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] text-ink outline-none"
              />
              <Button
                onClick={() =>
                  advance(
                    examDate ? formatDate(examDate) : "I'd rather not say",
                    "Thanks for trusting me. What's been weighing on you most lately? Pick whatever fits — no wrong answers.",
                    4,
                  )
                }
              >
                {examDate ? 'Next' : 'Skip'}
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {CONCERNS.map((tag) => (
                  <Chip
                    key={tag}
                    label={`${TRIGGER_EMOJI[tag]} ${TRIGGER_LABEL[tag]}`}
                    selected={concerns.includes(tag)}
                    onClick={() => toggleConcern(tag)}
                  />
                ))}
              </div>
              <Button
                className="w-full"
                onClick={() =>
                  advance(
                    concerns.length ? concerns.map((c) => TRIGGER_LABEL[c]).join(', ') : 'Not sure yet',
                    "Thank you for sharing that. One last thing — I'm a supportive friend, not a doctor, and I never diagnose. Everything stays on your device. Sound okay?",
                    5,
                  )
                }
              >
                Continue
              </Button>
            </div>
          )}

          {step === 5 && (
            <Button className="w-full" onClick={finish}>
              I understand — let’s begin
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, text }: Msg) {
  const isMitra = from === 'mitra';
  return (
    <div className={`flex items-end gap-2 ${isMitra ? 'justify-start' : 'justify-end'}`}>
      {isMitra && <MitraAvatar size={26} />}
      <div
        className={`max-w-[82%] animate-rise rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isMitra
            ? 'rounded-bl-md border border-line bg-surface text-ink shadow-soft'
            : 'rounded-br-md bg-grad-primary text-primary-ink'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2" aria-live="polite">
      <MitraAvatar size={26} />
      <div className="rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-muted shadow-soft">
        <span className="inline-flex gap-1">
          <Dot /> <Dot /> <Dot />
        </span>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" />;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card, Page } from '../../components/ui';

type Focus = 'breathing' | 'grounding';

export function CalmView() {
  const location = useLocation();
  const initial = ((location.state as { focus?: Focus } | null)?.focus ?? 'breathing') as Focus;
  const [tab, setTab] = useState<Focus>(initial === 'grounding' ? 'grounding' : 'breathing');

  return (
    <Page max="md">
      <div
        role="tablist"
        aria-label="Calming exercises"
        className="flex gap-1 rounded-2xl border border-line bg-surface-2 p-1 shadow-soft"
      >
        <TabButton active={tab === 'breathing'} onClick={() => setTab('breathing')}>
          🌬️ Breathe
        </TabButton>
        <TabButton active={tab === 'grounding'} onClick={() => setTab('grounding')}>
          🌿 Ground
        </TabButton>
      </div>
      <div className="mt-4">{tab === 'breathing' ? <Breathing /> : <Grounding />}</div>
    </Page>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      onClick={onClick}
      aria-selected={active}
      className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
        active ? 'bg-surface text-ink shadow-soft' : 'text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

// ---- Breathing (box breathing, 4-4-4-4) ----

const PHASE_SECONDS = 4;
const CYCLE_SECONDS = PHASE_SECONDS * 4;
const PHASES = [
  { label: 'Breathe in', scale: 1 },
  { label: 'Hold', scale: 1 },
  { label: 'Breathe out', scale: 0.55 },
  { label: 'Hold', scale: 0.55 },
];

function Breathing() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // A single, pure ticker. All phase state is derived — StrictMode-safe.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const within = elapsed % CYCLE_SECONDS;
  const phaseIndex = Math.floor(within / PHASE_SECONDS);
  const phase = PHASES[phaseIndex]!;
  const secondsLeft = PHASE_SECONDS - (within % PHASE_SECONDS);
  const cycles = Math.floor(elapsed / CYCLE_SECONDS);

  function toggle() {
    setElapsed(0);
    setRunning((r) => !r);
  }

  return (
    <Card className="flex flex-col items-center text-center">
      <p className="text-sm text-muted">Box breathing — in 4, hold 4, out 4, hold 4.</p>

      <div className="relative my-6 grid h-52 w-52 place-items-center">
        <div aria-hidden className="absolute inset-0 rounded-full border border-calm/25" />
        <div aria-hidden className="absolute inset-5 rounded-full border border-calm/15" />
        <div
          aria-hidden
          className="bg-grad-calm h-40 w-40 rounded-full"
          style={{
            transform: `scale(${running ? phase.scale : 0.7})`,
            transition: running ? `transform ${PHASE_SECONDS}s ease-in-out` : 'none',
          }}
        />
        <div className="absolute text-center" aria-live="polite">
          <div className="font-display text-lg font-medium text-ink">
            {running ? phase.label : 'Ready?'}
          </div>
          {running && <div className="text-3xl font-semibold text-calm">{secondsLeft}</div>}
        </div>
      </div>

      {running && cycles > 0 && (
        <p className="mb-3 text-sm text-muted">
          {cycles} calm round{cycles === 1 ? '' : 's'} — beautifully done.
        </p>
      )}

      <Button variant={running ? 'ghost' : 'calm'} className="w-full" onClick={toggle}>
        {running ? 'Finish' : 'Begin'}
      </Button>
    </Card>
  );
}

// ---- Grounding (5-4-3-2-1) ----

const STEPS = [
  { n: 5, sense: 'things you can see', emoji: '👀' },
  { n: 4, sense: 'things you can feel or touch', emoji: '✋' },
  { n: 3, sense: 'things you can hear', emoji: '👂' },
  { n: 2, sense: 'things you can smell', emoji: '👃' },
  { n: 1, sense: 'thing you can taste', emoji: '👅' },
];

function Grounding() {
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  if (done) {
    return (
      <Card className="text-center">
        <div className="mb-2 text-3xl" aria-hidden>
          🌼
        </div>
        <p className="text-[15px] text-ink">You’re here, in this moment. Notice your feet on the floor.</p>
        <Button variant="ghost" className="mt-4 w-full" onClick={() => setStep(0)}>
          Again
        </Button>
      </Card>
    );
  }

  const s = STEPS[step]!;
  return (
    <Card className="text-center">
      <p className="text-sm text-muted">5-4-3-2-1 grounding — come back to right now.</p>
      <div className="my-6">
        <div className="text-5xl" aria-hidden>
          {s.emoji}
        </div>
        <p className="mt-3 text-lg text-ink">
          Name <span className="font-semibold">{s.n}</span> {s.sense}.
        </p>
      </div>
      <Button variant="calm" className="w-full" onClick={() => setStep((v) => v + 1)}>
        {step === STEPS.length - 1 ? 'Done' : 'Next'}
      </Button>
      <p className="mt-2 text-xs text-muted">Step {step + 1} of {STEPS.length}</p>
    </Card>
  );
}

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Mood, TriggerInsight } from '@shared/types';
import { useApp } from '../../context/AppContext';
import { Button, Card, SectionTitle } from '../../components/ui';
import { computeWeeklyInsight } from '../../lib/insights';
import { TRIGGER_EMOJI, TRIGGER_LABEL } from '../../lib/labels';

export function InsightsView() {
  const { entries, resetAll } = useApp();
  const navigate = useNavigate();
  const weekly = useMemo(() => computeWeeklyInsight(entries), [entries]);

  if (entries.length === 0) {
    return (
      <div className="p-4">
        <Card className="animate-rise text-center">
          <div className="mb-2 text-3xl" aria-hidden>
            🌱
          </div>
          <p className="text-[15px] text-ink">Nothing here yet — and that’s okay.</p>
          <p className="mt-1 text-sm text-muted">
            After a few check-ins, MindMitra will gently surface the patterns behind your tougher
            days — the ones that are hard to spot from the inside.
          </p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Do a check-in
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 pb-8">
      <Card className="animate-rise bg-grad-calm">
        <SectionTitle>What I’m noticing</SectionTitle>
        <p className="font-display text-lg leading-snug text-ink">{weekly.headline}</p>
      </Card>

      {weekly.moodTrend.length >= 2 && (
        <Card>
          <SectionTitle>Mood over time</SectionTitle>
          <Sparkline values={weekly.moodTrend} />
          {weekly.avgMood !== null && (
            <p className="mt-2 text-sm text-muted">
              Average so far: {weekly.avgMood.toFixed(1)} / 5 across {weekly.entryCount} check-in
              {weekly.entryCount === 1 ? '' : 's'}.
            </p>
          )}
        </Card>
      )}

      {weekly.topTriggers.length > 0 && (
        <Card>
          <SectionTitle>What tends to weigh on you</SectionTitle>
          <div className="space-y-3">
            {weekly.topTriggers.map((t) => (
              <TriggerBar key={t.tag} insight={t} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Longer bars mark what shows up on your heavier days — not a verdict, just a pattern worth
            seeing.
          </p>
        </Card>
      )}

      {weekly.topEmotions.length > 0 && (
        <Card>
          <SectionTitle>Feelings you’ve named</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {weekly.topEmotions.map((e) => (
              <span
                key={e.label}
                className="rounded-full border border-line bg-surface-2 px-3 py-1 text-sm text-ink"
              >
                {e.label}
                {e.count > 1 && <span className="ml-1 text-muted">×{e.count}</span>}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Naming feelings precisely is a real skill — and it helps you steer them.
          </p>
        </Card>
      )}

      <Card className="bg-primary-soft">
        <p className="text-[15px] leading-relaxed text-ink">💡 {weekly.copingNudge}</p>
      </Card>

      <div className="pt-2 text-center">
        <p className="text-xs text-muted">Everything here lives only on this device.</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Erase all your check-ins and notes from this device? This cannot be undone.')) {
              resetAll();
              navigate('/');
            }
          }}
          className="mt-1 text-xs text-muted underline underline-offset-2"
        >
          Erase my data
        </button>
      </div>
    </div>
  );
}

function TriggerBar({ insight }: { insight: TriggerInsight }) {
  // "Drag" = how far the average mood on these days sits below light (5).
  const drag = Math.min(1, Math.max(0, (5 - insight.avgMood) / 4));
  const pct = Math.round(drag * 100);
  const color = drag > 0.5 ? 'var(--warm)' : 'var(--primary)';
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-ink">
        <span>
          {TRIGGER_EMOJI[insight.tag]} {TRIGGER_LABEL[insight.tag]}
        </span>
        <span className="text-xs text-muted">
          {insight.count}× · avg {insight.avgMood.toFixed(1)}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${Math.max(8, pct)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: Mood[] }) {
  const w = 300;
  const h = 64;
  const pad = 8;
  const span = values.length > 1 ? values.length - 1 : 1;
  const x = (i: number) => pad + (i * (w - 2 * pad)) / span;
  const y = (v: Mood) => pad + ((5 - v) / 4) * (h - 2 * pad);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Your mood trend over time">
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={3} fill="var(--primary)" />
      ))}
    </svg>
  );
}

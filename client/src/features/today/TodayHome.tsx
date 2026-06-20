import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Mood } from '@shared/types';
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../../components/ui';
import { createEntry } from '../../lib/entry';
import { examContext } from '../../lib/exam';
import { MoodTap } from './MoodTap';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function TodayHome() {
  const { profile, entries, addEntry } = useApp();
  const navigate = useNavigate();
  const [mood, setMood] = useState<Mood | null>(null);
  const [logged, setLogged] = useState(false);

  const tone = examContext(profile?.exam ?? null, profile?.examDate ?? null).tone;
  const toneLine =
    tone === 'gentle'
      ? 'The exam is close. Let’s keep today kind and steady.'
      : tone === 'energizing'
        ? 'Plenty of runway ahead — one steady day at a time.'
        : 'One day at a time. I’m right here with you.';

  function justLog() {
    if (!mood) return;
    addEntry(createEntry(mood, '', 'checkin', null));
    setLogged(true);
  }

  return (
    <div className="space-y-5 p-4 pb-8">
      <div className="animate-rise">
        <h1 className="font-display text-[26px] font-semibold leading-tight text-ink">
          {greeting()}, {profile?.name ?? 'friend'}.
        </h1>
        <p className="mt-1.5 text-[15px] text-muted">{toneLine}</p>
      </div>

      {!logged ? (
        <Card className="animate-rise">
          <p className="mb-3 text-[15px] font-medium text-ink">How’s today sitting with you?</p>
          <MoodTap value={mood} onChange={setMood} />

          {mood && (
            <div className="mt-5 animate-rise">
              <p className="mb-2 text-sm text-muted">
                Want to talk it out, write it down, or just breathe? No pressure to do any of them.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <DoorButton
                  emoji="💬"
                  label="Talk"
                  onClick={() => navigate('/talk', { state: { mood } })}
                />
                <DoorButton
                  emoji="✍️"
                  label="Write"
                  onClick={() => navigate('/write', { state: { mood } })}
                />
                <DoorButton
                  emoji="🌬️"
                  label="Breathe"
                  onClick={() => navigate('/calm', { state: { focus: 'breathing' } })}
                />
              </div>
              <button
                type="button"
                onClick={justLog}
                className="mt-3 w-full text-sm text-muted underline-offset-2 hover:underline"
              >
                Just log this moment
              </button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="animate-rise">
          <p className="text-[15px] text-ink">Logged. Thank you for checking in. 🌿</p>
          {mood && mood <= 2 && (
            <Button
              variant="calm"
              className="mt-3 w-full"
              onClick={() => navigate('/calm', { state: { focus: 'breathing' } })}
            >
              Take a minute to breathe?
            </Button>
          )}
          <button
            type="button"
            onClick={() => {
              setLogged(false);
              setMood(null);
            }}
            className="mt-3 w-full text-sm text-muted underline-offset-2 hover:underline"
          >
            Check in again
          </button>
        </Card>
      )}

      {entries.length > 0 && (
        <button
          type="button"
          onClick={() => navigate('/insights')}
          className="w-full text-left"
        >
          <Card className="transition hover:border-primary/40">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-medium text-ink">Your patterns so far</div>
                <div className="text-sm text-muted">
                  {entries.length} check-in{entries.length === 1 ? '' : 's'} · see what they reveal
                </div>
              </div>
              <span aria-hidden className="text-primary">
                →
              </span>
            </div>
          </Card>
        </button>
      )}
    </div>
  );
}

function DoorButton({
  emoji,
  label,
  onClick,
}: {
  emoji: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface-2 text-sm text-ink transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface hover:shadow-soft"
    >
      <span aria-hidden className="text-2xl">
        {emoji}
      </span>
      {label}
    </button>
  );
}

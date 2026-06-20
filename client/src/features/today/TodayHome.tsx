import { useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Mood } from '@shared/types';
import { useApp } from '../../context/AppContext';
import { Button, Card, Page } from '../../components/ui';
import { GlossTile, BreatheGlyph, TalkGlyph, WriteGlyph } from '../../components/icons';
import { MitraAvatar } from '../../components/MitraAvatar';
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
    <Page max="2xl">
      <div className="animate-rise">
        <h1 className="font-display text-[28px] leading-tight font-semibold text-ink sm:text-[34px]">
          {greeting()}, {profile?.name ?? 'friend'}.
        </h1>
        <p className="mt-1.5 text-[15px] text-muted sm:text-base">{toneLine}</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {!logged ? (
            <Card className="animate-rise">
              <p className="mb-3 text-[15px] font-medium text-ink">How’s today sitting with you?</p>
              <MoodTap value={mood} onChange={setMood} />

              {mood && (
                <div className="mt-6 animate-rise">
                  <p className="mb-2.5 text-sm text-muted">
                    Want to talk it out, write it down, or just breathe? No pressure to do any of them.
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <DoorButton
                      Icon={TalkGlyph}
                      label="Talk"
                      hint="Say it out loud"
                      onClick={() => navigate('/talk', { state: { mood } })}
                    />
                    <DoorButton
                      Icon={WriteGlyph}
                      label="Write"
                      hint="Just for you"
                      onClick={() => navigate('/write', { state: { mood } })}
                    />
                    <DoorButton
                      Icon={BreatheGlyph}
                      label="Breathe"
                      hint="Settle your body"
                      onClick={() => navigate('/calm', { state: { focus: 'breathing' } })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={justLog}
                    className="mt-3 w-full rounded-xl py-2 text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
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
                className="mt-3 w-full rounded-xl py-2 text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
              >
                Check in again
              </button>
            </Card>
          )}
        </div>

        <aside className="space-y-4 lg:col-span-2">
          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/insights')}
              className="block w-full text-left"
            >
              <Card className="transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[15px] font-semibold text-ink">Your patterns so far</div>
                    <div className="mt-0.5 text-sm text-muted">
                      {entries.length} check-in{entries.length === 1 ? '' : 's'} · see what they reveal
                    </div>
                  </div>
                  <span aria-hidden className="text-xl text-primary">→</span>
                </div>
              </Card>
            </button>
          )}

          <Card className="bg-grad-calm">
            <div className="flex items-start gap-3">
              <MitraAvatar size={40} />
              <div>
                <div className="text-[15px] font-semibold text-ink">Mitra’s here</div>
                <p className="mt-1 text-sm text-ink/80">
                  Whenever it gets heavy — even at 3am — I’m one tap away. No judgement, ever.
                </p>
                <Button className="mt-3" onClick={() => navigate('/talk')}>
                  Talk to Mitra
                </Button>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </Page>
  );
}

function DoorButton({
  Icon,
  label,
  hint,
  onClick,
}: {
  Icon: ComponentType<{ size?: number }>;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface hover:shadow-soft sm:flex-col sm:items-start sm:gap-3 sm:p-4"
    >
      <GlossTile size={42} radius={13}>
        <Icon size={22} />
      </GlossTile>
      <span>
        <span className="block text-[15px] font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
    </button>
  );
}

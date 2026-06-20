import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnalysisResult, Mood } from '@shared/types';
import { useApp } from '../../context/AppContext';
import { useSafety } from '../safety/SafetyProvider';
import { Button, Card, Page } from '../../components/ui';
import { GlossTile, LockGlyph, SparkleGlyph } from '../../components/icons';
import { analyzeEntry } from '../../lib/api';
import { createEntry } from '../../lib/entry';
import { clientCrisisRisk } from '../../lib/crisis';
import { DISTORTION_REFRAME, TRIGGER_EMOJI, TRIGGER_LABEL } from '../../lib/labels';

const PROMPT = 'What’s taking up the most space in your head right now?';

export function PrivateJournal() {
  const { profile, addEntry } = useApp();
  const { flagCrisis } = useSafety();
  const navigate = useNavigate();
  const location = useLocation();
  const mood = ((location.state as { mood?: Mood } | null)?.mood ?? 3) as Mood;

  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function save() {
    const body = text.trim();
    if (!body || saving) return;
    setSaving(true);
    if (clientCrisisRisk(body)) flagCrisis();

    const res = await analyzeEntry({ text: body, mood, exam: profile?.exam ?? null });
    const analysis = res?.analysis ?? null;
    addEntry(createEntry(mood, body, 'write', analysis));
    if (analysis?.riskLevel === 'elevated') flagCrisis();

    setResult(analysis);
    setSaving(false);
  }

  if (result) {
    return (
      <Page max="md">
        <Card className="animate-rise">
          <div className="mb-3 flex items-center gap-3">
            <GlossTile size={38} radius={12} gradient="lilac">
              <SparkleGlyph size={20} />
            </GlossTile>
            <span className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">
              A gentle reflection
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink">{result.themeSummary}</p>

          {result.triggers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.triggers.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted"
                >
                  {TRIGGER_EMOJI[t]} {TRIGGER_LABEL[t]}
                </span>
              ))}
            </div>
          )}

          {result.distortions[0] && (
            <p className="mt-3 rounded-xl bg-primary-soft px-3 py-2 text-sm text-ink">
              A gentle thought: {DISTORTION_REFRAME[result.distortions[0]]}
            </p>
          )}
        </Card>

        {result.suggestedExercise !== 'none' && (
          <Button
            variant="calm"
            className="mt-4 w-full"
            onClick={() => navigate('/calm', { state: { focus: result.suggestedExercise } })}
          >
            {result.suggestedExercise === 'breathing'
              ? 'Try a breathing minute'
              : 'Try a grounding exercise'}
          </Button>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setText('');
              setResult(null);
            }}
          >
            Write more
          </Button>
          <Button variant="soft" onClick={() => navigate('/')}>
            Done
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-2.5 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-lg px-2 py-1 text-sm text-muted transition hover:text-ink"
        >
          ‹ Today
        </button>
        <span className="text-sm font-semibold text-ink">Private note</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted">
          <LockGlyph size={14} />
          stays on your device
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4 sm:px-6">
        <p className="mb-2 text-[15px] text-muted">{PROMPT}</p>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write as much or as little as you like. No one else will read this."
          aria-label="Your private note"
          className="flex-1 resize-none rounded-2xl border border-line bg-surface p-4 text-[15px] leading-relaxed text-ink shadow-soft outline-none focus:border-primary/40"
        />
        <Button className="mt-3 w-full" onClick={save} disabled={!text.trim() || saving}>
          {saving ? 'Reading it with care…' : 'Save reflection'}
        </Button>
      </div>
    </div>
  );
}

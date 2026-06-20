import type { Mood } from '@shared/types';
import { MOODS, moodEmoji, moodLabel } from '../../lib/mood';

// The 10-second core action: a single, gentle tap. Never a required form.
export function MoodTap({
  value,
  onChange,
}: {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}) {
  return (
    <div role="radiogroup" aria-label="How are you feeling right now?" className="flex justify-between gap-1.5">
      {MOODS.map((m) => {
        const active = value === m;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={moodLabel(m)}
            onClick={() => onChange(m)}
            className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl border py-3.5 transition ${
              active
                ? 'scale-[1.03] border-primary bg-primary-soft shadow-soft'
                : 'border-line bg-surface hover:border-primary/40'
            }`}
          >
            <span className="text-[27px] leading-none" aria-hidden>
              {moodEmoji(m)}
            </span>
            <span className={`text-[11px] ${active ? 'font-medium text-ink' : 'text-muted'}`}>
              {moodLabel(m)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

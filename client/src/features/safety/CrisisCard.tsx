import { HELPLINES } from '../../lib/labels';
import { Button } from '../../components/ui';

// The crisis / help surface. Same card whether the user tapped "Help" or a
// crisis signal was detected — the detected variant leads with stronger
// reassurance. Never buried, never alarming for its own sake.

export function CrisisCard({
  reason,
  onClose,
}: {
  reason: 'help' | 'crisis';
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
    >
      <div className="w-full max-w-[420px] animate-rise rounded-3xl bg-surface p-5 shadow-2xl">
        <h2 id="crisis-title" className="text-lg font-semibold text-ink">
          {reason === 'crisis' ? 'You matter — and you are not alone' : 'Reach a real person, any time'}
        </h2>

        {reason === 'crisis' && (
          <p className="mt-2 text-[15px] leading-relaxed text-ink">
            What you’re feeling sounds really heavy. Please talk to someone who can support you
            right now — you deserve that care. These lines are free and confidential.
          </p>
        )}

        <ul className="mt-4 space-y-2">
          {HELPLINES.map((line) => (
            <li key={line.number} className="rounded-2xl border border-line bg-surface-2 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-ink">{line.name}</div>
                  <div className="text-sm text-muted">{line.note}</div>
                </div>
                <a
                  href={`tel:${line.number.replace(/[^0-9]/g, '')}`}
                  className="shrink-0 rounded-xl bg-danger px-3 py-2 text-sm font-semibold text-white"
                >
                  {line.number}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          MindMitra is a supportive companion, not a medical or emergency service. If you’re in
          immediate danger, please call your local emergency number.
        </p>

        <Button variant="ghost" className="mt-4 w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

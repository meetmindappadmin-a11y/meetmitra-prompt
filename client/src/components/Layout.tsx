import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSafety } from '../features/safety/SafetyProvider';
import { examContext } from '../lib/exam';
import { BottomNav } from './BottomNav';

function BrandMark() {
  return (
    <span
      aria-hidden
      className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-grad-primary text-primary-ink shadow-soft"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 18 4c2 0 3 .5 3 .5s.5 9-6 13c-2.4 1.5-4 1.5-4 1.5z" />
        <path d="M8 21c0-4 2-7 5-9" />
      </svg>
    </span>
  );
}

function Header() {
  const { profile } = useApp();
  const { openHelp } = useSafety();
  const exam = examContext(profile?.exam ?? null, profile?.examDate ?? null);

  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-line bg-surface/85 px-4 py-3 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2.5">
        <BrandMark />
        <div className="min-w-0">
          <div className="font-display text-[17px] font-semibold leading-tight text-ink">MindMitra</div>
          {exam.countdown && <div className="truncate text-xs text-muted">{exam.countdown}</div>}
        </div>
      </div>
      <button
        type="button"
        onClick={openHelp}
        aria-label="Get urgent help and crisis resources"
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-danger/25 bg-danger-bg px-3.5 text-sm font-medium text-danger transition hover:brightness-[0.97]"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
          <path d="M12 8v5M12 16.5v.01" />
        </svg>
        Help
      </button>
    </header>
  );
}

export function Layout() {
  return (
    <div className="flex h-[100dvh] justify-center sm:items-center">
      <div className="flex h-full w-full max-w-[440px] flex-col overflow-hidden bg-bg sm:h-[min(100dvh-2rem,900px)] sm:rounded-[32px] sm:shadow-lift sm:ring-1 sm:ring-line">
        <Header />
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

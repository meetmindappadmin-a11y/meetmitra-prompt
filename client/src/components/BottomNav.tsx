import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5" />
      <path d="M4 15l4-4 3 3 6-7" />
      <path d="M20 19H4" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 18 4c2 0 3 .5 3 .5s.5 9-6 13c-2.4 1.5-4 1.5-4 1.5z" />
      <path d="M8 21c0-4 2-7 5-9" />
    </svg>
  );
}

const ITEMS: { to: string; label: string; icon: ReactNode; end: boolean }[] = [
  { to: '/', label: 'Today', icon: <SunIcon />, end: true },
  { to: '/insights', label: 'Insights', icon: <ChartIcon />, end: false },
  { to: '/calm', label: 'Calm', icon: <LeafIcon />, end: false },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="flex shrink-0 items-stretch justify-around border-t border-line bg-surface px-2 py-1.5"
    >
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
              isActive ? 'text-primary' : 'text-muted hover:text-ink'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                aria-hidden
                className={`grid h-8 w-16 place-items-center rounded-full transition ${
                  isActive ? 'bg-primary-soft' : ''
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

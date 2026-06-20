import { NavLink, Outlet } from 'react-router-dom';
import type { ComponentType } from 'react';
import { useApp } from '../context/AppContext';
import { useSafety } from '../features/safety/SafetyProvider';
import { examContext } from '../lib/exam';
import { GlossTile, HeartGlyph, InsightsGlyph, LeafGlyph, SunGlyph } from './icons';

interface NavEntry {
  to: string;
  label: string;
  end: boolean;
  Icon: ComponentType<{ size?: number }>;
}

const NAV: NavEntry[] = [
  { to: '/', label: 'Today', end: true, Icon: SunGlyph },
  { to: '/insights', label: 'Insights', end: false, Icon: InsightsGlyph },
  { to: '/calm', label: 'Calm', end: false, Icon: LeafGlyph },
];

function NavItem({ to, end, label, Icon }: NavEntry) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-full py-1 pr-1 pl-1 text-sm font-medium transition sm:pr-3.5 ${
          isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'
        }`
      }
    >
      {({ isActive }) =>
        isActive ? (
          <>
            <GlossTile size={28} radius={9}>
              <Icon size={16} />
            </GlossTile>
            <span className="hidden sm:inline">{label}</span>
          </>
        ) : (
          <>
            <span className="grid h-7 w-7 place-items-center">
              <Icon size={20} />
            </span>
            <span className="hidden sm:inline">{label}</span>
          </>
        )
      }
    </NavLink>
  );
}

function Header() {
  const { profile } = useApp();
  const { openHelp } = useSafety();
  const exam = examContext(profile?.exam ?? null, profile?.examDate ?? null);

  return (
    <header className="glass shrink-0 border-b border-line">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <GlossTile size={38} radius={12} glow>
            <LeafGlyph size={21} />
          </GlossTile>
          <div className="min-w-0">
            <div className="font-display text-[18px] leading-tight font-semibold">
              <span className="text-grad-primary">MindMitra</span>
            </div>
            {exam.countdown && <div className="truncate text-xs text-muted">{exam.countdown}</div>}
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-line bg-surface/55 p-1 shadow-soft"
        >
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <button
          type="button"
          onClick={openHelp}
          aria-label="Get urgent help and crisis resources"
          className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border border-danger/25 bg-danger-bg px-3 text-sm font-semibold text-danger transition hover:brightness-[0.97] sm:px-3.5"
        >
          <HeartGlyph size={16} />
          <span className="hidden sm:inline">Help</span>
        </button>
      </div>
    </header>
  );
}

export function Layout() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <Header />
      <main className="min-h-0 flex-1">
        <div className="mx-auto h-full w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

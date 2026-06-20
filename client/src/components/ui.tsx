import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Small, accessible UI primitives shared across screens.

type PageMax = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
const PAGE_MAX: Record<PageMax, string> = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-none',
};

/** Full-height, scrollable, centered content column for dashboard screens. */
export function Page({
  children,
  max = 'lg',
  className = '',
}: {
  children: ReactNode;
  max?: PageMax;
  className?: string;
}) {
  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <div className={`mx-auto w-full ${PAGE_MAX[max]} px-4 py-6 sm:px-6 sm:py-8 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`gloss-edge rounded-3xl border border-line bg-surface p-5 shadow-soft ${className}`}
    >
      {children}
    </section>
  );
}

type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'calm';

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'gloss-edge bg-grad-primary text-primary-ink shadow-soft hover:shadow-glow hover:brightness-[1.03] active:brightness-95',
  soft: 'bg-primary-soft text-ink hover:brightness-[0.98]',
  calm: 'gloss-edge bg-calm text-white shadow-soft hover:brightness-[1.04]',
  ghost: 'bg-transparent text-ink border border-line hover:bg-surface-2',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${VARIANT[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Chip({
  label,
  selected = false,
  onClick,
}: {
  label: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-[42px] rounded-full border px-3.5 py-1.5 text-sm transition ${
        selected
          ? 'border-primary/40 bg-primary-soft text-ink shadow-soft'
          : 'border-line bg-surface text-muted hover:border-primary/40 hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 text-xs font-semibold tracking-[0.08em] text-muted uppercase">{children}</h2>
  );
}

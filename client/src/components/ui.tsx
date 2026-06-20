import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Small, accessible UI primitives shared across screens.

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl border border-line bg-surface p-5 shadow-soft ${className}`}>
      {children}
    </section>
  );
}

type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'calm';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-grad-primary text-primary-ink shadow-soft hover:brightness-[1.04] active:brightness-95',
  soft: 'bg-primary-soft text-ink hover:brightness-[0.98]',
  calm: 'bg-calm text-white shadow-soft hover:brightness-[1.04]',
  ghost: 'bg-transparent text-ink border border-line hover:bg-surface-2',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT[variant]} ${className}`}
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
          ? 'border-primary bg-primary-soft text-ink shadow-soft'
          : 'border-line bg-surface text-muted hover:border-primary/40 hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">{children}</h2>;
}

import type { ReactNode } from 'react';

/*
  Glossy, gradient-forward icon system.
  - Glyphs draw with `currentColor`, so they tint to nav/active state.
  - GlossTile wraps any glyph in a premium gradient chip with a soft top sheen
    and depth — the "high quality, Figma-inspired" treatment used for the brand
    mark, the action tiles and feature accents.
*/

interface GlyphProps {
  size?: number;
  className?: string;
}

function Glyph({ size = 22, className, children }: GlyphProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function SunGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 2.6v2M12 19.4v2M4.4 4.4l1.4 1.4M18.2 18.2l1.4 1.4M2.6 12h2M19.4 12h2M4.4 19.6l1.4-1.4M18.2 5.8l1.4-1.4" />
    </Glyph>
  );
}

export function InsightsGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <rect x="3.5" y="13" width="3.6" height="7.4" rx="1.4" />
      <rect x="10.2" y="8.6" width="3.6" height="11.8" rx="1.4" />
      <rect x="16.9" y="4.4" width="3.6" height="16" rx="1.4" />
    </Glyph>
  );
}

export function LeafGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <path d="M11 20A7 7 0 0 1 18 4c2 0 3 .5 3 .5s.5 9-6 13c-2.4 1.5-4 1.5-4 1.5z" />
      <path d="M8 21c0-4 2-7 5-9" />
    </Glyph>
  );
}

export function TalkGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 20l1.8-4.3A7.5 7.5 0 1 1 20 11.5z" />
      <path d="M9 11h6M9 8.4h4" />
    </Glyph>
  );
}

export function WriteGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <path d="M4 20.5h4L18.6 9.9a2.2 2.2 0 0 0-3.1-3.1L4.9 17.4 4 20.5z" />
      <path d="M13.7 7.7l3.1 3.1" />
    </Glyph>
  );
}

export function BreatheGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <path d="M3 8h10.5a2.8 2.8 0 1 0-2.8-2.8" />
      <path d="M3 12h13a2.8 2.8 0 1 1-2.8 2.8" />
      <path d="M3 16h7.5a2.4 2.4 0 1 1-2.4 2.4" />
    </Glyph>
  );
}

export function HeartGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <path d="M12 20.3s-6.8-4.2-9-8C1.2 8.6 2.8 4.8 6.2 4.8c2 0 3.2 1.2 3.8 2.3.6-1.1 1.8-2.3 3.8-2.3 3.4 0 5 3.8 3.2 7.5-2.2 3.8-9 8-9 8z" />
    </Glyph>
  );
}

export function SparkleGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <path d="M12 3.5c.4 3.6 1.9 5.1 5.5 5.5-3.6.4-5.1 1.9-5.5 5.5-.4-3.6-1.9-5.1-5.5-5.5 3.6-.4 5.1-1.9 5.5-5.5z" />
      <path d="M18.5 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5z" />
    </Glyph>
  );
}

export function LockGlyph(p: GlyphProps) {
  return (
    <Glyph {...p}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.4" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 14.5v2.5" />
    </Glyph>
  );
}

type GlossGradient = 'primary' | 'lilac';

/** Premium gradient chip with a soft top-left sheen and depth. */
export function GlossTile({
  size = 40,
  radius = 14,
  gradient = 'primary',
  glow = false,
  className = '',
  children,
}: {
  size?: number;
  radius?: number;
  gradient?: GlossGradient;
  glow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const grad = gradient === 'lilac' ? 'bg-grad-lilac' : 'bg-grad-primary';
  return (
    <span
      aria-hidden
      className={`gloss-edge relative grid shrink-0 place-items-center text-white ${grad} ${
        glow ? 'shadow-glow' : 'shadow-soft'
      } ${className}`}
      style={{ height: size, width: size, borderRadius: radius }}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(62%_55%_at_30%_20%,rgba(255,255,255,0.5),transparent_62%)]" />
      <span className="relative grid place-items-center">{children}</span>
    </span>
  );
}

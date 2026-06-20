import type { ReactNode } from 'react';
import {
  BarChart3,
  Heart,
  Leaf,
  Lock,
  MessageCircle,
  PenLine,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react';

/*
  Icon system — crisp, consistent line icons from Lucide, wrapped so the rest of
  the app keeps importing the same named glyphs. GlossTile presents any glyph in
  a premium gradient chip with a soft top sheen for the brand mark and accents.
*/

interface GlyphProps {
  size?: number;
}

export const SunGlyph = ({ size = 22 }: GlyphProps) => <Sun size={size} strokeWidth={2} />;
export const InsightsGlyph = ({ size = 22 }: GlyphProps) => (
  <BarChart3 size={size} strokeWidth={2} />
);
export const LeafGlyph = ({ size = 22 }: GlyphProps) => <Leaf size={size} strokeWidth={2} />;
export const TalkGlyph = ({ size = 22 }: GlyphProps) => (
  <MessageCircle size={size} strokeWidth={2} />
);
export const WriteGlyph = ({ size = 22 }: GlyphProps) => <PenLine size={size} strokeWidth={2} />;
export const BreatheGlyph = ({ size = 22 }: GlyphProps) => <Wind size={size} strokeWidth={2} />;
export const HeartGlyph = ({ size = 22 }: GlyphProps) => <Heart size={size} strokeWidth={2} />;
export const SparkleGlyph = ({ size = 22 }: GlyphProps) => <Sparkles size={size} strokeWidth={2} />;
export const LockGlyph = ({ size = 22 }: GlyphProps) => <Lock size={size} strokeWidth={2} />;

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

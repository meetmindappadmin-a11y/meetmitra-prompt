import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Annoyed,
  BarChart3,
  ClipboardList,
  CloudRain,
  Frown,
  Heart,
  HeartPulse,
  HelpCircle,
  Laugh,
  Layers,
  Leaf,
  Lock,
  Meh,
  MessageCircle,
  Moon,
  PenLine,
  Scale,
  Smile,
  Sparkles,
  Sun,
  UserMinus,
  Users,
  Wind,
} from 'lucide-react';
import type { Mood, TriggerTag } from '@shared/types';

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

// Mood faces — a gentle 1→5 gradient. Red is reserved for crisis, so the
// heaviest mood uses a soft mauve, never an alarming red.
const MOOD_ICON: Record<Mood, { Icon: LucideIcon; color: string }> = {
  1: { Icon: Frown, color: '#b9667f' },
  2: { Icon: Annoyed, color: '#cc8a52' },
  3: { Icon: Meh, color: '#7a8194' },
  4: { Icon: Smile, color: '#3a9d77' },
  5: { Icon: Laugh, color: '#4a7fd6' },
};

export function MoodIcon({ mood, size = 26 }: { mood: Mood; size?: number }) {
  const { Icon, color } = MOOD_ICON[mood];
  return <Icon size={size} strokeWidth={2} color={color} />;
}

const TRIGGER_ICON: Record<TriggerTag, LucideIcon> = {
  'mock-tests': ClipboardList,
  sleep: Moon,
  parents: Users,
  comparison: Scale,
  backlog: Layers,
  'self-doubt': CloudRain,
  isolation: UserMinus,
  health: HeartPulse,
  other: HelpCircle,
};

export function TriggerIcon({ tag, size = 16 }: { tag: TriggerTag; size?: number }) {
  const Icon = TRIGGER_ICON[tag];
  return <Icon size={size} strokeWidth={2} />;
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

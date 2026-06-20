import { GlossTile, LeafGlyph } from './icons';

// Mitra's face — a glossy gradient lozenge with the brand leaf.
export function MitraAvatar({ size = 28 }: { size?: number }) {
  return (
    <GlossTile size={size} radius={size / 2}>
      <LeafGlyph size={Math.round(size * 0.56)} />
    </GlossTile>
  );
}

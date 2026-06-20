export function MitraAvatar({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-grad-primary text-primary-ink shadow-soft"
      style={{ height: size, width: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 18 4c2 0 3 .5 3 .5s.5 9-6 13c-2.4 1.5-4 1.5-4 1.5z" />
        <path d="M8 21c0-4 2-7 5-9" />
      </svg>
    </span>
  );
}

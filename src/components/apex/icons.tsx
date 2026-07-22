// Small presentational SVG helpers used across the Apex home page.
// Each renders byte-identical markup to the original HTML so the design and
// CSS selectors are preserved exactly — they only exist to avoid repeating the
// same inline SVG dozens of times.
import type { CSSProperties } from 'react';

/** Filled star — used in chapter ratings, testimonials and service cards. */
export function Star() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z" />
    </svg>
  );
}

/** Right-pointing arrow used inside buttons/CTAs. */
export function Arrow({
  className = 'arrow',
  size = 17,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Thin arrow used by section links (coverage, recurring, footer). */
export function ArrowThin({ style }: { style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

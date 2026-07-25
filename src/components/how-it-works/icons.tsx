// Line-icon set for the How It Works page. Every icon uses the same stroked
// 24×24 svg wrapper (matching the extracted design); callers size/color via the
// parent (.pr-ic, .pic, .mic, .xi, .float-ic). Paths ported verbatim from
// apex-how-it-works_extracted.html.
import type { ReactNode } from 'react';

export type IconKey =
  | 'cleaning'
  | 'lawn'
  | 'power'
  | 'paint'
  | 'junk'
  | 'pool'
  | 'pest'
  | 'security'
  | 'smart'
  | 'handyman'
  | 'tree'
  | 'dollar'
  | 'calendar'
  | 'clipboardCheck'
  | 'sliders'
  | 'calendarCheck'
  | 'home';

const PATHS: Record<IconKey, ReactNode> = {
  cleaning: (
    <>
      <path d="M3 12l2-2h14l2 2v7a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
      <path d="M8 10V6a4 4 0 018 0v4" />
    </>
  ),
  lawn: <path d="M3 20h18M6 20V8M10 20V5M14 20v-8M18 20V9" />,
  power: <path d="M12 3v6M8 7l4-4 4 4M5 21h14l-2-9H7z" />,
  paint: <path d="M4 20l6-6M14 6l4 4M13 5l6 6-9 3-3-3z" />,
  junk: <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13h10l1-13" />,
  pool: <path d="M2 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2M6 15V6a2 2 0 014 0M14 15V6a2 2 0 014 0" />,
  pest: <path d="M12 3v3M9 6h6M8 10a4 4 0 018 0v4a4 4 0 01-8 0zM4 12h4M16 12h4" />,
  security: (
    <>
      <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  smart: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <circle cx="12" cy="15" r="2" />
    </>
  ),
  handyman: <path d="M14 7l3 3M3 21l9-9M14.7 3.3a2 2 0 013 3L9 15l-4 1 1-4z" />,
  tree: <path d="M12 22v-6M8 16a4 4 0 01-1-8 5 5 0 019.5-1.5A3.5 3.5 0 0116 16z" />,
  dollar: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </>
  ),
  clipboardCheck: (
    <>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 6h11M4 12h16M4 18h9" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="15" cy="18" r="2" />
    </>
  ),
  calendarCheck: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9h18M8 2v4M16 2v4M9 14l2 2 4-4" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
};

export function Icon({ name }: { name: IconKey }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  );
}

// Bullet checkmark (heavier stroke), used in the process-card lists.
export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// Right arrow used on CTAs.
export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// FAQ plus (rotates to a × when the item opens).
export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

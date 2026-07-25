// Icon set for the Service Area page — ported verbatim from the SVG paths in
// apex-service-area_extracted.html. ServiceIcon covers the 11 area services plus
// the three "why Apex" extras (price/fast/home); the small standalone icons back
// the buttons, hero badges, map markers and FAQ toggles.

export type ServiceIconKey =
  | 'cleaning' | 'lawn' | 'power' | 'paint' | 'junk' | 'pool' | 'pest'
  | 'security' | 'smart' | 'handyman' | 'tree'
  | 'price' | 'fast' | 'home';

const STROKE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const PATHS: Record<ServiceIconKey, React.ReactNode> = {
  cleaning: (<><path d="M3 12l2-2h14l2 2v7a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path d="M8 10V6a4 4 0 018 0v4" /></>),
  lawn: <path d="M3 20h18M6 20V8M10 20V5M14 20v-8M18 20V9" />,
  power: <path d="M12 3v6M8 7l4-4 4 4M5 21h14l-2-9H7z" />,
  paint: <path d="M4 20l6-6M14 6l4 4M13 5l6 6-9 3-3-3z" />,
  junk: <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13h10l1-13" />,
  pool: <path d="M2 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2M6 15V6a2 2 0 014 0M14 15V6a2 2 0 014 0" />,
  pest: <path d="M12 3v3M9 6h6M8 10a4 4 0 018 0v4a4 4 0 01-8 0zM4 12h4M16 12h4" />,
  security: (<><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>),
  smart: (<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><circle cx="12" cy="15" r="2" /></>),
  handyman: <path d="M14 7l3 3M3 21l9-9M14.7 3.3a2 2 0 013 3L9 15l-4 1 1-4z" />,
  tree: <path d="M12 22v-6M8 16a4 4 0 01-1-8 5 5 0 019.5-1.5A3.5 3.5 0 0116 16z" />,
  price: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
  fast: <path d="M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5" />,
  home: (<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>),
};

export function ServiceIcon({ name }: { name: ServiceIconKey }) {
  return <svg {...STROKE}>{PATHS[name]}</svg>;
}

export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// Filled map marker — hero badge, map pins, final-CTA floaters.
export const PinMarker = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" fill="#fff" />
  </svg>
);

export const House = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8M5 10v10h14V10" />
  </svg>
);

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

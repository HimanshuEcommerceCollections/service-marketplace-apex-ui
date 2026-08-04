// Icon set for /book — the inline SVG paths from apex-booking.html, keyed by the
// slugs the API actually returns (server/prisma/seed-data.ts) rather than the
// design's own short ids. The design hardcoded 11 services with ids like `lawn`
// and `power`; the catalogue is admin-driven, so an unknown slug falls back to a
// generic house mark instead of rendering an empty box.

const PATHS: Record<string, React.ReactNode> = {
  cleaning: (
    <>
      <path d="M3 12l2-2h14l2 2v7a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
      <path d="M8 10V6a4 4 0 018 0v4" />
    </>
  ),
  "lawn-care": <path d="M3 20h18M6 20V8M10 20V5M14 20v-8M18 20V9" />,
  "power-washing": <path d="M12 3v6M8 7l4-4 4 4M5 21h14l-2-9H7z" />,
  painting: <path d="M4 20l6-6M14 6l4 4M13 5l6 6-9 3-3-3z" />,
  "junk-removal": <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13h10l1-13" />,
  pool: (
    <path d="M2 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2M6 15V6a2 2 0 014 0M14 15V6a2 2 0 014 0" />
  ),
  "pest-control": (
    <path d="M12 3v3M9 6h6M8 10a4 4 0 018 0v4a4 4 0 01-8 0zM4 12h4M16 12h4M5 8l3 2M19 8l-3 2M5 16l3-2M19 16l-3-2" />
  ),
  "home-security": (
    <>
      <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  "smart-home": (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <circle cx="12" cy="15" r="2" />
    </>
  ),
  handyman: <path d="M14 7l3 3M3 21l9-9M14.7 3.3a2 2 0 013 3L9 15l-4 1 1-4z" />,
  "tree-stump": <path d="M12 22v-6M8 16a4 4 0 01-1-8 5 5 0 019.5-1.5A3.5 3.5 0 0116 16z" />,
};

const FALLBACK = (
  <>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </>
);

export function SERVICE_ICON(slug: string) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[slug] ?? FALLBACK}
    </svg>
  );
}

export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Lock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const Info = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

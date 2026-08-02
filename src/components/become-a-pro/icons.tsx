// Inline stroke icons for the become-a-pro page, lifted from become-a-pro.html.
// Same shape as components/property-managers/icons.tsx: one <Icon name=".."/>
// lookup so the data layer can reference icons by string.

const P = ({ d }: { d: string }) => <path d={d} />;

const PATHS: Record<string, React.ReactNode> = {
  'check-circle': (
    <>
      <P d="M9 12l2 2 4-4" />
      <P d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <P d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <P d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <P d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  building: <P d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />,
  'clipboard-check': (
    <>
      <P d="M9 11l3 3L22 4" />
      <P d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  chart: (
    <>
      <P d="M3 3v18h18" />
      <P d="M7 15l4-4 3 3 5-6" />
    </>
  ),
  'shield-check': (
    <>
      <P d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
      <P d="M9 12l2 2 4-4" />
    </>
  ),
  shield: <P d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />,
  broom: (
    <>
      <P d="M19 5 8 16m0 0-3 3 4 1 1-4Z" />
      <P d="m19 5 2 2M14 3l7 7" />
      <P d="M3 21h6" />
    </>
  ),
  leaf: (
    <>
      <P d="M12 20V9m0 0C9 9 6 7 6 4c3 0 6 2 6 5Zm0 0c0-3 3-5 6-5 0 3-3 5-6 5Z" />
      <P d="M4 20h16" />
    </>
  ),
  spray: (
    <>
      <P d="M3 3h4v4H3zM7 5h6a4 4 0 0 1 4 4v1" />
      <P d="M17 10v4M15 14h4l-1 7h-2l-1-7Z" />
    </>
  ),
  roller: (
    <>
      <P d="M19 3H5a2 2 0 0 0-2 2v6h18V5a2 2 0 0 0-2-2Z" />
      <P d="M21 11v3a2 2 0 0 1-2 2h-7v3M10 19h4" />
    </>
  ),
  trash: <P d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />,
  pool: <P d="M2 18c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1M7 15V5a2 2 0 0 1 4 0M13 15V5a2 2 0 0 1 4 0" />,
  bug: <P d="M12 3v3m0 0a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0v-2a4 4 0 0 0-4-4Zm-4 6H4m4 4H4m16-4h-4m4 4h-4M9 6 7 4m8 2 2-2" />,
  'smart-home': (
    <>
      <P d="M3 11 12 3l9 8M5 9v11h14V9" />
      <circle cx="12" cy="14" r="2" />
    </>
  ),
  wrench: <P d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.4-.6-.6-2.4 2.3-2.3Z" />,
  tree: <P d="M12 22v-5m0 0a5 5 0 0 0 4.5-7.2A4 4 0 0 0 14 3a4.5 4.5 0 0 0-8 1.5A4 4 0 0 0 7.5 12 5 5 0 0 0 12 17Z" />,
  check: <P d="M20 6 9 17l-5-5" />,
};

export function Icon({ name }: { name: string }) {
  const body = PATHS[name];
  if (!body) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {body}
    </svg>
  );
}

export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

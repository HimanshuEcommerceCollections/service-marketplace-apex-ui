// Inline stroke icons for the property-managers page, lifted from
// property-managers.html. Same shape as components/how-it-works/icons.tsx: one
// <Icon name=".."/> lookup so the data layer can reference icons by string.

const P = ({ d }: { d: string }) => <path d={d} />;

const PATHS: Record<string, React.ReactNode> = {
  'check-circle': (
    <>
      <P d="M9 12l2 2 4-4" />
      <P d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </>
  ),
  bolt: <P d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  pin: (
    <>
      <P d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  wrench: <P d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.4-.6-.6-2.4 2.3-2.3Z" />,
  user: <P d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  'shield-check': (
    <>
      <P d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
      <P d="M9 12l2 2 4-4" />
    </>
  ),
  shield: <P d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <P d="M12 7v5l3 2" />
    </>
  ),
  chat: <P d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />,
  star: <P d="m12 2 3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />,
  broom: (
    <>
      <P d="M19 5 8 16m0 0-3 3 4 1 1-4Z" />
      <P d="m19 5 2 2M14 3l7 7" />
    </>
  ),
  trash: <P d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />,
  roller: (
    <>
      <P d="M19 3H5a2 2 0 0 0-2 2v6h18V5a2 2 0 0 0-2-2Z" />
      <P d="M21 11v3a2 2 0 0 1-2 2h-7v3M10 19h4" />
    </>
  ),
  spray: (
    <>
      <P d="M3 3h4v4H3zM7 5h6a4 4 0 0 1 4 4v1" />
      <P d="M17 10v4M15 14h4l-1 7h-2l-1-7Z" />
    </>
  ),
  carpet: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <P d="M7 8V6a5 5 0 0 1 10 0v2M7 13h10" />
    </>
  ),
  check: <P d="M20 6 9 17l-5-5" />,
  home: <P d="M3 11 12 3l9 8M5 9v11h14V9" />,
  leaf: (
    <>
      <P d="M12 20V9m0 0C9 9 6 7 6 4c3 0 6 2 6 5Zm0 0c0-3 3-5 6-5 0 3-3 5-6 5Z" />
      <P d="M4 20h16" />
    </>
  ),
  building: <P d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />,
  'clipboard-check': (
    <>
      <P d="M9 11l3 3L22 4" />
      <P d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
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

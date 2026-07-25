// Shared centered section header (eyebrow + display h2 + optional lede) used by
// every How It Works section. Mirrors the inline-styled `.sec-head` from the
// extracted design.
export default function SecHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="sec-head reveal">
      <span className="eyebrow" style={{ justifyContent: 'center' }}>
        {eyebrow}
      </span>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          letterSpacing: '-.03em',
          fontSize: 'clamp(28px,3.6vw,44px)',
          color: 'var(--ink2)',
          marginTop: 12,
        }}
      >
        {title}
      </h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

// Centered section header (eyebrow + display h2 + optional lede) used by every
// Property Managers section. `left` switches to the left-aligned variant the
// listing-prep split column uses.
export default function SecHead({
  eyebrow,
  title,
  lede,
  left = false,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  left?: boolean;
}) {
  return (
    <div className={`sec-head reveal${left ? ' left' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

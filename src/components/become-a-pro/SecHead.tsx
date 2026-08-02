// Centered section header (eyebrow + display h2 + optional lede) used by every
// Become-a-Pro section.
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
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

// section: PRICING COMPARISON — frequency vs. member benefits. Cell animations key
// off .cmp-wrap.in (added by the reveal observer). Column index 1 (Bi-weekly) is "best".

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const Dash = () => <span className="dash">—</span>;

const BEST = 1;

const columns = [
  { name: 'Weekly', sub: 'Max savings' },
  { name: 'Bi-weekly', sub: 'Balanced' },
  { name: 'Monthly', sub: 'Light touch' },
  { name: 'Quarterly', sub: 'Seasonal' },
];

// Each cell is a savings label (string) or a boolean (true = check, false = dash).
const rows: { label: string; cells: (string | boolean)[] }[] = [
  { label: 'Per-visit savings', cells: ['15%', '12%', '8%', '5%'] },
  { label: 'Priority scheduling', cells: [true, true, true, false] },
  { label: 'Free re-service', cells: [true, true, true, true] },
  { label: 'Locked-in pricing', cells: [true, true, true, true] },
  { label: 'Dedicated coordinator', cells: [true, true, false, false] },
  { label: 'Cancel anytime', cells: [true, true, true, true] },
];

const cellContent = (v: string | boolean) =>
  typeof v === 'string' ? <b>{v}</b> : v ? <Check /> : <Dash />;

export default function Compare() {
  return (
    <section className="sec">
      <div className="swrap">
        <div className="sec-head reveal">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Compare frequencies
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
            The more often we come, the more you save.
          </h2>
        </div>
        <div className="cmp-wrap reveal">
          <table className="cmp">
            <thead>
              <tr>
                <th />
                {columns.map((c, i) => (
                  <th key={c.name} className={i === BEST ? 'best' : undefined}>
                    {c.name}
                    <small>{c.sub}</small>
                    {i === BEST && <div className="best-flag">Best value</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th>{r.label}</th>
                  {r.cells.map((v, i) => (
                    <td key={i} className={i === BEST ? 'best' : undefined}>
                      {cellContent(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

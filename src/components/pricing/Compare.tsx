// section: COMPARE — every service side by side. Reuses the shared `.cmp` table
// styling (membership.css) plus pricing-only `.price-table` rules (sticky head,
// recurring-row highlight). Cell animations key off .cmp-wrap.in (reveal observer).
import { comparisonRows } from '../../data/pricing/services';
import SecHead from './SecHead';

export default function Compare() {
  return (
    <section className="sec" id="compare" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow="Compare" title="Everything, side by side." />
      <div className="swrap">
        <div className="cmp-wrap price-cmp reveal">
          <table className="cmp price-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Starting price</th>
                <th>Recurring discount</th>
                <th>Typical duration</th>
                <th>Pricing model</th>
                <th>Booking</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((r) => (
                <tr key={r.name} className={r.recurring ? 'rec' : undefined}>
                  <th>
                    {r.name}
                    {r.recurring && <span className="rectag">Recurring</span>}
                  </th>
                  <td>
                    <b>{r.start}</b>
                  </td>
                  <td>{r.discount ?? <span className="dash">—</span>}</td>
                  <td>{r.duration}</td>
                  <td>{r.model}</td>
                  <td>
                    <a className="mini-book ripple" href={r.bookHref}>
                      Book
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

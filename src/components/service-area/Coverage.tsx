// section 3: COVERAGE — the big map beside four glass stat cards (counters
// animate via the runtime when they scroll into view).
import Map from './Map';
import SecHead from './SecHead';
import { coverageStats } from '../../data/service-area/content';

export default function Coverage() {
  return (
    <section className="sec" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow="Coverage" title="Where we work across Wake County." />
      <div className="swrap">
        <div className="cov-grid">
          <div className="cov-map reveal">
            <Map variant="big-map" gradientId="mg-coverage" hint />
          </div>
          <div className="cov-stats reveal sc">
            {coverageStats.map((s) => (
              <div className="cstat reveal sc" key={s.label}>
                <div className="sv">
                  <span data-count={s.count} data-dec="0">
                    0
                  </span>
                  {s.suffix}
                </div>
                <div className="sl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

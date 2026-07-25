// section: TRUST STATS — four count-up tiles. The count-up (decimal + suffix
// aware) is driven by the runtime (mountPricing → initStats), which reads
// data-count / data-dec off each tile. Data in data/pricing/content.
import { stats } from '../../data/pricing/content';
import SecHead from './SecHead';

export default function Stats() {
  return (
    <section className="sec" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow="Why homeowners trust Apex" title="Backed by thousands of homes." />
      <div className="swrap">
        <div className="stat-grid">
          {stats.map((s) => (
            <div className="stat reveal sc" key={s.label}>
              <div className="sv">
                <span data-count={s.value} data-dec={s.dec}>
                  0
                </span>
                {s.suffix}
              </div>
              <div className="sl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// section: BUSINESS BENEFITS — four tiles. The numeric ones carry [data-count]
// and are counted up by the runtime (initStats); the "Fast" / "Single" tiles are
// display words with no counter, so the runtime skips them.
import { statsHead, stats } from '../../data/property-managers/content';
import SecHead from './SecHead';

export default function Stats() {
  return (
    <section className="sec" id="stats">
      <SecHead eyebrow={statsHead.eyebrow} title={statsHead.title} />
      <div className="swrap">
        <div className="stat-grid">
          {stats.map((s) => (
            <div className="stat reveal sc" key={s.label}>
              {s.word ? (
                <div className="sw">{s.word}</div>
              ) : (
                <div className="sv">
                  <span data-count={s.count}>0</span>
                  {s.suffix && <span className="suf">{s.suffix}</span>}
                </div>
              )}
              <div className="sl">{s.label}</div>
              <div className="ss">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

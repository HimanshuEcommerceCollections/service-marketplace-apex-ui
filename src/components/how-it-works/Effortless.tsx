// section: WHY / EFFORTLESS — four benefit cards (.bgrid/.xcard) above four
// count-up stat tiles. The `.xcard` icon pop is CSS (on `.in`); the stat count-up
// is driven by the runtime (mountHowItWorks → initStats, reads data-count/data-dec).
import { effortlessHead, effortlessCards, stats } from '../../data/how-it-works/content';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function Effortless() {
  return (
    <section className="sec">
      <SecHead eyebrow={effortlessHead.eyebrow} title={effortlessHead.title} />
      <div className="swrap">
        <div className="bgrid">
          {effortlessCards.map((c) => (
            <div className="xcard reveal" key={c.title}>
              <div className="xi">
                <Icon name={c.icon} />
              </div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
        <div className="stat-grid" style={{ marginTop: 'clamp(28px,3vw,44px)' }}>
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

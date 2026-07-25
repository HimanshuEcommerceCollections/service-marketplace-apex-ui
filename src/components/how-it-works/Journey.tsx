// section: JOURNEY — horizontal 6-milestone timeline. The connecting line fill
// (#jfill) grows with scroll, driven by the runtime (mountHowItWorks → initJourney).
import { journeyHead, milestones } from '../../data/how-it-works/content';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function Journey() {
  return (
    <section className="sec" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow={journeyHead.eyebrow} title={journeyHead.title} />
      <div className="swrap">
        <div className="jtl">
          <div className="jline">
            <i id="jfill" />
          </div>
          <div className="miles">
            {milestones.map((m, i) => (
              <div className="mile" data-i={i} key={i}>
                <span className="mdot">
                  <span className="mic">
                    <Icon name={m.icon} />
                  </span>
                </span>
                <div className="mlabel">
                  <b>{m.title}</b>
                  <span>{m.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

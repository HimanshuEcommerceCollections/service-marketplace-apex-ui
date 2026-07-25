// section 7: WHY APEX — four benefit cards (reuses the shared .bgrid/.xcard).
import SecHead from './SecHead';
import { ServiceIcon } from './icons';
import { whyCards } from '../../data/service-area/content';

export default function WhyChoose() {
  return (
    <section className="sec" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow="Why Apex" title="Why homeowners choose Apex." />
      <div className="swrap">
        <div className="bgrid">
          {whyCards.map((c) => (
            <div className="xcard reveal" key={c.title}>
              <div className="xi">
                <ServiceIcon name={c.icon} />
              </div>
              <h4>{c.title}</h4>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element */
// section: ALL SERVICES — image-banner cards for every Apex service. Data in
// data/how-it-works/services. "Learn more" → the service route; "Book now" →
// /book?service=<slug>.
import { servicesHead } from '../../data/how-it-works/content';
import { services } from '../../data/how-it-works/services';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function AllServices() {
  return (
    <section className="sec" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow={servicesHead.eyebrow} title={servicesHead.title} />
      <div className="swrap">
        <div className="pr-grid">
          {services.map((s) => (
            <div className="pr-card reveal sc" key={s.id}>
              <div className="pr-banner">
                <img src={s.image} alt={s.name} loading="lazy" />
                <span className="pr-ic">
                  <Icon name={s.icon} />
                </span>
              </div>
              <div className="pr-body">
                <h4>{s.name}</h4>
                <p className="scd">{s.desc}</p>
                <div className="pr-btns">
                  <a className="btn btn-line ripple" href={s.learnHref}>
                    Learn more
                  </a>
                  <a className="btn btn-primary ripple" href={s.bookHref}>
                    Book now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

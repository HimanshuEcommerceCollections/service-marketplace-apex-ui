/* eslint-disable @next/next/no-img-element */
// section: ALL SERVICES — image-banner pricing cards for every Apex service.
// Data in data/pricing/services. "Learn more" → the service route; "Book now"
// → /book?service=<slug>.
import { services } from '../../data/pricing/services';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function Overview() {
  return (
    <section className="sec">
      <SecHead eyebrow="All services" title="Pricing for every Apex service." />
      <div className="swrap">
        <div className="pr-grid">
          {services.map((s) => (
            <div className="pr-card reveal sc" key={s.id}>
              <div className="pr-banner">
                <img src={s.image} alt={s.name} loading="lazy" />
                {s.badge && <span className="pr-badge">{s.badge}</span>}
                <span className="pr-ic">
                  <Icon name={s.icon} />
                </span>
              </div>
              <div className="pr-body">
                <h4>{s.name}</h4>
                <div className="pr-price">
                  {s.price.lead && <small>{s.price.lead} </small>}
                  {s.price.main}
                </div>
                <div className="pr-type">{s.type}</div>
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

// section 5: SERVICES BY AREA — every service, marked available, with a
// "Learn more" link to its page and a "Book now" deep-link.
import SecHead from './SecHead';
import { ServiceIcon } from './icons';
import { services } from '../../data/service-area/content';

export default function Services() {
  return (
    <section className="sec" id="services" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow="Services" title="Every service, available in your area." />
      <div className="swrap">
        <div className="asvc-grid">
          {services.map((s) => (
            <div className="asvc reveal sc" key={s.name}>
              <span className="asvc-ic">
                <ServiceIcon name={s.icon} />
              </span>
              <div className="asvc-b">
                <h4>{s.name}</h4>
                <span className="avail">
                  <span className="adot" />
                  Available in your area
                </span>
              </div>
              <div className="asvc-btns">
                <a className="btn btn-line ripple" href={s.learnMore}>
                  Learn more
                </a>
                <a className="btn btn-primary ripple" href={`/book?service=${s.bookSlug}`}>
                  Book now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

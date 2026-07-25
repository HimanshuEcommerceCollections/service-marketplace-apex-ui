/* eslint-disable @next/next/no-img-element */
// section 4: CITIES — one photo card per covered city. Each card's id
// (city-<slug>) is the scroll target for the map pins.
import SecHead from './SecHead';
import { cities } from '../../data/service-area/content';

export default function Cities() {
  return (
    <section className="sec" id="cities">
      <SecHead eyebrow="Cities we serve" title="Eight cities. One trusted team." />
      <div className="swrap">
        <div className="city-grid">
          {cities.map((c) => (
            <div className="city reveal sc" id={`city-${c.slug}`} key={c.slug}>
              <div className="city-img">
                <img src={`/assets/service-area/images/city-${c.slug}.webp`} alt={c.name} />
                <span className="city-tag">
                  {c.zips} ZIP{c.zips === 1 ? '' : 's'}
                </span>
              </div>
              <div className="city-body">
                <h4>{c.name}</h4>
                <p>{c.blurb}</p>
                <div className="city-svc">All 11 services available</div>
                <a className="btn btn-primary ripple" href="/book">
                  Book a service
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// section 1: HERO — headline + ZIP/services CTAs + trust badges, with the
// clickable Wake-County map.
import Map from './Map';
import { Arrow, House, PinMarker } from './icons';

export default function Hero() {
  return (
    <header className="sa-hero">
      <span className="glow g1" />
      <span className="glow g2" />
      <div className="swrap">
        <div className="reveal">
          <span className="eyebrow">Service area</span>
          <h1>
            Proudly serving <em>Wake County</em> homes.
          </h1>
          <p className="lede">
            Check whether Apex is available in your neighborhood. If we’re not there yet, join our
            waitlist and we’ll notify you the moment we expand.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary ripple" href="#zip">
              Check my ZIP <Arrow />
            </a>
            <a className="btn btn-line ripple" href="#services">
              Explore services
            </a>
          </div>
          <div className="hero-badges">
            <span>
              <span className="hb-ic">
                <House />
              </span>
              8 cities covered
            </span>
            <span>
              <span className="hb-ic">
                <PinMarker />
              </span>
              40+ ZIP codes
            </span>
          </div>
        </div>
        <div className="reveal sc">
          <Map variant="hero-map" gradientId="mg-hero" />
        </div>
      </div>
    </header>
  );
}

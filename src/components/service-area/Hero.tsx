// section 1: HERO — headline + ZIP/services CTAs + trust badges over a
// full-bleed background video.
//
// The video sits behind everything with a veil on top, so the hero runs dark
// and service-area.css recolours the copy and buttons for that background
// (scoped to .sa-hero). Single column: the copy is width-capped and left
// aligned, with the right side left as open footage — which is what the veil's
// left-to-right dark-to-clear gradient is shaped for.
//
// Autoplay is finished by the runtime (mountServiceArea -> initVideos): the
// autoPlay attribute alone is not reliable on mobile or with autoplay blocked.
import { heroVideo } from '../../data/service-area/media';
import { Arrow, House, PinMarker } from './icons';

export default function Hero() {
  return (
    <header className="sa-hero">
      <video className="sa-hero-vid" autoPlay muted loop playsInline preload="auto">
        <source src={heroVideo.src} type="video/mp4" />
      </video>
      <div className="sa-hero-veil" />
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
      </div>
    </header>
  );
}

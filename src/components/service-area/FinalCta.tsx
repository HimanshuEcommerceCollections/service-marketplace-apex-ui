/* eslint-disable @next/next/no-img-element */
// section 9: FINAL CTA — image background + veil + floating pins.
import { Arrow, PinMarker } from './icons';

export default function FinalCta() {
  return (
    <section className="cta-band reveal">
      <div className="cta-bg">
        <img src="/assets/service-area/images/cta-bg.webp" alt="" />
      </div>
      <div className="cta-veil" />
      <span className="glow" />
      <span className="float-ic fi1">
        <PinMarker />
      </span>
      <span className="float-ic fi2">
        <PinMarker />
      </span>
      <span className="float-ic fi3">
        <PinMarker />
      </span>
      <span className="float-ic fi4">
        <PinMarker />
      </span>
      <h2>Your home deserves the Apex experience.</h2>
      <p>Check availability today and schedule trusted professionals for your home.</p>
      <div className="cta-row">
        <a className="btn btn-primary ripple" href="#zip">
          Check my ZIP <Arrow />
        </a>
        <a className="btn btn-line ripple" href="/book">
          Book a service
        </a>
      </div>
    </section>
  );
}

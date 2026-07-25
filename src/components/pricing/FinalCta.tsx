/* eslint-disable @next/next/no-img-element */
// section: FINAL CTA — book-your-service banner with an image background and four
// floating service icons. Uses the shared `.cta-band` base (membership.css) plus
// the pricing-only image/float-icon rules (pricing.css).
import { ctaBg } from '../../data/pricing/media';
import { Icon, Arrow } from './icons';

export default function FinalCta() {
  return (
    <section className="cta-band reveal">
      <div className="cta-bg">
        <img src={ctaBg.src} alt={ctaBg.alt} />
      </div>
      <div className="cta-veil" />
      <span className="glow" />
      <span className="float-ic fi1">
        <Icon name="cleaning" />
      </span>
      <span className="float-ic fi2">
        <Icon name="lawn" />
      </span>
      <span className="float-ic fi3">
        <Icon name="pool" />
      </span>
      <span className="float-ic fi4">
        <Icon name="power" />
      </span>
      <h2>Ready to book your service?</h2>
      <p>
        Choose your service, customize your requirements, and see transparent pricing before you
        submit.
      </p>
      <div className="cta-row">
        <a className="btn btn-primary ripple" href="/book">
          Book now <Arrow />
        </a>
        <a className="btn btn-line ripple" href="tel:+19195550100">
          Contact team
        </a>
      </div>
    </section>
  );
}

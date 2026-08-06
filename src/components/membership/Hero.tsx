/* eslint-disable @next/next/no-img-element */
// section: HERO — full-bleed cinematic hero with a glass "most popular" price card.
import { heroBg } from '../../data/membership/media';

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Hero() {
  return (
    <header className="subhero">
      <div className="hero-bg">
        <img src={heroBg.src} alt={heroBg.alt} />
      </div>
      <div className="hero-scrim" />
      <span className="glow g1" />
      <span className="glow g2" />
      <div className="swrap">
        <div className="reveal">
          <span className="eyebrow">Apex Membership</span>
          <h1>
            Your whole home,
            <br />
            <em>always handled.</em>
          </h1>
          <p className="lede">
            One membership for cleaning, lawn, pool and power washing, with the same trusted pros on an
            automatic schedule, at your best possible price.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#plans">
              Explore plans{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn btn-line" href="#calc">
              Calculate savings
            </a>
          </div>
          <div className="trust-row">
            <span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z" />
              </svg>
              4.9 from 1.2k members
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
              </svg>
              Vetted &amp; insured
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h9" />
              </svg>
              No contracts
            </span>
          </div>
        </div>
        <div className="price-card reveal sc">
          <div className="pc-top">
            <span className="pc-badge">Most popular</span>
            <span className="tstars">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </span>
          </div>
          <div className="pc-price">
            <small>from </small>$149<small>/visit</small>
          </div>
          <div className="pc-sub">Bi-weekly home cleaning membership</div>
          <ul>
            <li>
              <Check />
              Save 12% every visit
            </li>
            <li>
              <Check />
              Same trusted team
            </li>
            <li>
              <Check />
              Free re-clean guarantee
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

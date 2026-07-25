// section: HERO — cinematic pricing hero with a background video, a glass
// "instant estimate" card, and three floating price chips. Video autoplay is
// wired by the runtime (mountPricing → initHeroVideo).
import { heroVideo } from '../../data/pricing/media';
import { Icon, Arrow } from './icons';

export default function Hero() {
  return (
    <header className="pr-hero">
      <video
        className="pr-hero-vid"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroVideo.poster}
      >
        <source src={heroVideo.src} type="video/mp4" />
      </video>
      <div className="pr-hero-veil" />
      <span className="glow g1" />
      <span className="glow g2" />
      <div className="swrap">
        <div className="reveal">
          <span className="eyebrow">Pricing</span>
          <h1>
            Simple, transparent pricing
            <br />
            <em>for every home.</em>
          </h1>
          <p className="lede">
            No hidden fees. No surprises. Explore pricing across all Apex services and get an instant
            estimate — or request a custom quote.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary ripple" href="/book">
              Book a service <Arrow />
            </a>
            <a className="btn btn-line ripple" href="#compare">
              Compare plans
            </a>
          </div>
        </div>
        <div className="hero-widget reveal sc">
          <div className="hw-card">
            <div className="hw-top">
              <span className="eyebrow" style={{ fontSize: '10.5px' }}>
                Instant estimate
              </span>
            </div>
            <div className="hw-price">
              $<span>167</span>
              <small>/visit</small>
            </div>
            <div className="hw-sub">Bi-weekly home cleaning · Medium home</div>
            <div className="hw-rows">
              <div>
                <span>Estimated</span>
                <b>$189</b>
              </div>
              <div className="sv">
                <span>Member savings</span>
                <b>−$22</b>
              </div>
              <div className="tt">
                <span>You pay</span>
                <b>$167</b>
              </div>
            </div>
          </div>
          <div className="fchip c1">
            <span className="fic">
              <Icon name="cleaning" />
            </span>
            <div>
              <b>Cleaning</b>
              <span>From $149</span>
            </div>
          </div>
          <div className="fchip c2">
            <span className="fic">
              <Icon name="lawn" />
            </span>
            <div>
              <b>Lawn Care</b>
              <span>From $79</span>
            </div>
          </div>
          <div className="fchip c3">
            <span className="fic">
              <Icon name="pool" />
            </span>
            <div>
              <b>Pool</b>
              <span>From $99</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

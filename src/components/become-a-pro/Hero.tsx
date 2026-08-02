// section: HERO — dark full-bleed gradient with a grid overlay, a drifting glow,
// the particle canvas (painted by the runtime's initParticles) and four floating
// glass chips.
//
// The copy block uses the codebase's standard hero text format — eyebrow / h1
// with an <em> accent / .lede / .cta-row inside a single `.reveal` — matching the
// pricing, how-it-works and property-managers heroes rather than the source
// design's per-line GSAP mask.
import { hero } from '../../data/become-a-pro/content';
import { Icon, Arrow } from './icons';

export default function Hero() {
  return (
    <header className="pro-hero">
      <div className="pro-hero-grid" aria-hidden="true" />
      <span className="glow" aria-hidden="true" />
      <canvas className="pro-particles" aria-hidden="true" />
      <div className="swrap">
        <div className="reveal">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>
            {hero.titleLead}
            <em>{hero.titleEm}</em>
          </h1>
          <p className="lede">{hero.lede}</p>
          <div className="cta-row">
            <a className="btn btn-primary ripple" href={hero.primary.href}>
              {hero.primary.label} <Arrow />
            </a>
            <a className="btn btn-line ripple" href={hero.secondary.href}>
              {hero.secondary.label}
            </a>
          </div>
        </div>
        <div className="hero-chips reveal sc" aria-hidden="true">
          {hero.chips.map((c, i) => (
            <div className={`hchip f${i + 1}`} key={c.title}>
              <span className="ci">
                <Icon name={c.icon} />
              </span>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
      <a className="scroll-ind" href="#why" aria-label="Scroll">
        <span />
      </a>
    </header>
  );
}

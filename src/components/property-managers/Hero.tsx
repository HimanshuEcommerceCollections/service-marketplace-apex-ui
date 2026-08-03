// section: HERO — full-bleed background video under a dark veil, with the grid
// overlay, a drifting glow, the particle canvas (painted by the runtime's
// initParticles) and four floating glass chips on top.
//
// The .pm-hero gradient is kept as the video's fallback: it shows through until
// the first frame decodes and stays if the file is missing. Autoplay is forced
// by the runtime (mountPropertyManagers → initVideos), same as the pricing and
// service-area heroes — the attribute alone is not enough on mobile or in a tab
// that starts hidden.
//
// The copy block deliberately uses the codebase's standard hero text format —
// eyebrow / h1 with an <em> accent / .lede / .cta-row, all inside a single
// `.reveal` — the same as the pricing and how-it-works heroes, rather than the
// source design's per-line GSAP mask.
import { hero } from '../../data/property-managers/content';
import { heroVideo } from '../../data/property-managers/media';
import { Icon, Arrow } from './icons';

export default function Hero() {
  return (
    <header className="pm-hero">
      <video
        className="pm-hero-vid"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroVideo.poster}
        aria-hidden="true"
      >
        <source src={heroVideo.src} type="video/mp4" />
      </video>
      <div className="pm-hero-veil" aria-hidden="true" />
      <div className="pm-hero-grid" aria-hidden="true" />
      <span className="glow" aria-hidden="true" />
      <canvas className="pm-particles" aria-hidden="true" />
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

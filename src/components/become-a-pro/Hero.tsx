// section: HERO — full-bleed background video under a dark veil, with a drifting
// glow and the particle canvas (painted by the runtime's initParticles) on top.
//
// The .pro-hero gradient is kept as the video's fallback: it shows through until
// the first frame decodes and stays if the file is missing. Autoplay is forced by
// the runtime (mountBecomeAPro → initVideos), same as the property-managers,
// pricing and service-area heroes — the attribute alone is not enough on mobile
// or in a tab that starts hidden.
//
// The copy block uses the codebase's standard hero text format — eyebrow / h1
// with an <em> accent / .lede / .cta-row inside a single `.reveal` — matching the
// pricing, how-it-works and property-managers heroes rather than the source
// design's per-line GSAP mask.
import { hero } from '../../data/become-a-pro/content';
import { heroVideo } from '../../data/become-a-pro/media';
import { Arrow } from './icons';

export default function Hero() {
  return (
    <header className="pro-hero">
      <video
        className="pro-hero-vid"
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
      <div className="pro-hero-veil" aria-hidden="true" />
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
      </div>
      <a className="scroll-ind" href="#why" aria-label="Scroll">
        <span />
      </a>
    </header>
  );
}

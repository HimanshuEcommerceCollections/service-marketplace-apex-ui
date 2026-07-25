/* eslint-disable @next/next/no-img-element */
// section: HERO — full-bleed image, glass "book in ~90 seconds" card, scroll cue.
// The Ken-Burns zoom, glow float, card float and scroll indicator are pure CSS.
import { hero } from '../../data/how-it-works/content';
import { heroBg } from '../../data/how-it-works/media';
import { Arrow } from './icons';

export default function Hero() {
  return (
    <header className="hiw-hero">
      <div className="hh-bg">
        <img src={heroBg.src} alt={heroBg.alt} />
      </div>
      <div className="hh-veil" />
      <span className="glow" />
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
        <div className="hh-card reveal sc">
          <div className="hh-top">
            <span className="eyebrow" style={{ fontSize: '10.5px' }}>
              {hero.card.label}
            </span>
          </div>
          <div className="hh-steps">
            {hero.card.steps.map((s, i) => (
              <div key={i}>
                <span className="n">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
          <a
            className="btn btn-primary ripple"
            href={hero.card.cta.href}
            style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
          >
            {hero.card.cta.label}
          </a>
        </div>
      </div>
      <a className="scroll-ind" href="#process" aria-label="Scroll">
        <span />
      </a>
    </header>
  );
}

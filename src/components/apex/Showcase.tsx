/* eslint-disable @next/next/no-img-element */
// section: SHOWCASE — cinematic chapters. Parallax + .ch-reveal staggering are
// driven by the runtime (per .chapter / .ch-media / .ch-reveal).
import { chapters } from '../../data/apex/chapters';
import { Star, Arrow } from './icons';

export default function Showcase() {
  return (
    <div className="showcase" id="showcase">
      {chapters.map((c, i) => (
        <section
          key={i}
          className={`chapter ${c.side}${c.last ? ' last' : ''}`}
          data-chapter
        >
          <div className="ch-stick">
            <div className="ch-media">
              <img
                src={c.image}
                alt={`Apex ${c.altName} service in a Wake County home`}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="ch-scrim" />
            <div className="ch-vignette" />
            <div className="ch-grain" />
            <div className="ch-inner">
              <div className="ch-col">
                <div className="ch-index ch-reveal">
                  <span className="n">{c.index}</span>
                  <i />
                  <span>{c.category}</span>
                </div>
                <span className={`ch-badge ${c.badge} ch-reveal`}>
                  <span className="d" />
                  {c.badgeLabel}
                </span>
                <h1 className="ch-title ch-reveal">{c.title}</h1>
                <div className="ch-rating ch-reveal">
                  <span className="stars">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} />
                    ))}
                  </span>
                  <b>{c.rating}</b>
                  <em>{c.reviews}</em>
                </div>
                <p className="ch-story ch-reveal">{c.story}</p>
                <div className="ch-specs ch-reveal">
                  {c.specs.map((s, j) => (
                    <div key={j}>
                      <b className={s.num ? 'num' : undefined}>{s.value}</b>
                      <span>{s.caption}</span>
                    </div>
                  ))}
                </div>
                <div className="ch-cta ch-reveal">
                  <a className="btn btn-ghost magnetic" href="/book">
                    <span className="btn-inner">
                      {c.cta} <Arrow />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

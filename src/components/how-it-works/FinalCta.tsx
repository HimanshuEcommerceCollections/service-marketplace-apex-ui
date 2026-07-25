/* eslint-disable @next/next/no-img-element */
// section: FINAL CTA — book-your-service banner with an image background and four
// floating service icons (CSS float animation).
import { cta } from '../../data/how-it-works/content';
import { ctaBg } from '../../data/how-it-works/media';
import { Icon, Arrow } from './icons';

export default function FinalCta() {
  return (
    <section className="cta-band reveal">
      <div className="cta-bg">
        <img src={ctaBg.src} alt={ctaBg.alt} />
      </div>
      <div className="cta-veil" />
      <span className="glow" />
      {cta.floatIcons.map((name, i) => (
        <span className={`float-ic fi${i + 1}`} key={name + i}>
          <Icon name={name} />
        </span>
      ))}
      <h2>{cta.title}</h2>
      <p>{cta.body}</p>
      <div className="cta-row">
        <a className="btn btn-primary ripple" href={cta.primary.href}>
          {cta.primary.label} <Arrow />
        </a>
        <a className="btn btn-line ripple" href={cta.secondary.href}>
          {cta.secondary.label}
        </a>
      </div>
    </section>
  );
}

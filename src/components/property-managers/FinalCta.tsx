// section: FINAL CTA — dark gradient band with the grid overlay and drifting
// glow (the .cta-band slot every marketing page ends on).
import { finalCta } from '../../data/property-managers/content';
import { Arrow } from './icons';

export default function FinalCta() {
  return (
    <section className="cta-band reveal" id="join">
      <div className="fc-grid" aria-hidden="true" />
      <span className="glow" aria-hidden="true" />
      <h2>{finalCta.title}</h2>
      <p>{finalCta.lede}</p>
      <div className="cta-row">
        <a className="btn btn-primary ripple" href={finalCta.primary.href}>
          {finalCta.primary.label} <Arrow />
        </a>
        <a className="btn btn-line ripple" href={finalCta.secondary.href}>
          {finalCta.secondary.label}
        </a>
      </div>
      <div className="fc-trust">
        {finalCta.trust.map((t, i) => (
          <span key={t} style={{ display: 'contents' }}>
            {i > 0 && <span className="dot" />}
            <span>{t}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

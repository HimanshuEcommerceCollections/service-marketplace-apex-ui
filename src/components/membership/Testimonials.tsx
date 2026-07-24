// section: TESTIMONIALS — expanding filmstrip + quote panel. Carousel logic is in the
// membership runtime (identical engine to the service pages); this renders the initial
// DOM with card 3 (Aisha) active.
import type { CSSProperties } from 'react';
import { testimonials } from '../../data/membership/testimonials';

const DEFAULT = 3;

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z" />
  </svg>
);

export default function Testimonials() {
  const active = testimonials[DEFAULT];
  return (
    <section className="tsec" id="testimonials">
      <div className="thead reveal">
        <span className="eyebrow">Testimonials</span>
        <h2>
          Loved by Wake County <span className="box">homes.</span>
        </h2>
        <p>Real homeowners, one accountable team — booked in seconds and done right the first time.</p>
      </div>

      <div className="tstage reveal">
        <button className="tnav tprev" aria-label="Previous review">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="tstrip" id="tstrip">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              className={`tcard${i === DEFAULT ? ' on' : ''}`}
              data-i={i}
              aria-label={`Show review from ${t.name}`}
              style={{ '--img': `url(${t.portrait})` } as CSSProperties}
            >
              <div className="tcard-photo" />
              <div className="tcard-grad" />
              <div className="tcard-cap">
                <div className="tc-name">{t.name}</div>
                <div className="tc-tag">
                  <span className="dash" />
                  {t.tag}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="tquote">
          <div className="qstars qanim" id="qstars">
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </div>
          <span className="qmark">&#x201d;</span>
          <blockquote id="qtext" className="qanim">
            {active.quote}
          </blockquote>
          <div className="qwho" id="qwho">
            {active.name}
          </div>
          <div className="qrole" id="qrole">
            {active.tag}
          </div>
        </div>

        <button className="tnav tnext" aria-label="Next review">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="tbar reveal">
        <div className="tprog">
          <i id="tprog" />
        </div>
        <div className="tdots" id="tdots">
          {testimonials.map((t, i) => (
            <button key={t.id} className={`tdot${i === DEFAULT ? ' on' : ''}`} data-i={i} aria-label={`Go to review ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

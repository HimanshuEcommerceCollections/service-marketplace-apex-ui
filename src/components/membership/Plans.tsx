/* eslint-disable @next/next/no-img-element */
// section: MEMBERSHIP PLANS — pick a service or bundle a few. Data in data/membership/plans.
import { plans } from '../../data/membership/plans';

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Plans() {
  return (
    <section className="sec" id="plans" style={{ background: 'var(--mist)' }}>
      <div className="swrap">
        <div className="sec-head reveal">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Membership plans
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '-.03em',
              fontSize: 'clamp(28px,3.6vw,44px)',
              color: 'var(--ink2)',
              marginTop: 12,
            }}
          >
            Pick a service. Or bundle a few.
          </h2>
          <p className="lede">
            Every plan is month-to-month with member pricing, the same crew, and a free re-service
            guarantee.
          </p>
        </div>
        <div className="plangrid">
          {plans.map((p) => (
            <div className="plan reveal sc" key={p.id}>
              <div className="plan-img">
                <img src={p.image} alt={p.alt} loading="lazy" />
                <span className="tag">{p.tag}</span>
              </div>
              <div className="plan-body">
                <h4>{p.name}</h4>
                <div className="plan-price">
                  <span className="amt">{p.price}</span>
                  <small>/visit · from</small>
                </div>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>
                      <Check />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a className="btn btn-primary" href={p.bookHref}>
                  Choose plan
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

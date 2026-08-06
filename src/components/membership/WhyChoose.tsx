// section: WHY CHOOSE — four reasons a recurring plan wins (reuses .xcard via .bgrid).
const cards = [
  {
    title: 'Save More',
    body: 'Members lock in up to 15% off every visit. The more often we come, the more you save.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    title: 'Priority Scheduling',
    body: 'Standing time slots and first pick on the calendar, including busy seasons.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M3 9h18M8 2v4M16 2v4M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Trusted Professionals',
    body: 'The same vetted, insured crew every visit. No strangers, no surprises.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Flexible Plans',
    body: 'Pause, skip or switch services anytime. No lock-in contracts, ever.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h11M4 12h16M4 18h9" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="15" cy="18" r="2" />
      </svg>
    ),
  },
];

export default function WhyChoose() {
  return (
    <section className="sec">
      <div className="swrap">
        <div className="sec-head reveal">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Why a recurring plan
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
            Less to think about. More to enjoy.
          </h2>
          <p className="lede">
            Membership turns home upkeep into something automatic: cheaper, more reliable, and
            handled by people you trust.
          </p>
        </div>
        <div className="bgrid">
          {cards.map((c) => (
            <div className="xcard reveal" key={c.title}>
              <div className="xi">{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

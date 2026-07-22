// section: WHAT TO EXPECT — 3 info cards + included / not-included lists.
// .reveal / .in and the per-item stagger are driven by the runtime + service.css.

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const cards = [
  {
    title: 'What we do',
    body: 'Mow at the ideal height, crisp edging, string-trimming and a full blow-down of clippings.',
    icon: (
      <>
        <path d="M9 3h6a1 1 0 011 1v1h2a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2V4a1 1 0 011-1z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: 'How it works',
    body: 'Pick your lot size and frequency — the same crew shows up on schedule, week after week.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    title: 'Our promise',
    body: 'Missed an edge or a patch? Tell us within 24 hours and we come back to fix it, free.',
    icon: (
      <>
        <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

const included = [
  'Mowing at the ideal height',
  'Edging & string-trimming',
  'Clippings blown off hard surfaces',
  'Seasonal height adjustments',
  'Same crew each visit',
];
const excluded = ['Leaf haul-away (fall add-on)', 'Fertilization & weed control', 'Irrigation repair'];

export default function Expect() {
  return (
    <section className="sec expect">
      <div className="sec-head reveal">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          What to expect
        </span>
        <h2>Straightforward from first cut to last.</h2>
        <p>No surprises — here is exactly how lawn care works with Apex.</p>
      </div>
      <div className="xgrid">
        {cards.map((c, i) => (
          <div className="xcard reveal" key={i}>
            <div className="xi">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {c.icon}
              </svg>
            </div>
            <h4>{c.title}</h4>
            <p>{c.body}</p>
          </div>
        ))}
      </div>
      <div className="incl2">
        <div className="ic-card inc reveal">
          <div className="ic-head">
            <span className="ic-badge">
              <Check />
            </span>
            What&#8217;s included
          </div>
          <ul>
            {included.map((t, i) => (
              <li key={i}>
                <span className="ic-dot">
                  <Check />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ic-card exc reveal">
          <div className="ic-head">
            <span className="ic-badge">
              <Cross />
            </span>
            Not included
          </div>
          <ul>
            {excluded.map((t, i) => (
              <li key={i}>
                <span className="ic-dot">
                  <Cross />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

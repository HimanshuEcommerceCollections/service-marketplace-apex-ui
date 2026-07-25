// Shared service WHAT-TO-EXPECT — 3 info cards + included / not-included lists.
// Fully data-driven from ExpectContent. .reveal/.in + per-item stagger come from
// the runtime + service.css (unchanged).
import type { ReactNode } from 'react';
import type { ExpectContent, ExpectCardIcon } from '../../data/serviceContent';

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

const CARD_ICON: Record<ExpectCardIcon, ReactNode> = {
  clipboard: (
    <>
      <path d="M9 3h6a1 1 0 011 1v1h2a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2V4a1 1 0 011-1z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

export default function Expect({ content }: { content: ExpectContent }) {
  const c = content;
  return (
    <section className="sec expect">
      <div className="sec-head reveal">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          What to expect
        </span>
        <h2>{c.heading}</h2>
        <p>{c.subheading}</p>
      </div>
      <div className="xgrid">
        {c.cards.map((card, i) => (
          <div className="xcard reveal" key={i}>
            <div className="xi">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {CARD_ICON[card.icon]}
              </svg>
            </div>
            <h4>{card.title}</h4>
            <p>{card.body}</p>
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
            {c.included.map((t, i) => (
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
            {c.excluded.map((t, i) => (
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

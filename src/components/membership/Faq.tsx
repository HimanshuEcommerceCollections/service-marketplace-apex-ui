// section: FAQ — accordion (open/close driven by the runtime, .faq-item.open + max-height).
const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const faqs = [
  {
    q: 'Is there a contract or lock-in?',
    a: 'No. Every Apex plan is month-to-month. Pause, skip a visit, switch services, or cancel anytime from your account, with no fees.',
  },
  {
    q: 'How does member pricing work?',
    a: 'Recurring visits are discounted up to 15% versus one-time bookings, and your per-visit rate is locked in for as long as you stay a member.',
  },
  {
    q: 'Will I get the same team each visit?',
    a: 'Yes. We assign a consistent, vetted and insured crew to your home so they learn your preferences over time.',
  },
  {
    q: 'What if I am not happy with a visit?',
    a: 'Tell us within 24 hours and we return to make it right at no charge. It is included with every plan.',
  },
  {
    q: 'Can I combine multiple services?',
    a: 'Absolutely. Bundle cleaning, lawn, pool and pest into one schedule with a single coordinator and combined member savings.',
  },
  {
    q: 'How am I billed?',
    a: 'Automatically after each completed visit to your card on file. You will always get a receipt, and you can update billing anytime.',
  },
];

export default function Faq() {
  return (
    <section className="sec" id="faq" style={{ background: 'var(--mist)' }}>
      <div className="swrap">
        <div className="sec-head reveal">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Questions
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
            Everything you might ask.
          </h2>
        </div>
        <div className="faq">
          {faqs.map((f) => (
            <div className="faq-item reveal" key={f.q}>
              <button className="faq-q">
                {f.q}
                <span className="ic">
                  <Plus />
                </span>
              </button>
              <div className="faq-a">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

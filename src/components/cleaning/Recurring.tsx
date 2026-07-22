// section: RECURRING PLANS — 4 plan cards (Weekly is the "Most popular").
// Booking CTAs point at /book?service=cleaning, preserved verbatim from the
// source (plain <a>, since the booking flow is a separate/backend route).

interface Plan {
  name: string;
  freq: string;
  amount: string;
  unit?: string;
  disc?: string;
  best?: boolean;
  choose: string;
}

const plans: Plan[] = [
  { name: 'One-time', freq: 'Single visit', amount: '$170', choose: 'Choose one-time' },
  { name: 'Weekly', freq: 'Every week', amount: '$133', unit: '/visit', disc: 'Save 22%', best: true, choose: 'Choose weekly' },
  { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$145', unit: '/visit', disc: 'Save 15%', choose: 'Choose biweekly' },
  { name: 'Monthly', freq: 'Every month', amount: '$156', unit: '/visit', disc: 'Save 8%', choose: 'Choose monthly' },
];

export default function Recurring() {
  return (
    <section className="sec rec">
      <div className="sec-head reveal">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          Recurring plans
        </span>
        <h2>Book once. Never think about it again.</h2>
        <p>Recurring visits lock in a lower per-visit price and a standing spot on the schedule.</p>
      </div>
      <div className="rec-grid reveal">
        {plans.map((p, i) => (
          <div className={`rplan ${p.best ? 'best' : ''}`} key={i}>
            {p.best && <span className="tagtop">Most popular</span>}
            <h4>{p.name}</h4>
            <div className="freq">{p.freq}</div>
            <div className="amt">
              {p.amount}
              {p.unit && <small>{p.unit}</small>}
            </div>
            {p.disc ? <div className="disc">{p.disc}</div> : <div className="disc" style={{ visibility: 'hidden' }}>.</div>}
            <a className="rlink" href="/book?service=cleaning">
              {p.choose} &#x2192;
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

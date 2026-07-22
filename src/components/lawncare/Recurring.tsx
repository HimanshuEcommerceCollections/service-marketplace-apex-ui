// section: RECURRING PLANS — lawn care offers 3 cadences (Weekly is "Most popular").
// Booking CTAs preserve the source's /book?service=lawn-care (plain <a>).

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
  { name: 'One-time', freq: 'Single visit', amount: '$59', choose: 'Choose one-time' },
  { name: 'Weekly', freq: 'Every week', amount: '$53', unit: '/visit', disc: 'Save 10%', best: true, choose: 'Choose weekly' },
  { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$56', unit: '/visit', disc: 'Save 5%', choose: 'Choose biweekly' },
];

export default function Recurring() {
  return (
    <section className="sec rec">
      <div className="sec-head reveal">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          Recurring plans
        </span>
        <h2>Book once. Never chase a mow again.</h2>
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
            <a className="rlink" href="/book?service=lawn-care">
              {p.choose} &#x2192;
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

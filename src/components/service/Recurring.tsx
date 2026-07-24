// section: RECURRING PLANS — shared across service pages. Renders N plan cards
// (mark one `best` as "Most popular"). Content via props. Booking CTAs are plain
// <a> to /book?service=<slug> (the booking flow is a separate route).
export interface ServicePlan {
  name: string;
  freq: string;
  amount: string;
  unit?: string;
  disc?: string;
  best?: boolean;
  choose: string;
}

interface RecurringProps {
  heading: string;
  plans: ServicePlan[];
  serviceSlug: string;
}

export default function Recurring({ heading, plans, serviceSlug }: RecurringProps) {
  return (
    <section className="sec rec">
      <div className="sec-head reveal">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          Recurring plans
        </span>
        <h2>{heading}</h2>
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
            <a className="rlink" href={`/book?service=${serviceSlug}`}>
              {p.choose} &#x2192;
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

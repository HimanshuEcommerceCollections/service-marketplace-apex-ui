// section: RECURRING PLANS — shared across service pages.
//
// DISPLAY ONLY. These cards show the payment frequencies a service offers and
// what each one saves; they are not purchasable packages and deliberately carry
// no CTA. The customer chooses a frequency in the "Instant estimate"
// configurator below, which reads the same data and applies the same discount.
// (Packages — ServicePlan/memberships — live on /membership-plans.)
export interface ServicePlan {
  name: string;
  freq: string;
  amount?: string;
  unit?: string;
  disc?: string;
  best?: boolean;
}

interface RecurringProps {
  heading: string;
  plans: ServicePlan[];
}

export default function Recurring({ heading, plans }: RecurringProps) {
  if (!plans.length) return null;
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
            {p.best && <span className="tagtop">Best saving</span>}
            <h4>{p.name}</h4>
            <div className="freq">{p.freq}</div>
            {p.amount && (
              <div className="amt">
                {p.amount}
                {p.unit && <small>{p.unit}</small>}
              </div>
            )}
            {p.disc ? <div className="disc">{p.disc}</div> : <div className="disc" style={{ visibility: 'hidden' }}>.</div>}
          </div>
        ))}
      </div>
      <p className="rec-note reveal">
        Pick your frequency in the estimate below — the discount is applied to your total.
      </p>
    </section>
  );
}

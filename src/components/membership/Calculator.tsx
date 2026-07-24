// section: SAVINGS CALCULATOR — segmented inputs + animated output. The compute logic
// and count-up live in the runtime (mountMembership); this renders the shell + ids it
// reads (#saveYr, #perVisit, #visits, #annual) and the initial .on selections.

const services = [
  { v: 'cleaning', label: 'Cleaning', on: true },
  { v: 'lawn', label: 'Lawn Care', on: false },
  { v: 'pool', label: 'Pool', on: false },
  { v: 'pw', label: 'Power Washing', on: false },
];
const freqs = [
  { v: 'weekly', label: 'Weekly', on: false },
  { v: 'biweekly', label: 'Bi-weekly', on: true },
  { v: 'monthly', label: 'Monthly', on: false },
  { v: 'quarterly', label: 'Quarterly', on: false },
];
const sizes = [
  { v: 's', label: 'Small', on: false },
  { v: 'm', label: 'Medium', on: true },
  { v: 'l', label: 'Large', on: false },
];

const Seg = ({ group, opts }: { group: string; opts: { v: string; label: string; on: boolean }[] }) => (
  <div className="seg2" data-group={group}>
    {opts.map((o) => (
      <button key={o.v} className={o.on ? 'on' : undefined} data-v={o.v}>
        {o.label}
      </button>
    ))}
  </div>
);

export default function Calculator() {
  return (
    <section className="sec" id="calc" style={{ background: 'var(--mist)' }}>
      <div className="swrap">
        <div className="sec-head reveal">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Savings calculator
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
            See what a membership saves you.
          </h2>
        </div>
        <div className="calc reveal">
          <div className="calc-panel">
            <div className="calc-field">
              <label>Service</label>
              <Seg group="service" opts={services} />
            </div>
            <div className="calc-field">
              <label>Frequency</label>
              <Seg group="freq" opts={freqs} />
            </div>
            <div className="calc-field">
              <label>Home size</label>
              <Seg group="size" opts={sizes} />
            </div>
          </div>
          <div className="calc-out">
            <span className="glow" />
            <span className="lbl">You save</span>
            <div className="big">
              $<span data-count id="saveYr">0</span>
              <small>/yr</small>
            </div>
            <div className="yr">vs. booking each visit one-time</div>
            <div className="calc-rows">
              <div className="r">
                <span>Member per-visit</span>
                <b>
                  $<span data-count id="perVisit">0</span>
                </b>
              </div>
              <div className="r">
                <span>Visits / year</span>
                <b id="visits">—</b>
              </div>
              <div className="r">
                <span>Est. annual cost</span>
                <b>
                  $<span data-count id="annual">0</span>
                </b>
              </div>
            </div>
            <a className="btn btn-primary" href="#plans">
              Start this plan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

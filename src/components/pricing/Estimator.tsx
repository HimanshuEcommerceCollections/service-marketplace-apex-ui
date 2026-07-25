// section: COST ESTIMATOR — segmented inputs + multi-select add-ons feeding an
// animated total. The compute logic + count-up live in the runtime (mountPricing);
// this renders the shell + the ids it reads (#cEst/#cSave/#cTax/#cTotal) and the
// initial .on selections. Segment options + the tax rate come from estimatorConfig
// (data layer) so the pricing numbers stay out of the component.
import { estimatorConfig } from '../../data/pricing/content';
import type { EstimatorOption } from '../../data/pricing/content';
import SecHead from './SecHead';

const cfg = estimatorConfig;
const taxPct = Math.round(cfg.taxRate * 100);

const Seg = ({ group, opts, multi }: { group: string; opts: EstimatorOption[]; multi?: boolean }) => (
  <div className={multi ? 'seg2 multi' : 'seg2'} data-group={group}>
    {opts.map((o) => (
      <button key={o.v} className={o.on ? 'on' : undefined} data-v={o.v}>
        {o.label}
      </button>
    ))}
  </div>
);

export default function Estimator() {
  return (
    <section className="sec">
      <SecHead eyebrow="Cost estimator" title="Build your price in seconds." />
      <div className="swrap">
        <div className="calc reveal">
          <div className="calc-panel">
            <div className="calc-field">
              <label>Service</label>
              <Seg group="service" opts={cfg.services} />
            </div>
            <div className="calc-field">
              <label>Property size</label>
              <Seg group="size" opts={cfg.sizes} />
            </div>
            <div className="calc-field">
              <label>Frequency</label>
              <Seg group="freq" opts={cfg.freqs} />
            </div>
            <div className="calc-field">
              <label>Add-ons</label>
              <div className="seg2 multi" data-group="addons">
                {cfg.addons.map((a) => (
                  <button key={a.v} data-v={a.v} data-p={a.price}>
                    {a.label} +${a.price}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="calc-out">
            <span className="glow" />
            <span className="lbl">Final total</span>
            <div className="big">
              $<span id="cTotal">0</span>
            </div>
            <div className="yr">estimate incl. {taxPct}% tax · confirmed on site</div>
            <div className="calc-rows">
              <div className="r">
                <span>Estimated price</span>
                <b>
                  $<span id="cEst">0</span>
                </b>
              </div>
              <div className="r">
                <span>Membership savings</span>
                <b>
                  −$<span id="cSave">0</span>
                </b>
              </div>
              <div className="r">
                <span>Tax ({taxPct}%)</span>
                <b>
                  $<span id="cTax">0</span>
                </b>
              </div>
            </div>
            <a className="btn btn-primary ripple" href="/book">
              Book this service
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

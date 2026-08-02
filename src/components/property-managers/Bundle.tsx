// section: THE TURNOVER BUNDLE — the 7-link chain. Steps light up in sequence
// and each one fills the connector to its right; driven by the runtime
// (mountPropertyManagers → initFlow) via .in / .done / .linked. The last step is
// the green "ready" node (.final).
import { bundleHead, bundleSteps } from '../../data/property-managers/content';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function Bundle() {
  return (
    <section className="sec sec-mist" id="bundle">
      <SecHead eyebrow={bundleHead.eyebrow} title={bundleHead.title} lede={bundleHead.lede} />
      <div className="swrap">
        <div className="flow">
          {bundleSteps.map((s, i) => (
            <div
              className={`fstep${i === bundleSteps.length - 1 ? ' final' : ''}`}
              key={s.title}
            >
              <span className="f-ic">
                <Icon name={s.icon} />
              </span>
              <span className="f-link">
                <i />
              </span>
              <div className="f-body">
                <h4>{s.title}</h4>
                <p>{s.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

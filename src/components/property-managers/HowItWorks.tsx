// section: HOW IT WORKS — horizontal 4-step timeline. Node activation and the
// #tlFill progress line are driven by the runtime (mountPropertyManagers →
// initTimeline); the line runs horizontally above 820px and vertically below.
import { processHead, processSteps } from '../../data/property-managers/content';
import SecHead from './SecHead';

export default function HowItWorks() {
  return (
    <section className="sec sec-mist" id="how">
      <SecHead eyebrow={processHead.eyebrow} title={processHead.title} lede={processHead.lede} />
      <div className="swrap">
        <div className="timeline">
          <div className="tl-track">
            <div className="tl-fill" id="tlFill" />
          </div>
          <div className="steps">
            {processSteps.map((s, i) => (
              <div className="step" key={s.title}>
                <div className="node-badge">{i + 1}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

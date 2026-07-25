// section: PROCESS — vertical 5-step timeline. The scroll-progress line
// (#procProg) and per-step `.active` state are driven by the runtime
// (mountHowItWorks → initProcess); `.pstep.reveal` → `.in` is the reveal IO.
import { processHead, processSteps } from '../../data/how-it-works/content';
import SecHead from './SecHead';
import { Icon, Check, Arrow } from './icons';

export default function Process() {
  return (
    <section className="sec" id="process">
      <SecHead eyebrow={processHead.eyebrow} title={processHead.title} lede={processHead.lede} />
      <div className="swrap">
        <div className="proc">
          <div className="proc-progress" id="procProg" />
          {processSteps.map((step, i) => (
            <div className={`pstep ${step.side} reveal`} key={i}>
              <div className="pnode">
                <span className="pic">
                  <Icon name={step.icon} />
                </span>
                <span className="pnum">{i + 1}</span>
              </div>
              <div className="pcard">
                <h3>{step.title}</h3>
                <ul>
                  {step.points.map((p) => (
                    <li key={p}>
                      <Check />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <a className="btn btn-line ripple psmall" href={step.cta.href}>
                  {step.cta.label} <Arrow />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

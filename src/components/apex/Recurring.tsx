// section: RECURRING PLANS. Accordion open/close and the cross-fading videos
// (#rpVids .rpv) are driven by the runtime. .rv reveal targets too.
import { ArrowThin } from './icons';

const plans: { num: string; title: string; disc: string; body: string; open?: boolean }[] = [
  {
    num: '01',
    title: 'Weekly — ',
    disc: '22% OFF',
    open: true,
    body: 'Most popular plan. Perfect for busy homes that need consistent care and maximum savings — this cadence keeps your space in gallery-ready condition all year round.',
  },
  {
    num: '02',
    title: 'Biweekly — ',
    disc: '15% OFF',
    body: 'The sweet spot for most homes — a fresh, cared-for space every two weeks with meaningful savings and the same trusted crew on every visit.',
  },
  {
    num: '03',
    title: 'Monthly — ',
    disc: '8% OFF',
    body: 'A reliable monthly reset for lighter households. Keep the essentials handled and lock in member pricing without the weekly commitment.',
  },
  {
    num: '04',
    title: 'One-Time — ',
    disc: '0% OFF',
    body: 'Need it just once? Book a single visit with no commitment — the same pros and the same standards, pay only for the visit you need.',
  },
];

export default function Recurring() {
  return (
    <section id="recurring">
      <div className="rp-left">
        <span className="rp-eyebrow rv">Select a Plan</span>
        <h2 className="rv">Recurring Plans</h2>
        <p className="rp-sub rv">Save up to 22% with a plan.</p>
        <p className="rp-desc rv">
          Set it and forget it. Weekly, biweekly, or monthly visits with the same trusted crew every
          time — premium care with flexible scheduling and exclusive member savings.
        </p>

        <div className="rp-acc rv" id="rpAcc">
          {plans.map((p) => (
            <div className={`rp-item${p.open ? ' open' : ''}`} key={p.num}>
              <button className="rp-head" type="button">
                <span className="rp-num">{p.num}</span>
                <span className="rp-title">
                  {p.title}
                  <span className="disc">{p.disc}</span>
                </span>
                <span className="rp-ic" />
              </button>
              <div className="rp-body">
                <div className="rp-body-inner">
                  <p>{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a className="rp-btn rv magnetic" href="#book">
          View Recurring Plans <ArrowThin />
        </a>
      </div>

      <div className="rp-right rv">
        <div className="rp-vids" id="rpVids">
          <video className="rpv on" autoPlay muted loop playsInline preload="auto">
            <source src="/assets/videos/video-7.mp4" type="video/mp4" />
          </video>
          <video className="rpv" autoPlay muted loop playsInline preload="none">
            <source src="/assets/videos/video-8.mp4" type="video/mp4" />
          </video>
          <video className="rpv" autoPlay muted loop playsInline preload="none">
            <source src="/assets/videos/video-9.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

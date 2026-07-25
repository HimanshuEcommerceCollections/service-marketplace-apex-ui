// section: FAQ — accordion (open/close driven by the runtime, .faq-item.open +
// max-height). Data in data/pricing/content.
import { faqs } from '../../data/pricing/content';
import SecHead from './SecHead';

const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function Faq() {
  return (
    <section className="sec">
      <SecHead eyebrow="Questions" title="Pricing, answered." />
      <div className="faq">
        {faqs.map((f) => (
          <div className="faq-item reveal" key={f.q}>
            <button className="faq-q">
              {f.q}
              <span className="ic">
                <Plus />
              </span>
            </button>
            <div className="faq-a">
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

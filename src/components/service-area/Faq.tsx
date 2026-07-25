// section 8: FAQ — accordion (open/close driven by the runtime).
import SecHead from './SecHead';
import { Plus } from './icons';
import { faqs } from '../../data/service-area/content';

export default function Faq() {
  return (
    <section className="sec" id="faq">
      <SecHead eyebrow="Questions" title="Service area, answered." />
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

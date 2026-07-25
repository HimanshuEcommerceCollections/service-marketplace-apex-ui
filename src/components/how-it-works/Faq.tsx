// section: FAQ — accordion (open/close driven by the runtime, .faq-item.open +
// max-height). Data in data/how-it-works/content.
import { faqHead, faqs } from '../../data/how-it-works/content';
import SecHead from './SecHead';
import { Plus } from './icons';

export default function Faq() {
  return (
    <section className="sec" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow={faqHead.eyebrow} title={faqHead.title} />
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

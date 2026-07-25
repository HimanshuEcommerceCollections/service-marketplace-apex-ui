// section: HOW PRICING WORKS — the three pricing models (fixed / variable /
// quote) with the services under each. Data in data/pricing/content.
import { models } from '../../data/pricing/content';
import SecHead from './SecHead';
import { Icon, Check } from './icons';

export default function Models() {
  return (
    <section className="sec" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow="How pricing works" title="Three simple pricing models." />
      <div className="swrap">
        <div className="model-grid">
          {models.map((m) => (
            <div className="model reveal sc" key={m.title}>
              <span className="svc-ic">
                <Icon name={m.icon} />
              </span>
              <h4>{m.title}</h4>
              <p>{m.body}</p>
              <ul>
                {m.items.map((it) => (
                  <li key={it}>
                    <Check />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

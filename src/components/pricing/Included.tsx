// section: WHAT'S INCLUDED — six essentials bundled into every price. Reuses the
// shared `.xcard` card style (membership.css) in a `.bgrid`. Data in
// data/pricing/content.
import { included } from '../../data/pricing/content';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function Included() {
  return (
    <section className="sec">
      <SecHead eyebrow="What's included" title="Every price includes the essentials." />
      <div className="swrap">
        <div className="bgrid">
          {included.map((i) => (
            <div className="xcard reveal" key={i.title}>
              <div className="xi">
                <Icon name={i.icon} />
              </div>
              <h4>{i.title}</h4>
              <p>{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

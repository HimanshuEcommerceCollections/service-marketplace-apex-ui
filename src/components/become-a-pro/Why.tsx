// section: WHY JOIN APEX — four benefit cards on the shared .bgrid/.xcard
// pattern (the icon pop fires on `.in`, set by the reveal IO).
import { whyHead, whyCards } from '../../data/become-a-pro/content';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function Why() {
  return (
    <section className="sec" id="why">
      <SecHead eyebrow={whyHead.eyebrow} title={whyHead.title} lede={whyHead.lede} />
      <div className="swrap">
        <div className="bgrid">
          {whyCards.map((c) => (
            <div className="xcard reveal" key={c.title}>
              <div className="xi">
                <Icon name={c.icon} />
              </div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

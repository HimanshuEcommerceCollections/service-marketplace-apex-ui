// section: LISTING PREPARATION — left column is a left-aligned SecHead plus the
// icon/label tile grid; right column is the diagonal before/after card with two
// floating chips. The before/after is a pure-CSS illustration (clip-path halves),
// not photography, so it needs no assets.
import { listingHead, listingItems, listingChips } from '../../data/property-managers/content';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function ListingPrep() {
  return (
    <section className="sec" id="listing">
      <div className="swrap">
        <div className="split">
          <div>
            <SecHead
              eyebrow={listingHead.eyebrow}
              title={listingHead.title}
              lede={listingHead.lede}
              left
            />
            <div className="mini-grid">
              {listingItems.map((it) => (
                <div className={`mini reveal${it.wide ? ' wide' : ''}`} key={it.label}>
                  <span className="m-ic">
                    <Icon name={it.icon} />
                  </span>
                  <span>{it.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="ba-card reveal"
            role="img"
            aria-label="Before and after listing preparation illustration"
          >
            <div className="ba-half before">
              <span className="ba-pill">Before</span>
            </div>
            <div className="ba-half after">
              <span className="ba-pill">After</span>
            </div>
            <div className="ba-divider" aria-hidden="true" />
            {listingChips.map((c, i) => (
              <div className={`ba-chip c${i + 1}`} key={c.title}>
                <span className="m-ic">
                  <Icon name={c.icon} />
                </span>
                <span>
                  <b>{c.title}</b>
                  <small>{c.caption}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

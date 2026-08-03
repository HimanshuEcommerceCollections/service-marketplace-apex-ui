/* eslint-disable @next/next/no-img-element */
// section: LISTING PREPARATION — left column is a left-aligned SecHead plus the
// icon/label tile grid; right column is the diagonal before/after card with two
// floating chips.
//
// Each half of the card holds a full-bleed photo clipped to its side of the
// diagonal, so the split reads as a wipe between the two states of the same
// room. The halves keep their original gradient/stripe backgrounds underneath as
// the fallback while the images load. Plain <img> (not next/image) to match the
// rest of the ported marketing pages.
import { listingHead, listingItems, listingChips } from '../../data/property-managers/content';
import { listingBeforeAfter } from '../../data/property-managers/media';
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

          <div className="ba-card reveal">
            <div className="ba-half before">
              <img
                className="ba-img"
                src={listingBeforeAfter.before.src}
                alt={listingBeforeAfter.before.alt}
                loading="lazy"
              />
              <span className="ba-pill">Before</span>
            </div>
            <div className="ba-half after">
              <img
                className="ba-img"
                src={listingBeforeAfter.after.src}
                alt={listingBeforeAfter.after.alt}
                loading="lazy"
              />
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

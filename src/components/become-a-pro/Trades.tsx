'use client';

// section: AVAILABLE TRADES — the selectable trade grid.
//
// Selection state is owned by <BecomeAProPage/> and shared with the application
// form, so picking a trade here checks its chip in the form and adds its
// acknowledgement row. The source design kept three copies of this state in sync
// by hand through the DOM; lifting it removes that entirely.
import { tradesHead, trades } from '../../data/become-a-pro/content';
import SecHead from './SecHead';
import { Icon, Check } from './icons';

export default function Trades({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <section className="sec" id="trades">
      <SecHead eyebrow={tradesHead.eyebrow} title={tradesHead.title} lede={tradesHead.lede} />
      <div className="swrap">
        <div className="trades-toolbar reveal">
          <span className="sel-count">
            <Check />
            <b>{selected.length}</b> trades selected
          </span>
        </div>
        <div className="trades-grid reveal">
          {trades.map((t) => {
            const on = selected.includes(t.slug);
            return (
              <button
                type="button"
                className={`trade${on ? ' sel' : ''}`}
                key={t.slug}
                aria-pressed={on}
                onClick={() => onToggle(t.slug)}
              >
                <span className="t-check">
                  <Check />
                </span>
                <span className="t-ic">
                  <Icon name={t.icon} />
                </span>
                <h4>{t.label}</h4>
                <p>{t.blurb}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

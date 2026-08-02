'use client';

// section: TRADE REQUIREMENTS — one expandable card per trade, listing the
// expectations. Local open/closed state (React) rather than the runtime's
// class-toggling, since the panel content is React-rendered.
//
// The intro note is deliberate: these are expectations, not verified checks —
// nothing here is enforced by the API.
import { useState } from 'react';
import { requirementsHead, requirementsNote, trades } from '../../data/become-a-pro/content';
import SecHead from './SecHead';
import { Icon, Plus, Check } from './icons';

export default function Requirements() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="sec sec-mist" id="requirements">
      <SecHead
        eyebrow={requirementsHead.eyebrow}
        title={requirementsHead.title}
        lede={requirementsHead.lede}
      />
      <div className="swrap">
        <p className="req-note reveal">{requirementsNote}</p>
        <div className="req-list">
          {trades.map((t) => {
            const isOpen = open === t.slug;
            return (
              <div className={`req reveal${isOpen ? ' open' : ''}`} key={t.slug}>
                <button
                  className="req-head"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : t.slug)}
                >
                  <span className="r-ic">
                    <Icon name={t.icon} />
                  </span>
                  <h4>{t.label}</h4>
                  <span className="r-tog">
                    <Plus />
                  </span>
                </button>
                <div className="req-body">
                  <div className="req-body-in">
                    {t.licence && <span className="req-tag">{t.licence}</span>}
                    <ul>
                      {t.requirements.map((r) => (
                        <li key={r}>
                          <Check />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

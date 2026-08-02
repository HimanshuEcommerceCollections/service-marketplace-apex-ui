'use client';

// section: APPLY TO JOIN — the validated application form.
//
// Trade selection is owned by <BecomeAProPage/> and shared with the Available
// Trades grid: the chips here and the cards up the page are two views of one
// state, and the acknowledgement list below rebuilds from it.
//
// A ZIP outside Wake County is a SOFT warning (.fld.warn) — it never blocks the
// submit, matching the source design.

import { useState } from 'react';
import {
  applyHead,
  trades,
  experienceOptions,
  availabilityOptions,
  startOptions,
  wakeZips,
} from '../../data/become-a-pro/content';
import { submitProApplication } from '../../lib/pro-applications';
import SecHead from './SecHead';
import { Arrow, Check } from './icons';

interface Fields {
  name: string;
  email: string;
  phone: string;
  zip: string;
  experience: string;
  company: string;
  availability: string;
  start: string;
  intro: string;
}

const EMPTY: Fields = {
  name: '',
  email: '',
  phone: '',
  zip: '',
  experience: '',
  company: '',
  availability: '',
  start: '',
  intro: '',
};

const RULES: { [K in keyof Fields]?: { test: (v: string) => boolean; msg: string } } = {
  name: { test: (v) => v.trim().length >= 2, msg: 'Please enter your full name.' },
  email: { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
  phone: { test: (v) => v.replace(/\D/g, '').length >= 10, msg: 'Please enter a valid phone number.' },
  zip: { test: (v) => /^\d{5}$/.test(v.trim()), msg: 'Please enter a valid 5-digit ZIP code.' },
  experience: { test: (v) => !!v, msg: 'Please select your years of experience.' },
  availability: { test: (v) => !!v, msg: 'Please select your availability.' },
};

export default function ApplyForm({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  const [f, setF] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [acks, setAcks] = useState<Record<string, boolean>>({});
  const [expect, setExpect] = useState(false);
  const [contact, setContact] = useState(false);
  const [showErrs, setShowErrs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const set = (k: keyof Fields) => (v: string) => {
    setF((prev) => ({ ...prev, [k]: v }));
    setServerError(null);
  };
  const blur = (k: keyof Fields) => () => setTouched((t) => ({ ...t, [k]: true }));
  const bad = (k: keyof Fields) => {
    const rule = RULES[k];
    return !!rule && (!!touched[k] || showErrs) && !rule.test(f[k]);
  };
  const cls = (k: keyof Fields, extra = '') => `fld${extra ? ' ' + extra : ''}${bad(k) ? ' err' : ''}`;

  // ZIP is valid but outside the served area — advisory only.
  const zipOutside =
    /^\d{5}$/.test(f.zip.trim()) && !wakeZips.includes(f.zip.trim());

  const selectedTrades = trades.filter((t) => selected.includes(t.slug));
  const tradesBad = showErrs && selected.length === 0;
  const ackMissing = selectedTrades.filter((t) => !acks[t.slug]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowErrs(true);
    const keys = Object.keys(RULES) as (keyof Fields)[];
    setTouched(Object.fromEntries(keys.map((k) => [k, true])));

    const fieldsOk = keys.every((k) => RULES[k]!.test(f[k]));
    if (!fieldsOk || selected.length === 0 || ackMissing.length || !expect || !contact) {
      requestAnimationFrame(() => {
        document
          .querySelector('.pg-pro .fld.err, .pg-pro .chk.err')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await submitProApplication({
        name: f.name,
        email: f.email,
        phone: f.phone,
        zip: f.zip,
        trades: selected,
        // Per-trade confirmations keyed by service slug, plus the two blanket
        // consents under `general` (the endpoint stores this JSON verbatim).
        acknowledgements: {
          ...Object.fromEntries(selected.map((s) => [s, { canMeetExpectations: true }])),
          general: { understandsExpectations: expect, agreesToContact: contact },
        },
        experience: f.experience,
        company: f.company,
        availability: f.availability,
        preferredStart: f.start,
        intro: f.intro,
      });
      setDone(res.application_id);
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Something went wrong sending your application. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="sec" id="apply">
      <SecHead eyebrow={applyHead.eyebrow} title={applyHead.title} lede={applyHead.lede} />
      <div className="form-wrap reveal">
        {done ? (
          <div className="form-success">
            <div className="success-ic">
              <Check />
            </div>
            <h3>Application received</h3>
            <p>
              Thanks for applying to join Apex. Our team will review your details and reach out
              about next steps and onboarding.
            </p>
            <div className="ref">Reference: {done.slice(0, 8).toUpperCase()}</div>
          </div>
        ) : (
          <form className="form-grid" onSubmit={onSubmit} noValidate>
            <div className={cls('name')}>
              <label className="flabel" htmlFor="proName">
                Full Name <span className="req-star">*</span>
              </label>
              <input
                className="inp"
                id="proName"
                type="text"
                placeholder="Jordan Miller"
                autoComplete="name"
                value={f.name}
                onChange={(e) => set('name')(e.target.value)}
                onBlur={blur('name')}
              />
              <span className="msg">{RULES.name!.msg}</span>
            </div>

            <div className={cls('email')}>
              <label className="flabel" htmlFor="proEmail">
                Email <span className="req-star">*</span>
              </label>
              <input
                className="inp"
                id="proEmail"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                value={f.email}
                onChange={(e) => set('email')(e.target.value)}
                onBlur={blur('email')}
              />
              <span className="msg">{RULES.email!.msg}</span>
            </div>

            <div className={cls('phone')}>
              <label className="flabel" htmlFor="proPhone">
                Phone <span className="req-star">*</span>
              </label>
              <input
                className="inp"
                id="proPhone"
                type="tel"
                placeholder="(919) 555-0142"
                autoComplete="tel"
                value={f.phone}
                onChange={(e) => set('phone')(e.target.value)}
                onBlur={blur('phone')}
              />
              <span className="msg">{RULES.phone!.msg}</span>
            </div>

            <div className={`${cls('zip')}${!bad('zip') && zipOutside ? ' warn' : ''}`}>
              <label className="flabel" htmlFor="proZip">
                ZIP Code <span className="req-star">*</span>
              </label>
              <input
                className="inp"
                id="proZip"
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="27601"
                autoComplete="postal-code"
                value={f.zip}
                onChange={(e) => set('zip')(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onBlur={blur('zip')}
              />
              <span className="msg">
                {bad('zip')
                  ? RULES.zip!.msg
                  : 'Heads up: that ZIP looks outside Wake County — you can still apply.'}
              </span>
            </div>

            <div className={cls('experience')}>
              <label className="flabel" htmlFor="proExp">
                Years of Experience <span className="req-star">*</span>
              </label>
              <select
                className="sel"
                id="proExp"
                value={f.experience}
                onChange={(e) => set('experience')(e.target.value)}
                onBlur={blur('experience')}
              >
                <option value="" disabled>
                  Select experience
                </option>
                {experienceOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="msg">{RULES.experience!.msg}</span>
            </div>

            <div className="fld">
              <label className="flabel" htmlFor="proCompany">
                Company Name <span className="opt">(optional)</span>
              </label>
              <input
                className="inp"
                id="proCompany"
                type="text"
                placeholder="Your business name"
                autoComplete="organization"
                value={f.company}
                onChange={(e) => set('company')(e.target.value)}
              />
            </div>

            <div className={cls('availability')}>
              <label className="flabel" htmlFor="proAvail">
                Availability <span className="req-star">*</span>
              </label>
              <select
                className="sel"
                id="proAvail"
                value={f.availability}
                onChange={(e) => set('availability')(e.target.value)}
                onBlur={blur('availability')}
              >
                <option value="" disabled>
                  Select availability
                </option>
                {availabilityOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="msg">{RULES.availability!.msg}</span>
            </div>

            <div className="fld">
              <label className="flabel" htmlFor="proStart">
                Preferred Start <span className="opt">(optional)</span>
              </label>
              <select
                className="sel"
                id="proStart"
                value={f.start}
                onChange={(e) => set('start')(e.target.value)}
              >
                <option value="" disabled>
                  Select a timeframe
                </option>
                {startOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className={`fld full${tradesBad ? ' err' : ''}`}>
              <span className="flabel">
                Trades You Offer <span className="req-star">*</span>
              </span>
              <div className="ms">
                <div className="ms-chips">
                  {trades.map((t) => {
                    const on = selected.includes(t.slug);
                    return (
                      <button
                        type="button"
                        className={`ms-chip${on ? ' on' : ''}`}
                        key={t.slug}
                        aria-pressed={on}
                        onClick={() => onToggle(t.slug)}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="ms-hint">
                Tap to select. These stay in sync with the Available Trades section above.
              </p>
              <span className="msg">Please select at least one trade.</span>
            </div>

            <div className="fld full">
              <label className="flabel" htmlFor="proIntro">
                Short Introduction <span className="opt">(optional)</span>
              </label>
              <textarea
                className="ta"
                id="proIntro"
                placeholder="Tell us about your work, the areas you cover, and what you take pride in."
                value={f.intro}
                onChange={(e) => set('intro')(e.target.value)}
              />
            </div>

            {selectedTrades.length > 0 && (
              <div className="ack-list">
                <div className="ack-title">Requirement Acknowledgements</div>
                {selectedTrades.map((t) => (
                  <label
                    className={`chk${showErrs && !acks[t.slug] ? ' err' : ''}`}
                    key={t.slug}
                  >
                    <input
                      type="checkbox"
                      checked={!!acks[t.slug]}
                      onChange={(e) => setAcks((a) => ({ ...a, [t.slug]: e.target.checked }))}
                    />
                    <span className="box">
                      <Check />
                    </span>
                    <span className="txt">
                      I can meet the expectations for <b>{t.label}</b>, including any licenses or
                      equipment it requires.
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="fld full" style={{ marginTop: 4 }}>
              <label className={`chk${showErrs && !expect ? ' err' : ''}`}>
                <input
                  type="checkbox"
                  checked={expect}
                  onChange={(e) => setExpect(e.target.checked)}
                />
                <span className="box">
                  <Check />
                </span>
                <span className="txt">
                  I understand the trade expectations and confirm I can meet them for the trades I
                  selected. <span className="req-star">*</span>
                </span>
              </label>
              <label className={`chk${showErrs && !contact ? ' err' : ''}`}>
                <input
                  type="checkbox"
                  checked={contact}
                  onChange={(e) => setContact(e.target.checked)}
                />
                <span className="box">
                  <Check />
                </span>
                <span className="txt">
                  I agree to be contacted by Apex about my application.{' '}
                  <span className="req-star">*</span>
                </span>
              </label>
            </div>

            {serverError && (
              <div className="form-error" role="alert">
                {serverError}
              </div>
            )}

            <div className="form-submit">
              <button className="btn btn-primary ripple" type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Apply to join Apex'} <Arrow />
              </button>
              <p className="form-legal">
                By applying, you confirm the information provided is accurate. Apex does not
                automatically verify licenses — you&rsquo;re responsible for holding any credentials
                your trade requires.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

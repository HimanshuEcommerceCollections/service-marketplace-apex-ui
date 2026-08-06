'use client';

// section: REQUEST A QUOTE — the aside plus the validated B2B form.
//
// Unlike the other ported sections (which are static markup driven by the
// vanilla runtime), this one is a React client component: it owns field state,
// per-field validation and the submit lifecycle so it can POST to
// /api/v1/pm-requests and surface a real server error instead of a fake success.

import { useState } from 'react';
import {
  quoteHead,
  quoteAside,
  unitRanges,
  timelines,
  bundleOptions,
} from '../../data/property-managers/content';
import { submitPmRequest, type PmBundle } from '../../lib/pm-requests';
import SecHead from './SecHead';
import { Icon, Arrow } from './icons';

interface Fields {
  company: string;
  contact: string;
  email: string;
  phone: string;
  units: string; // the range LABEL; mapped to an integer on submit
  timeline: string;
  bundle: '' | PmBundle;
  address: string;
  scope: string;
}

const EMPTY: Fields = {
  company: '',
  contact: '',
  email: '',
  phone: '',
  units: '',
  timeline: '',
  bundle: '',
  address: '',
  scope: '',
};

// Mirrors the endpoint's zod schema where it is stricter than the markup, and the
// design's own rules where it is stricter than the endpoint (company + phone are
// optional server-side but required here, matching the source form).
const RULES: { [K in keyof Fields]?: { test: (v: string) => boolean; msg: string } } = {
  company: { test: (v) => v.trim().length >= 2, msg: 'Please enter your company name.' },
  contact: { test: (v) => v.trim().length >= 2, msg: 'Please enter a contact name.' },
  email: { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
  phone: { test: (v) => v.replace(/\D/g, '').length >= 10, msg: 'Please enter a valid phone number.' },
  units: { test: (v) => !!v, msg: 'Please select an estimated unit count.' },
  bundle: { test: (v) => !!v, msg: 'Please choose a bundle type.' },
  address: { test: (v) => v.trim().length >= 6, msg: 'Please enter the property address.' },
};

export default function QuoteForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
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
    return !!rule && !!touched[k] && !rule.test(f[k]);
  };
  const cls = (k: keyof Fields, extra = '') => `fld${extra ? ' ' + extra : ''}${bad(k) ? ' err' : ''}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const keys = Object.keys(RULES) as (keyof Fields)[];
    setTouched(Object.fromEntries(keys.map((k) => [k, true])));
    if (keys.some((k) => !RULES[k]!.test(f[k]))) {
      document.querySelector('.pg-pm .fld.err')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const range = unitRanges.find((r) => r.label === f.units)!;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await submitPmRequest({
        company: f.company,
        contactName: f.contact,
        email: f.email,
        phone: f.phone,
        unitsLabel: range.label,
        unitsValue: range.value,
        bundle: f.bundle as PmBundle,
        address: f.address,
        timeline: f.timeline || undefined,
        scope: f.scope,
      });
      setDone(res.quote_request_id);
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Something went wrong sending your request. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="sec sec-mist" id="quote">
      <SecHead eyebrow={quoteHead.eyebrow} title={quoteHead.title} lede={quoteHead.lede} />
      <div className="swrap">
        <div className="form-cols">
          <aside className="form-aside">
            {quoteAside.map((a) => (
              <div className="aside-pt reveal" key={a.title}>
                <span className="m-ic">
                  <Icon name={a.icon} />
                </span>
                <div>
                  <h4>{a.title}</h4>
                  <p>{a.body}</p>
                </div>
              </div>
            ))}
          </aside>

          <div className="form-wrap reveal">
            {done ? (
              <div className="form-success">
                <div className="success-ic">
                  <Icon name="check" />
                </div>
                <h3>Request received</h3>
                <p>
                  Thanks. A coordinator will review your property details and reach out with a
                  customized quote.
                </p>
                <div className="ref">Reference: {done.slice(0, 8).toUpperCase()}</div>
              </div>
            ) : (
              <form className="form-grid" onSubmit={onSubmit} noValidate>
                <div className={cls('company')}>
                  <label className="flabel" htmlFor="pmCompany">
                    Company Name <span className="req-star">*</span>
                  </label>
                  <input
                    className="inp"
                    id="pmCompany"
                    type="text"
                    placeholder="Triangle Property Group"
                    autoComplete="organization"
                    value={f.company}
                    onChange={(e) => set('company')(e.target.value)}
                    onBlur={blur('company')}
                  />
                  <span className="msg">{RULES.company!.msg}</span>
                </div>

                <div className={cls('contact')}>
                  <label className="flabel" htmlFor="pmContact">
                    Contact Name <span className="req-star">*</span>
                  </label>
                  <input
                    className="inp"
                    id="pmContact"
                    type="text"
                    placeholder="Jordan Miller"
                    autoComplete="name"
                    value={f.contact}
                    onChange={(e) => set('contact')(e.target.value)}
                    onBlur={blur('contact')}
                  />
                  <span className="msg">{RULES.contact!.msg}</span>
                </div>

                <div className={cls('email')}>
                  <label className="flabel" htmlFor="pmEmail">
                    Business Email <span className="req-star">*</span>
                  </label>
                  <input
                    className="inp"
                    id="pmEmail"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={f.email}
                    onChange={(e) => set('email')(e.target.value)}
                    onBlur={blur('email')}
                  />
                  <span className="msg">{RULES.email!.msg}</span>
                </div>

                <div className={cls('phone')}>
                  <label className="flabel" htmlFor="pmPhone">
                    Phone Number <span className="req-star">*</span>
                  </label>
                  <input
                    className="inp"
                    id="pmPhone"
                    type="tel"
                    placeholder="(919) 555-0142"
                    autoComplete="tel"
                    value={f.phone}
                    onChange={(e) => set('phone')(e.target.value)}
                    onBlur={blur('phone')}
                  />
                  <span className="msg">{RULES.phone!.msg}</span>
                </div>

                <div className={cls('units')}>
                  <label className="flabel" htmlFor="pmUnits">
                    Estimated Number of Units <span className="req-star">*</span>
                  </label>
                  <select
                    className="sel"
                    id="pmUnits"
                    value={f.units}
                    onChange={(e) => set('units')(e.target.value)}
                    onBlur={blur('units')}
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    {unitRanges.map((r) => (
                      <option key={r.label}>{r.label}</option>
                    ))}
                  </select>
                  <span className="msg">{RULES.units!.msg}</span>
                </div>

                <div className="fld">
                  <label className="flabel" htmlFor="pmTimeline">
                    Preferred Timeline <span className="opt">(optional)</span>
                  </label>
                  <select
                    className="sel"
                    id="pmTimeline"
                    value={f.timeline}
                    onChange={(e) => set('timeline')(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a timeframe
                    </option>
                    {timelines.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className={cls('bundle', 'full')}>
                  <span className="flabel">
                    Bundle Type <span className="req-star">*</span>
                  </span>
                  <div className="bundle-row">
                    {bundleOptions.map((b) => (
                      <label className="bundle" key={b.value}>
                        <input
                          type="radio"
                          name="bundle"
                          value={b.value}
                          checked={f.bundle === b.value}
                          onChange={() => {
                            set('bundle')(b.value);
                            setTouched((t) => ({ ...t, bundle: true }));
                          }}
                        />
                        <span className="b-in">
                          <span className="b-radio" />
                          <span>
                            <h5>{b.title}</h5>
                            <p>{b.body}</p>
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <span className="msg">{RULES.bundle!.msg}</span>
                </div>

                <div className={cls('address', 'full')}>
                  <label className="flabel" htmlFor="pmAddress">
                    Property Address <span className="req-star">*</span>
                  </label>
                  <input
                    className="inp"
                    id="pmAddress"
                    type="text"
                    placeholder="123 Main St, Raleigh, NC 27601"
                    autoComplete="street-address"
                    value={f.address}
                    onChange={(e) => set('address')(e.target.value)}
                    onBlur={blur('address')}
                  />
                  <span className="msg">{RULES.address!.msg}</span>
                </div>

                <div className="fld full">
                  <label className="flabel" htmlFor="pmScope">
                    Project Scope Notes <span className="opt">(optional)</span>
                  </label>
                  <textarea
                    className="ta"
                    id="pmScope"
                    placeholder="Tell us about the property, the services you need, and anything a coordinator should know."
                    value={f.scope}
                    onChange={(e) => set('scope')(e.target.value)}
                  />
                </div>

                {serverError && (
                  <div className="form-error" role="alert">
                    {serverError}
                  </div>
                )}

                <div className="form-submit">
                  <button className="btn btn-primary ripple" type="submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Request coordinator quote'} <Arrow />
                  </button>
                  <p className="form-legal">
                    This is a quote request, not a booking. A coordinator will review your details
                    and follow up. Nothing is scheduled or charged until you approve a quote.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

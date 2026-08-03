'use client';

// section 6: WAITLIST — "Join the waitlist."
//
// Now POSTs to /waitlist. This form previously validated its four fields and
// then faked success with a 700ms setTimeout: nothing was ever sent, and every
// signup was silently discarded (the WaitlistSignup table was empty).
//
// Moved out of the page runtime for the same reason as the ZIP checker: a real
// request needs pending, duplicate and failure states, and the success panel is
// rendered rather than injected. Markup and class names are unchanged, so
// service-area.css applies as-is.

import { useState } from 'react';
import SecHead from './SecHead';
import { joinWaitlist } from '../../lib/service-area/availability';

type Field = 'name' | 'email' | 'phone' | 'zip';

const VALID: Record<Field, (v: string) => boolean> = {
  name: (v) => v.trim().length > 1,
  email: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()),
  phone: (v) => v.replace(/\D/g, '').length >= 10,
  zip: (v) => /^\d{5}$/.test(v.trim()),
};

const LABEL: Record<Field, string> = {
  name: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  zip: 'ZIP code',
};

const Tick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'done'; created: boolean }
  | { kind: 'failed'; message: string };

/** `prefillZip` comes from the ZIP checker's "Join the waitlist" button. */
export default function Waitlist({ prefillZip }: { prefillZip?: string }) {
  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    email: '',
    phone: '',
    zip: '',
  });
  // Only fields the user has left (or a failed submit) show validation state,
  // so the form doesn't turn red while it is still being filled in.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  // Adjust state during render rather than in an effect (React's documented
  // "changing state when a prop changes" pattern): no wasted second render, and
  // the user can still edit the ZIP afterwards because this only fires when
  // prefillZip itself changes.
  const [lastPrefill, setLastPrefill] = useState(prefillZip);
  if (prefillZip && prefillZip !== lastPrefill) {
    setLastPrefill(prefillZip);
    setValues((v) => ({ ...v, zip: prefillZip }));
  }

  const set = (f: Field, raw: string) => {
    const v = f === 'zip' ? raw.replace(/\D/g, '').slice(0, 5) : raw;
    setValues((prev) => ({ ...prev, [f]: v }));
  };

  async function submit() {
    const fields = Object.keys(VALID) as Field[];
    setTouched({ name: true, email: true, phone: true, zip: true });
    if (!fields.every((f) => VALID[f](values[f]))) return;

    setStatus({ kind: 'sending' });
    try {
      const res = await joinWaitlist({
        email: values.email.trim(),
        zip: values.zip.trim(),
        name: values.name.trim(),
        phone: values.phone.trim(),
        // The ZIP checker sends people here after a miss; attribute it as such.
        source: prefillZip ? 'service-area-miss' : 'service-area-page',
      });
      setStatus({ kind: 'done', created: res.created });
    } catch (e) {
      setStatus({
        kind: 'failed',
        message: e instanceof Error ? e.message : 'Something went wrong. Please try again.',
      });
    }
  }

  const done = status.kind === 'done';

  return (
    <section className="sec" id="waitlist">
      <SecHead
        eyebrow="Not covered yet?"
        title="Join the waitlist."
        lede="Add your details and we’ll notify you the moment Apex expands into your neighborhood."
      />
      <div className="swrap">
        <div className="wait-card reveal">
          <div className="form-grid">
            {(Object.keys(VALID) as Field[]).map((f) => {
              const v = values[f];
              const ok = VALID[f](v);
              const show = touched[f] && v.length > 0;
              return (
                <div className={`ff${show && ok ? ' ok' : ''}${touched[f] && !ok ? ' err' : ''}`} key={f}>
                  <input
                    id={`w${f[0].toUpperCase()}${f.slice(1)}`}
                    type={f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text'}
                    placeholder=" "
                    value={v}
                    disabled={done}
                    inputMode={f === 'zip' ? 'numeric' : undefined}
                    maxLength={f === 'zip' ? 5 : undefined}
                    onChange={(e) => set(f, e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, [f]: true }))}
                  />
                  <label htmlFor={`w${f[0].toUpperCase()}${f.slice(1)}`}>{LABEL[f]}</label>
                  <div className="msg">{touched[f] && !ok ? `Enter a valid ${LABEL[f].toLowerCase()}` : ''}</div>
                </div>
              );
            })}
          </div>

          {!done && (
            <button
              className="btn btn-primary ripple"
              id="waitBtn"
              type="button"
              style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
              onClick={() => void submit()}
              disabled={status.kind === 'sending'}
            >
              {status.kind === 'sending' ? 'Joining…' : 'Join waitlist'}
            </button>
          )}

          {status.kind === 'failed' && (
            <div className="msg" style={{ marginTop: 10 }} role="alert">
              {status.message}
            </div>
          )}

          <div className={`wait-success${done ? ' show' : ''}`} id="waitSuccess">
            {done && (
              <>
                <span className="wb">
                  <Tick />
                </span>
                <div>
                  <b>{status.created ? 'You’re on the list!' : 'You’re already on the list.'}</b>
                  <span>We’ll notify you when Apex expands into your neighborhood.</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

// section 2: ZIP CHECKER — "Is Apex in your neighborhood?"
//
// Now answered by the API (GET /service-area/validate) instead of a hardcoded
// array, so the result matches what staff maintain in /admin/zip-codes. That
// makes the check async, which is why this moved out of the page runtime and
// into React: it needs loading and failure states, and the result panel is now
// rendered rather than injected as an innerHTML string.
//
// Markup and class names are unchanged from what the runtime used to inject, so
// service-area.css applies as-is.

import { useRef, useState } from 'react';
import SecHead from './SecHead';
import { checkZipAvailability } from '../../lib/service-area/availability';

type State =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'served'; zip: string }
  | { kind: 'unserved'; zip: string }
  | { kind: 'failed' };

const Tick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const Cross = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function ZipChecker({ onWaitlistPrefill }: { onWaitlistPrefill?: (zip: string) => void }) {
  const [zip, setZip] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [state, setState] = useState<State>({ kind: 'idle' });
  // Only the newest lookup may settle — a slow first request must not overwrite
  // the result of a second, faster one.
  const inflight = useRef<AbortController | null>(null);

  async function check() {
    const v = zip.trim();
    if (!/^\d{5}$/.test(v)) {
      setInvalid(true);
      setState({ kind: 'idle' });
      return;
    }
    setInvalid(false);
    inflight.current?.abort();
    const ctrl = new AbortController();
    inflight.current = ctrl;
    setState({ kind: 'checking' });
    try {
      // No `service` here on purpose: this is the marketing page's "are you in
      // our area at all?" question. The booking wizard asks the per-service
      // version, which can be stricter — a ZIP inside an active area may still be
      // excluded for one service.
      const res = await checkZipAvailability(v, { signal: ctrl.signal });
      if (ctrl.signal.aborted) return;
      setState(res.eligible ? { kind: 'served', zip: v } : { kind: 'unserved', zip: v });
    } catch (e) {
      if (ctrl.signal.aborted || (e instanceof DOMException && e.name === 'AbortError')) return;
      // Never degrade to "not served" — that would push a serviceable customer
      // to the waitlist because a request dropped.
      setState({ kind: 'failed' });
    }
  }

  return (
    <section className="sec" id="zip">
      <SecHead eyebrow="Availability" title="Is Apex in your neighborhood?" />
      <div className="swrap">
        <div className="zip-card reveal">
          <div className="zip-input-row">
            <div className={`ff${invalid ? ' err' : ''}`}>
              <input
                id="zipInput"
                placeholder=" "
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
                  if (invalid) setInvalid(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void check();
                }}
              />
              <label htmlFor="zipInput">Enter your ZIP code</label>
              <div className="msg">{invalid ? 'Enter a valid 5-digit ZIP code' : ''}</div>
            </div>
            <button
              className="btn btn-primary ripple"
              id="zipCheck"
              type="button"
              onClick={() => void check()}
              disabled={state.kind === 'checking'}
            >
              {state.kind === 'checking' ? 'Checking…' : 'Check availability'}
            </button>
          </div>

          <div className="zip-result" id="zipResult">
            {state.kind === 'served' && (
              <div className="zip-state ok show">
                <div className="zh">
                  <span className="zbadge">
                    <Tick />
                  </span>
                  Great news! Apex serves your area.
                </div>
                <p>Book online in about 90 seconds, with the same trusted local team and transparent pricing.</p>
                <div className="zbtns">
                  <a className="btn btn-primary ripple" href="/book">
                    Book now
                  </a>
                  <a className="btn btn-line ripple" href="#services">
                    View services
                  </a>
                </div>
              </div>
            )}

            {state.kind === 'unserved' && (
              <div className="zip-state no show">
                <div className="zh">
                  <span className="zbadge">
                    <Cross />
                  </span>
                  We’re not in your area yet.
                </div>
                <p>
                  We’re expanding across the Triangle fast. Join the waitlist and we’ll notify you the
                  moment we reach {state.zip}.
                </p>
                <div className="zbtns">
                  <a
                    className="btn btn-primary ripple"
                    href="#waitlist"
                    onClick={() => onWaitlistPrefill?.(state.zip)}
                  >
                    Join the waitlist
                  </a>
                </div>
              </div>
            )}

            {state.kind === 'failed' && (
              <div className="zip-state warn show">
                <div className="zh">
                  <span className="zbadge">
                    <Cross />
                  </span>
                  We couldn’t check that just now.
                </div>
                <p>
                  Something went wrong on our end. Please try again in a moment, or{' '}
                  <a className="link" href="/book">
                    start a booking
                  </a>{' '}
                  and we’ll confirm coverage with you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

// /book — dedicated multi-step booking page. Ported from apex-booking.html.
// The step shells + step-4 form are static markup; #cfg / #pcard / #review /
// #sumBody are filled imperatively by mountBooking(). Chrome is the shared
// SiteNav/SiteFooter (mountChrome drives nav shrink + footer reveal).
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import SiteNav from '../shared/SiteNav';
import SiteFooter from '../shared/SiteFooter';
import { mountBooking } from '../../lib/booking/runtime';
import { mountChrome } from '../../lib/shared/chrome';

const Ic = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

interface Svc {
  id: string;
  name: string;
  desc: string;
  from: number | null;
  icon: ReactNode;
}
const services: Svc[] = [
  { id: 'cleaning', name: 'Home Cleaning', desc: 'Recurring or one-time cleans, priced by beds & baths.', from: 129, icon: <><path d="M3 12l2-2h14l2 2v7a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path d="M8 10V6a4 4 0 018 0v4" /></> },
  { id: 'lawn', name: 'Lawn Care', desc: 'Mowing, edging & full lawn care on your schedule.', from: 39, icon: <path d="M3 20h18M6 20V8M10 20V5M14 20v-8M18 20V9" /> },
  { id: 'power', name: 'Power Washing', desc: 'Driveways, siding & decks blasted back to new.', from: 79, icon: <path d="M12 3v6M8 7l4-4 4 4M5 21h14l-2-9H7z" /> },
  { id: 'paint', name: 'Painting', desc: 'Interior & exterior painting, done clean and sharp.', from: 349, icon: <path d="M4 20l6-6M14 6l4 4M13 5l6 6-9 3-3-3z" /> },
  { id: 'junk', name: 'Junk Removal', desc: 'Lift, load & haul-away, priced by truck load.', from: 99, icon: <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13h10l1-13" /> },
  { id: 'pool', name: 'Pool Service', desc: 'Skim, vacuum, brush & chemical balancing.', from: 119, icon: <path d="M2 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2M6 15V6a2 2 0 014 0M14 15V6a2 2 0 014 0" /> },
  { id: 'pest', name: 'Pest Control', desc: 'Interior + exterior treatment, pet & family safe.', from: 99, icon: <path d="M12 3v3M9 6h6M8 10a4 4 0 018 0v4a4 4 0 01-8 0zM4 12h4M16 12h4M5 8l3 2M19 8l-3 2M5 16l3-2M19 16l-3-2" /> },
  { id: 'security', name: 'Home Security', desc: 'Cameras, sensors & monitoring, tailored to your home.', from: null, icon: <><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></> },
  { id: 'smart', name: 'Smart Home', desc: 'Thermostats, locks, cameras. Bundle & save.', from: 90, icon: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><circle cx="12" cy="15" r="2" /></> },
  { id: 'handyman', name: 'Handyman', desc: 'Repairs & odd jobs, booked by the block of time.', from: 150, icon: <path d="M14 7l3 3M3 21l9-9M14.7 3.3a2 2 0 013 3L9 15l-4 1 1-4z" /> },
  { id: 'tree', name: 'Tree & Stump Removal', desc: 'Trimming, removal & stump grinding by pros.', from: null, icon: <path d="M12 22v-6M8 16a4 4 0 01-1-8 5 5 0 019.5-1.5A3.5 3.5 0 0116 16z" /> },
];

const stepDots = [
  { s: 1, l: 'Service' },
  { s: 2, l: 'Configure' },
  { s: 3, l: 'Pricing' },
  { s: 4, l: 'Details' },
  { s: 5, l: 'Confirm' },
];

export default function BookingPage() {
  useEffect(() => {
    const disposeBooking = mountBooking();
    const disposeChrome = mountChrome();
    return () => {
      disposeBooking();
      disposeChrome();
    };
  }, []);

  return (
    <div className="pg-book">
      <SiteNav />

      <div className="bk-progress">
        <div className="steps" id="steps">
          <div className="fill" id="pfill" />
          {stepDots.map((d) => (
            <div key={d.s} className={`stepdot${d.s === 1 ? ' active' : ''}`} data-s={d.s}>
              <span className="c">{d.s}</span>
              <span className="l">{d.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bk-wrap">
        <div className="bk-main">
          {/* STEP 1 */}
          <section className="step active" data-step="1">
            <div className="step-h">
              <h2>Choose your service</h2>
              <p>Select the service you&apos;d like Apex to handle.</p>
            </div>
            <div className="svc-grid">
              {services.map((s) => (
                <button className="svc-card" data-id={s.id} key={s.id}>
                  <span className="pick" />
                  <span className="svc-ic">
                    <Ic>{s.icon}</Ic>
                  </span>
                  <h4>{s.name}</h4>
                  <p>{s.desc}</p>
                  <div className="svc-price">{s.from == null ? 'Custom Estimate' : <><small>from </small>${s.from}</>}</div>
                </button>
              ))}
            </div>
          </section>

          {/* STEP 2 */}
          <section className="step" data-step="2">
            <div className="step-h">
              <h2>Configure your service</h2>
              <p>Tell us the details so we can tailor your quote.</p>
            </div>
            <div className="cfg" id="cfg" />
            <div className="bk-nav">
              <button className="btn btn-line ripple" data-go="1">Back</button>
              <button className="btn btn-primary ripple" data-go="3">Continue</button>
            </div>
          </section>

          {/* STEP 3 */}
          <section className="step" data-step="3">
            <div className="step-h">
              <h2>Your estimate</h2>
              <p>Live pricing based on your configuration. Final price confirmed on site.</p>
            </div>
            <div className="pcard" id="pcard" />
            <div className="bk-nav">
              <button className="btn btn-line ripple" data-go="2">Back</button>
              <button className="btn btn-primary ripple" data-go="4">Continue</button>
            </div>
          </section>

          {/* STEP 4 */}
          <section className="step" data-step="4">
            <div className="step-h">
              <h2>Contact &amp; address</h2>
              <p>Where should we send your assigned professional?</p>
            </div>
            <div className="blk">
              <h3>Personal information</h3>
              <div className="form-grid">
                <div className="ff"><input id="fn" placeholder=" " autoComplete="given-name" /><label htmlFor="fn">First name</label><div className="msg" /></div>
                <div className="ff"><input id="ln" placeholder=" " autoComplete="family-name" /><label htmlFor="ln">Last name</label><div className="msg" /></div>
                <div className="ff full"><input id="em" type="email" placeholder=" " autoComplete="email" /><label htmlFor="em">Email address</label><div className="msg" /></div>
                <div className="ff full"><input id="ph" type="tel" placeholder=" " autoComplete="tel" /><label htmlFor="ph">Phone number</label><div className="msg" /></div>
              </div>
            </div>
            <div className="blk">
              <h3>Property address</h3>
              <div className="form-grid">
                <div className="ff full"><input id="st" placeholder=" " autoComplete="address-line1" /><label htmlFor="st">Street address</label><div className="msg" /></div>
                <div className="ff"><input id="ci" placeholder=" " autoComplete="address-level2" /><label htmlFor="ci">City</label><div className="msg" /></div>
                <div className="ff"><input id="stt" placeholder=" " autoComplete="address-level1" /><label htmlFor="stt">State</label><div className="msg" /></div>
                <div className="ff"><input id="zip" placeholder=" " inputMode="numeric" autoComplete="postal-code" /><label htmlFor="zip">ZIP code</label><div className="msg" /></div>
              </div>
              <div style={{ marginTop: '18px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ink)' }}>Property type</label>
                <div className="prop-cards" id="prop">
                  <div className="prop on" data-v="House"><Ic><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></Ic>House</div>
                  <div className="prop" data-v="Apartment"><Ic><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></Ic>Apartment</div>
                  <div className="prop" data-v="Commercial"><Ic><path d="M3 21h18M6 21V7l7-4v18M13 21V10l5 3v8" /></Ic>Commercial</div>
                </div>
              </div>
            </div>
            <div className="blk">
              <h3>Preferred schedule</h3>
              <div className="form-grid">
                <div className="ff"><input id="dt" type="date" placeholder=" " /><label htmlFor="dt" style={{ top: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--bblue)' }}>Preferred date</label><div className="msg" /></div>
                <div className="full">
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '8px', color: 'var(--ink)' }}>Time window</label>
                  <div className="slots" id="slots">
                    <button data-v="Morning (8–11am)">Morning</button>
                    <button data-v="Midday (11am–2pm)">Midday</button>
                    <button data-v="Afternoon (2–5pm)">Afternoon</button>
                    <button data-v="Flexible">Flexible</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bk-nav">
              <button className="btn btn-line ripple" data-go="3">Back</button>
              <button className="btn btn-primary ripple" id="toReview">Continue</button>
            </div>
          </section>

          {/* STEP 5 */}
          <section className="step" data-step="5">
            <div className="step-h">
              <h2>Review &amp; confirm</h2>
              <p>One last look before we send it to your coordinator.</p>
            </div>
            <div className="rev" id="review" />
            <label className="agree" id="agree">
              <span className="box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
              <p>I understand final pricing may be confirmed by my assigned professional.</p>
            </label>
            <div className="bk-nav">
              <button className="btn btn-line ripple" data-go="4">Back</button>
              <button className="btn btn-primary ripple" id="submitBtn" disabled>Submit booking request</button>
            </div>
          </section>

          {/* SUCCESS */}
          <div className="success" id="success">
            <div className="ill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h2>You&apos;re all set!</h2>
            <div className="bid" id="bid">APX-2026-0001</div>
            <p>We&apos;ve received your booking request. Our coordinator will contact you shortly to confirm the final details.</p>
            <div className="cta-row">
              <button className="btn btn-primary ripple" id="again">Book another service</button>
              <Link className="btn btn-line ripple" href="/">Return home</Link>
            </div>
          </div>
        </div>

        <aside className="bk-side" id="side">
          <div className="sum">
            <h4>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
              Booking summary
            </h4>
            <div className="prog"><i id="sprog" /></div>
            <div id="sumBody"><div className="empty">Select a service to get started.</div></div>
          </div>
        </aside>
      </div>

      <canvas id="confetti" />

      <SiteFooter />
    </div>
  );
}

'use client';

// Booking history for the signed-in customer — the destination of the navbar
// avatar's "My Bookings" item, and now the payment hub: unpaid FROM bookings
// offer Complete payment / Cancel booking (they auto-cancel after the payment
// window), quoted QUOTE bookings offer Pay once the coordinator sets the
// amount, and Stripe redirects (subscription checkout, redirect-based payment
// methods) land here with a banner.

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SiteNav from '../../components/shared/SiteNav';
import SiteFooter from '../../components/shared/SiteFooter';
import PayBooking from '../../components/payments/PayBooking';
import { mountChrome } from '../../lib/shared/chrome';
import { useRoleGuard } from '../lib/use-role-guard';
import { api, ApiError } from '../lib/api-client';

/** Customers only — staff and professionals get routed to their own surface. */
const ALLOWED = ['CUSTOMER'] as const;

interface MyBooking {
  reference: string;
  service: { slug: string; name: string } | null;
  status: string;
  quoteRequest: boolean;
  priceTotal: number | null;
  taxAmount: number | null;
  grandTotal: number | null;
  quotedAmount: number | null;
  currency: string;
  canPay: boolean;
  canCancel: boolean;
  paymentDueAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
}

const money = (cents: number | null, currency: string) =>
  cents == null
    ? '—'
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(cents / 100);

const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const label = (status: string) => status.replace(/_/g, ' ').toLowerCase();

export default function MyBookingsView() {
  const { status, user } = useRoleGuard(ALLOWED);
  const params = useSearchParams();
  const [bookings, setBookings] = useState<MyBooking[] | null>(null);
  const [failed, setFailed] = useState(false);
  /** Reference of the booking whose payment pane is open. */
  const [paying, setPaying] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Stripe redirect landings: subscription checkout + redirect-based payments.
  // On a redirect-based payment Stripe appends redirect_status; a failed attempt
  // still lands on ?payment=success, so the success banner MUST also require the
  // redirect not to have failed — otherwise a declined payment reads as confirmed.
  const redirectStatus = params.get('redirect_status');
  const banner =
    params.get('membership') === 'success'
      ? 'Your membership is active. Visits will appear here as each cycle is billed.'
      : params.get('payment') === 'success' && redirectStatus !== 'failed'
        ? 'Payment received. Your booking is confirmed on our side.'
        : null;
  const warnBanner =
    params.get('payment') === 'success' && redirectStatus === 'failed'
      ? "Your payment didn't go through. This booking is still awaiting payment — please try again."
      : null;

  useEffect(() => {
    const dispose = mountChrome();
    return dispose;
  }, []);

  const load = useCallback(() => {
    return api<MyBooking[]>('/me/bookings')
      .then((rows) => {
        setBookings(rows);
        setFailed(false);
      })
      .catch(() => {
        setBookings([]);
        setFailed(true);
      });
  }, []);

  // Hold the fetch until the role checks out — a professional passing through
  // shouldn't fire a request that only exists to be redirected away from.
  useEffect(() => {
    if (!user) return;
    let active = true;
    api<MyBooking[]>('/me/bookings')
      .then((rows) => {
        if (active) setBookings(rows);
      })
      .catch(() => {
        if (active) {
          setBookings([]);
          setFailed(true);
        }
      });
    return () => {
      active = false;
    };
  }, [user]);

  async function cancelBooking(reference: string) {
    setErr(null);
    setNotice(null);
    try {
      await api(`/me/bookings/${encodeURIComponent(reference)}/cancel`, { method: 'POST' });
      setNotice(`Booking ${reference} cancelled.`);
      if (paying === reference) setPaying(null);
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Cancel failed.');
    }
  }

  function onPaid(reference: string) {
    setPaying(null);
    setNotice(`Payment received for ${reference} — thank you!`);
    void load();
  }

  return (
    <div className="pg-mybookings">
      <SiteNav />
      <main className="mb-wrap">
        {status !== 'allowed' ? (
          <p className="mb-muted">{status === 'loading' ? 'Loading…' : 'Redirecting…'}</p>
        ) : (
          <>
            <div className="mb-head">
              <div>
                <h1>My Bookings</h1>
                <p className="mb-sub">
                  {user.name} · {user.email}
                </p>
              </div>
              {bookings !== null && bookings.length > 0 && (
                <span className="mb-count">
                  {bookings.length} booking{bookings.length === 1 ? '' : 's'}
                </span>
              )}
            </div>

            {banner && <p className="mb-note is-ok">{banner}</p>}
            {warnBanner && <p className="mb-note is-err">{warnBanner}</p>}
            {notice && <p className="mb-note is-ok">{notice}</p>}
            {err && <p className="mb-note is-err">{err}</p>}

            {!user.emailVerified && (
              <p className="mb-note">Please verify your email. Check your inbox for the verification link.</p>
            )}

            {bookings === null ? (
              <p className="mb-muted">Loading your booking history…</p>
            ) : failed ? (
              <p className="mb-muted">We couldn&apos;t load your bookings just now. Please refresh to try again.</p>
            ) : bookings.length === 0 ? (
              <div className="mb-empty">
                <h2>No bookings yet</h2>
                <p>Your booking history will show up here once you request your first service.</p>
                <Link className="mb-cta" href="/book">
                  Book a service
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <ul className="mb-list">
                {bookings.map((b) => (
                  <li className="mb-item" key={b.reference}>
                    <div className="mb-item-row">
                      <div className="mb-item-main">
                        <h2>{b.service?.name ?? 'Service'}</h2>
                        <div className="mb-meta">
                          <span className="mb-ref">{b.reference}</span>
                          <span className="dot" />
                          <span>Booked {day(b.createdAt)}</span>
                          {b.scheduledAt && (
                            <>
                              <span className="dot" />
                              <span>Scheduled {day(b.scheduledAt)}</span>
                            </>
                          )}
                        </div>
                        {b.quoteRequest && b.quotedAmount == null && b.status === 'PENDING' && (
                          <p className="mb-quotewait">Your coordinator is preparing a quote. You can pay here once it arrives.</p>
                        )}
                        {b.canCancel && b.paymentDueAt && (
                          <p className="mb-quotewait">Unpaid. Cancels automatically on {day(b.paymentDueAt)} unless paid.</p>
                        )}
                      </div>
                      <div className="mb-item-side">
                        <span className={`mb-badge is-${b.status.toLowerCase()}`}>{label(b.status)}</span>
                        <span className="mb-price">{money(b.grandTotal ?? b.priceTotal, b.currency)}</span>
                        {(b.canPay || b.canCancel) && (
                          <span className="mb-actions">
                            {b.canPay && (
                              <button
                                type="button"
                                className="mb-btn"
                                onClick={() => setPaying(paying === b.reference ? null : b.reference)}
                              >
                                {paying === b.reference ? 'Close' : b.quoteRequest ? 'Pay quote' : 'Complete payment'}
                              </button>
                            )}
                            {b.canCancel && (
                              <button type="button" className="mb-btn is-ghost" onClick={() => void cancelBooking(b.reference)}>
                                Cancel booking
                              </button>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    {paying === b.reference && (
                      <div className="mb-pay">
                        <PayBooking reference={b.reference} onPaid={() => onPaid(b.reference)} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

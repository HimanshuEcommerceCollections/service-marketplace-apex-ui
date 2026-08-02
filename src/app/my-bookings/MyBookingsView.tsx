'use client';

// Booking history for the signed-in customer — the destination of the navbar
// avatar's "My Bookings" item. Replaces the old /account page: same GET
// /me/bookings data, but on the shared site chrome instead of the bare auth
// sheet, and with sign-out living in the navbar menu.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteNav from '../../components/shared/SiteNav';
import SiteFooter from '../../components/shared/SiteFooter';
import { mountChrome } from '../../lib/shared/chrome';
import { useCustomerAuth } from '../lib/customer-auth';
import { api } from '../lib/api-client';

interface MyBooking {
  reference: string;
  service: { slug: string; name: string } | null;
  status: string;
  priceTotal: number | null;
  currency: string;
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
  const { user, loading } = useCustomerAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<MyBooking[] | null>(null);
  const [failed, setFailed] = useState(false);
  // `user` also drops to null when the navbar menu logs out, and that redirects
  // home. Without this the sign-in guard below would race it and win, bouncing
  // the user to /login instead. Only guard the arrive-signed-out case.
  const everSignedIn = useRef(false);
  useEffect(() => {
    if (user) everSignedIn.current = true;
  }, [user]);

  useEffect(() => {
    const dispose = mountChrome();
    return dispose;
  }, []);

  useEffect(() => {
    if (!loading && !user && !everSignedIn.current) router.replace('/login?next=/my-bookings');
  }, [loading, user, router]);

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

  return (
    <div className="pg-mybookings">
      <SiteNav />
      <main className="mb-wrap">
        {loading || !user ? (
          <p className="mb-muted">Loading…</p>
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

            {!user.emailVerified && (
              <p className="mb-note">Please verify your email — check your inbox for the verification link.</p>
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
                    </div>
                    <div className="mb-item-side">
                      <span className={`mb-badge is-${b.status.toLowerCase()}`}>{label(b.status)}</span>
                      <span className="mb-price">{money(b.priceTotal, b.currency)}</span>
                    </div>
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

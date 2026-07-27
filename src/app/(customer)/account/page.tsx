"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomerAuth } from "../customer-auth";
import { api } from "../../lib/api-client";

interface MyBooking {
  reference: string;
  service: { slug: string; name: string } | null;
  status: string;
  priceTotal: number | null;
  currency: string;
  createdAt: string;
}

const money = (c: number | null) => (c == null ? "—" : `$${(c / 100).toFixed(2)}`);

export default function AccountPage() {
  const { user, loading, logout } = useCustomerAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<MyBooking[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) api<MyBooking[]>("/me/bookings").then(setBookings).catch(() => setBookings([]));
  }, [user]);

  if (loading || !user) {
    return <div className="auth"><div className="auth-wrap"><p className="auth-muted">Loading…</p></div></div>;
  }

  return (
    <div className="auth">
      <div className="auth-shell">
        <div className="auth-top">
          <h1>My account</h1>
          <button className="auth-linkbtn" onClick={() => void logout().then(() => router.replace("/login"))}>Sign out</button>
        </div>

        <p className="auth-muted" style={{ marginBottom: 4 }}>{user.name} · {user.email}</p>
        {!user.emailVerified && (
          <div className="auth-alert ok" style={{ marginTop: 12 }}>
            Please verify your email — check your inbox for the verification link.
          </div>
        )}

        <h2 style={{ fontSize: 18, margin: "24px 0 12px" }}>My bookings</h2>
        {bookings === null ? (
          <p className="auth-muted">Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <p className="auth-muted">No bookings yet. <Link href="/book">Book a service →</Link></p>
        ) : (
          <ul className="auth-list">
            {bookings.map((b) => (
              <li className="auth-item" key={b.reference}>
                <div>
                  <strong>{b.service?.name ?? "Service"}</strong>
                  <div className="auth-muted">{b.reference} · {new Date(b.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="auth-badge">{b.status}</span>
                  <div className="auth-muted">{money(b.priceTotal)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

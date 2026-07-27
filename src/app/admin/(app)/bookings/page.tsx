"use client";

import { useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";

interface Booking {
  reference: string;
  status: string;
  service: { slug: string; name: string } | null;
  priceTotal: number | null;
  currency: string;
  scheduledAt: string | null;
  createdAt: string;
  customer: { id: string; name: string; email: string } | null;
  contactEmail: string;
  quoteRequest: boolean;
}

const STATUSES = ["", "PENDING", "AWAITING_PAYMENT", "PAID", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const TRANSITIONS = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const money = (c: number | null) => (c == null ? "—" : `$${(c / 100).toFixed(2)}`);
const badge = (s: string) =>
  s === "CANCELLED" ? "danger" : s === "COMPLETED" || s === "PAID" ? "ok" : s === "PENDING" || s === "AWAITING_PAYMENT" ? "warn" : "muted";

export default function BookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    try {
      const { data, meta } = await apiWithMeta<Booking[]>(`/admin/bookings?${params}`);
      setRows(data);
      setMeta(meta ?? null);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load bookings");
    }
  }, [page, status, search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function transition(reference: string, next: string) {
    setErr(null);
    try {
      await api(`/admin/bookings/${reference}`, { method: "PATCH", body: { status: next } });
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      <div className="ax-row" style={{ marginBottom: 12 }}>
        <select className="ax-select" style={{ maxWidth: 200 }} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || "All statuses"}</option>
          ))}
        </select>
        <input className="ax-input" style={{ maxWidth: 240 }} placeholder="Search reference or email…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
      </div>

      <table className="ax-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Service</th>
            <th>Customer</th>
            <th>Price</th>
            <th>Status</th>
            <th>Set status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.reference}>
              <td>
                {b.reference}
                {b.quoteRequest && <span className="ax-badge muted" style={{ marginLeft: 6 }}>QUOTE</span>}
              </td>
              <td>{b.service?.name ?? "—"}</td>
              <td className="ax-muted">{b.customer?.email ?? b.contactEmail}</td>
              <td>{b.quoteRequest ? "—" : money(b.priceTotal)}</td>
              <td><span className={`ax-badge ${badge(b.status)}`}>{b.status}</span></td>
              <td>
                <select className="ax-select" style={{ maxWidth: 150 }} value={b.status} onChange={(e) => void transition(b.reference, e.target.value)}>
                  <option value={b.status} disabled>{b.status}</option>
                  {TRANSITIONS.filter((t) => t !== b.status).map((t) => (
                    <option key={t} value={t}>→ {t}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={6} className="ax-muted">No bookings found.</td></tr>}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />
    </>
  );
}

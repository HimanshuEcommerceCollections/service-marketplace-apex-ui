"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";
import { ConfirmModal, Modal, type ConfirmRequest } from "../../components/modal";

interface Booking {
  reference: string;
  /** Fulfilment lifecycle. */
  status: string;
  /** Money axis — read-only here; it moves through the payment flows. */
  paymentStatus: string;
  service: { slug: string; name: string } | null;
  priceTotal: number | null;
  currency: string;
  scheduledAt: string | null;
  createdAt: string;
  customer: { id: string; name: string; email: string } | null;
  contactEmail: string;
  quoteRequest: boolean;
}

const STATUSES = ["", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const PAYMENT_STATUSES = ["", "UNPAID", "AWAITING_PAYMENT", "PAID", "PARTIALLY_REFUNDED", "REFUNDED"];
const TRANSITIONS = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const money = (c: number | null) => (c == null ? "—" : `$${(c / 100).toFixed(2)}`);
const badge = (s: string) =>
  s === "CANCELLED" ? "danger" : s === "COMPLETED" ? "ok" : s === "PENDING" ? "warn" : "muted";
const payBadge = (s: string) =>
  s === "PAID" ? "ok" : s === "AWAITING_PAYMENT" ? "warn" : s === "REFUNDED" || s === "PARTIALLY_REFUNDED" ? "danger" : "muted";
const payLabel = (s: string) => (s ? s.replace(/_/g, " ") : "—");
const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—");

export default function BookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [status, setStatus] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  /** Reference of the booking open in the detail modal (row data stays fresh across reloads). */
  const [detailRef, setDetailRef] = useState<string | null>(null);
  // Incremented per load; a slower earlier request bails on resolve so it can't
  // overwrite the results of a newer one (per-keystroke search race).
  const loadRef = useRef(0);

  const load = useCallback(async () => {
    const epoch = ++loadRef.current;
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    if (payStatus) params.set("paymentStatus", payStatus);
    if (search.trim()) params.set("search", search.trim());
    try {
      const { data, meta } = await apiWithMeta<Booking[]>(`/admin/bookings?${params}`);
      if (loadRef.current !== epoch) return;
      setErr(null);
      setRows(data);
      setMeta(meta ?? null);
    } catch (e) {
      if (loadRef.current !== epoch) return;
      setErr(e instanceof ApiError ? e.message : "Failed to load bookings");
    }
  }, [page, status, payStatus, search]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Asks before writing; the ConfirmModal owns the busy/error state. */
  function askTransition(b: Booking, next: string) {
    setConfirm({
      title: "Change booking status",
      body: (
        <>
          Change <b>{b.reference}</b> ({b.service?.name ?? "no service"}, {b.customer?.email ?? b.contactEmail}) from{" "}
          <b>{b.status}</b> to <b>{next}</b>?
          {next === "CANCELLED" && <> The customer sees this booking as cancelled.</>}
          {next === "CANCELLED" && b.paymentStatus === "PAID" && (
            <> <b>This booking is PAID</b> — cancelling does not refund the money; issue the refund separately.</>
          )}
        </>
      ),
      confirmLabel: `Set ${next}`,
      danger: next === "CANCELLED",
      action: async () => {
        await api(`/admin/bookings/${b.reference}`, { method: "PATCH", body: { status: next } });
        await load();
      },
    });
  }

  const detail = detailRef ? rows.find((b) => b.reference === detailRef) ?? null : null;

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      <div className="ax-row" style={{ marginBottom: 12 }}>
        <select className="ax-select" style={{ maxWidth: 180 }} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || "All statuses"}</option>
          ))}
        </select>
        <select className="ax-select" style={{ maxWidth: 200 }} value={payStatus} onChange={(e) => { setPage(1); setPayStatus(e.target.value); }}>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s ? payLabel(s) : "All payment states"}</option>
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
            <th>Payment</th>
            <th>Status</th>
            <th>Set status</th>
            <th />
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
              <td><span className={`ax-badge ${payBadge(b.paymentStatus)}`}>{payLabel(b.paymentStatus)}</span></td>
              <td><span className={`ax-badge ${badge(b.status)}`}>{b.status}</span></td>
              <td>
                <select className="ax-select" style={{ maxWidth: 150 }} value={b.status} onChange={(e) => askTransition(b, e.target.value)}>
                  <option value={b.status} disabled>{b.status}</option>
                  {TRANSITIONS.filter((t) => t !== b.status).map((t) => (
                    <option key={t} value={t}>→ {t}</option>
                  ))}
                </select>
              </td>
              <td>
                <button className="ax-btn ghost sm" onClick={() => setDetailRef(b.reference)}>Details</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={8} className="ax-muted">No bookings found.</td></tr>}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />

      {detail && (
        <Modal title={`Booking ${detail.reference}`} onClose={() => setDetailRef(null)}>
          <dl className="ax-kv">
            <dt>Status</dt>
            <dd><span className={`ax-badge ${badge(detail.status)}`}>{detail.status}</span></dd>
            <dt>Payment</dt>
            <dd>
              <span className={`ax-badge ${payBadge(detail.paymentStatus)}`}>{payLabel(detail.paymentStatus)}</span>{" "}
              <span className="ax-muted" style={{ fontSize: 12 }}>moves via payment/refund flows, not by hand</span>
            </dd>
            <dt>Type</dt>
            <dd>{detail.quoteRequest ? "Quote request — priced by a coordinator" : "Standard booking"}</dd>
            <dt>Service</dt>
            <dd>{detail.service ? `${detail.service.name} (${detail.service.slug})` : "—"}</dd>
            <dt>Customer</dt>
            <dd>
              {detail.customer ? (
                <>
                  {detail.customer.name}
                  <br />
                  <span className="ax-muted">{detail.customer.email}</span>
                </>
              ) : (
                <>Guest — <span className="ax-muted">{detail.contactEmail}</span></>
              )}
            </dd>
            <dt>Price</dt>
            <dd>{detail.quoteRequest ? "Set on the Quotes page" : `${money(detail.priceTotal)} ${detail.currency}`}</dd>
            <dt>Scheduled</dt>
            <dd>{when(detail.scheduledAt)}</dd>
            <dt>Created</dt>
            <dd>{when(detail.createdAt)}</dd>
          </dl>
          <div className="ax-row" style={{ marginTop: 18, gap: 8 }}>
            <span className="ax-muted" style={{ fontSize: 13 }}>Set status:</span>
            <select
              className="ax-select"
              style={{ maxWidth: 170 }}
              value={detail.status}
              onChange={(e) => askTransition(detail, e.target.value)}
            >
              <option value={detail.status} disabled>{detail.status}</option>
              {TRANSITIONS.filter((t) => t !== detail.status).map((t) => (
                <option key={t} value={t}>→ {t}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

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

/** One charge row from GET /admin/bookings/:reference — the refund surface. */
interface PaymentRow {
  id: string;
  amount: number;
  taxAmount: number;
  currency: string;
  status: string;
  refundedAmount: number;
  remaining: number;
  /** Server-computed: captured charge with something left to give back. */
  refundable: boolean;
  createdAt: string;
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
  /** Payments for the open booking (null = loading; keyed writes prevent stale fills). */
  const [payments, setPayments] = useState<PaymentRow[] | null>(null);
  /** Per-payment refund drafts, in dollars. */
  const [refunds, setRefunds] = useState<Record<string, string>>({});
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

  /** Fetch the money trail for the open booking; drafts default to the full remaining. */
  const loadPayments = useCallback(async (reference: string) => {
    try {
      const d = await api<{ payments: PaymentRow[] }>(`/admin/bookings/${reference}`);
      setPayments(d.payments);
      setRefunds((prev) =>
        Object.fromEntries(
          d.payments.map((p) => [p.id, p.id in prev ? prev[p.id] : (p.remaining / 100).toFixed(2)]),
        ),
      );
    } catch (e) {
      setPayments([]);
      setErr(e instanceof ApiError ? e.message : "Failed to load the booking's payments");
    }
  }, []);

  function openDetail(reference: string) {
    setErr(null);
    setPayments(null);
    setRefunds({});
    setDetailRef(reference);
    void loadPayments(reference);
  }

  function askRefund(b: Booking, p: PaymentRow) {
    const dollars = Number(refunds[p.id]);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setErr("Enter a positive refund amount.");
      return;
    }
    const cents = Math.round(dollars * 100);
    if (cents > p.remaining) {
      setErr(`At most $${(p.remaining / 100).toFixed(2)} is left to refund on this payment.`);
      return;
    }
    setErr(null);
    const full = cents === p.remaining;
    setConfirm({
      title: `Refund ${b.reference}`,
      danger: true,
      confirmLabel: `Refund $${dollars.toFixed(2)}`,
      body: (
        <>
          Refund <b>${dollars.toFixed(2)}</b> of the ${(p.amount / 100).toFixed(2)} charge to{" "}
          <b>{b.customer?.email ?? b.contactEmail}</b>?{" "}
          {full
            ? "This refunds everything that's left — the payment becomes REFUNDED."
            : `$${((p.remaining - cents) / 100).toFixed(2)} stays refundable afterwards.`}{" "}
          Money moves back to their card and can&apos;t be un-refunded. The booking&apos;s status is untouched —
          cancel it separately if the job is off.
        </>
      ),
      action: async () => {
        await api(`/admin/payments/${p.id}/refund`, { method: "POST", body: { amount: cents } });
        setRefunds((r) => ({ ...r, [p.id]: "" }));
        await Promise.all([load(), loadPayments(b.reference)]);
      },
    });
  }

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
                <button className="ax-btn ghost sm" onClick={() => openDetail(b.reference)}>Details</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={8} className="ax-muted">No bookings found.</td></tr>}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />

      {detail && (
        <Modal title={`Booking ${detail.reference}`} onClose={() => setDetailRef(null)} width={640}>
          {/* The page-level alert sits behind the overlay — mirror it here so
              refund-validation feedback stays visible. */}
          {err && <div className="ax-alert err">{err}</div>}
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
          <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>Payments</div>
          {payments === null ? (
            <p className="ax-muted" style={{ margin: 0 }}>Loading payments…</p>
          ) : payments.length === 0 ? (
            <p className="ax-muted" style={{ margin: 0 }}>No payments recorded for this booking.</p>
          ) : (
            <table className="ax-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Charged</th>
                  <th>Refunded</th>
                  <th>Status</th>
                  <th>Refund</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="ax-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>{money(p.amount)}</td>
                    <td>{p.refundedAmount > 0 ? money(p.refundedAmount) : <span className="ax-muted">—</span>}</td>
                    <td><span className={`ax-badge ${payBadge(p.status === "SUCCEEDED" ? "PAID" : p.status)}`}>{payLabel(p.status)}</span></td>
                    <td>
                      {p.refundable ? (
                        <div className="ax-row" style={{ gap: 6 }}>
                          <span className="ax-muted">$</span>
                          <input
                            className="ax-input"
                            style={{ width: 90 }}
                            value={refunds[p.id] ?? ""}
                            onChange={(e) => setRefunds((r) => ({ ...r, [p.id]: e.target.value }))}
                            placeholder={(p.remaining / 100).toFixed(2)}
                          />
                          <button className="ax-btn danger sm" onClick={() => askRefund(detail, p)}>
                            Refund
                          </button>
                        </div>
                      ) : (
                        <span className="ax-muted">{p.remaining === 0 && p.refundedAmount > 0 ? "fully refunded" : "—"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {payments !== null && payments.some((p) => p.refundable) && (
            <p className="ax-muted" style={{ fontSize: 12, margin: "6px 0 0" }}>
              Refund any amount up to what remains — partial amounts are fine and can be repeated.
              Refunding never changes the booking&apos;s status.
            </p>
          )}

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

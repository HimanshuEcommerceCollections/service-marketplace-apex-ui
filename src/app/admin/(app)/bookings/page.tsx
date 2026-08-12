"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";
import { ConfirmModal, Lightbox, Modal, thumbUrl, type ConfirmRequest } from "../../components/modal";
import { Skel, TableSkeleton } from "../../components/skeleton";

interface Booking {
  reference: string;
  /** Fulfilment lifecycle. */
  status: string;
  /** Money axis — read-only here; it moves through the payment flows. */
  paymentStatus: string;
  service: { slug: string; name: string } | null;
  priceTotal: number | null;
  /** Coordinator's binding amount for QUOTE bookings (pre-tax), once set. */
  quotedAmount: number | null;
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

/** The detail-only extras from GET /admin/bookings/:reference. */
interface BookingExtra {
  payments: PaymentRow[];
  /** The pricing attachment for QUOTE bookings (null for FROM). */
  quote: { id: string; status: string; quotedAmount: number | null; description: string } | null;
  /** Customer-uploaded job photos — what the coordinator prices from. */
  photos: { id: string; url: string }[];
  /** Engine total for the customer's configuration — indicative for quotes, never binding. */
  configuration: { priceTotal: number | null } | null;
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
  // null = first load in flight (skeleton); [] = genuinely empty.
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [status, setStatus] = useState("");
  const [payStatus, setPayStatus] = useState("");
  /** The pricing work queue: quote bookings with no coordinator price yet. */
  const [needsPricing, setNeedsPricing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  /** Reference of the booking open in the detail modal (row data stays fresh across reloads). */
  const [detailRef, setDetailRef] = useState<string | null>(null);
  /** Detail extras (payments, quote, photos) for the open booking; null = loading. */
  const [extra, setExtra] = useState<BookingExtra | null>(null);
  /** Per-payment refund drafts, in dollars. */
  const [refunds, setRefunds] = useState<Record<string, string>>({});
  /** Quote-price draft, in dollars. */
  const [quotePrice, setQuotePrice] = useState("");
  /** Index into the open booking's photos, when the lightbox is up. */
  const [photoIdx, setPhotoIdx] = useState<number | null>(null);
  // Incremented per load; a slower earlier request bails on resolve so it can't
  // overwrite the results of a newer one (per-keystroke search race).
  const loadRef = useRef(0);

  const load = useCallback(async () => {
    const epoch = ++loadRef.current;
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    if (payStatus) params.set("paymentStatus", payStatus);
    if (needsPricing) params.set("needsPricing", "true");
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
  }, [page, status, payStatus, needsPricing, search]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Fetch the detail extras; refund drafts default to each charge's full remaining. */
  const loadExtra = useCallback(async (reference: string) => {
    try {
      const d = await api<BookingExtra>(`/admin/bookings/${reference}`);
      setExtra(d);
      setRefunds((prev) =>
        Object.fromEntries(
          d.payments.map((p) => [p.id, p.id in prev ? prev[p.id] : (p.remaining / 100).toFixed(2)]),
        ),
      );
      setQuotePrice((prev) =>
        prev !== "" ? prev : d.quote?.quotedAmount != null ? (d.quote.quotedAmount / 100).toFixed(2) : "",
      );
    } catch (e) {
      setExtra({ payments: [], quote: null, photos: [], configuration: null });
      setErr(e instanceof ApiError ? e.message : "Failed to load the booking's details");
    }
  }, []);

  function openDetail(reference: string) {
    setErr(null);
    setExtra(null);
    setRefunds({});
    setQuotePrice("");
    setPhotoIdx(null);
    setDetailRef(reference);
    void loadExtra(reference);
  }

  /** Set the coordinator's binding price — the same audited write the old Quotes screen performed. */
  function askSetPrice(b: Booking, quoteId: string, current: number | null) {
    const dollars = Number(quotePrice);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setErr("Enter a positive amount.");
      return;
    }
    setErr(null);
    setConfirm({
      title: `Set quote price — ${b.reference}`,
      body: (
        <>
          Set the quote for <b>{b.customer?.email ?? b.contactEmail}</b> ({b.service?.name ?? "no service"}) to{" "}
          <b>${dollars.toFixed(2)}</b>?
          {current != null && <> Currently <b>${(current / 100).toFixed(2)}</b>.</>}{" "}
          The customer is emailed their quote and can pay exactly this amount.
        </>
      ),
      confirmLabel: `Set $${dollars.toFixed(2)}`,
      action: async () => {
        await api(`/admin/quotes/${quoteId}`, { method: "PATCH", body: { quotedAmount: Math.round(dollars * 100) } });
        await Promise.all([load(), loadExtra(b.reference)]);
      },
    });
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
        await Promise.all([load(), loadExtra(b.reference)]);
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

  const detail = detailRef ? (rows ?? []).find((b) => b.reference === detailRef) ?? null : null;

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
        <label className="ax-row" style={{ gap: 6, fontSize: 13 }}>
          <input
            type="checkbox"
            checked={needsPricing}
            onChange={(e) => { setPage(1); setNeedsPricing(e.target.checked); }}
          />
          Needs pricing
        </label>
      </div>

      <div className="ax-table-wrap">
      <table className="ax-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th className="ax-hide-md">Service</th>
            <th>Customer</th>
            <th>Price</th>
            <th>Payment</th>
            <th>Status</th>
            <th className="ax-hide-md">Set status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows === null && !err && <TableSkeleton cols={8} />}
          {(rows ?? []).map((b) => (
            <tr key={b.reference}>
              <td>
                {b.reference}
                {b.quoteRequest && <span className="ax-badge muted" style={{ marginLeft: 6 }}>QUOTE</span>}
              </td>
              <td className="ax-hide-md">{b.service?.name ?? "—"}</td>
              <td className="ax-muted">{b.customer?.email ?? b.contactEmail}</td>
              <td>
                {b.quoteRequest ? (
                  b.quotedAmount != null ? (
                    money(b.quotedAmount)
                  ) : (
                    <span className="ax-badge warn">not priced</span>
                  )
                ) : (
                  money(b.priceTotal)
                )}
              </td>
              <td><span className={`ax-badge ${payBadge(b.paymentStatus)}`}>{payLabel(b.paymentStatus)}</span></td>
              <td><span className={`ax-badge ${badge(b.status)}`}>{b.status}</span></td>
              <td className="ax-hide-md">
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
          {rows !== null && rows.length === 0 && <tr><td colSpan={8} className="ax-muted">No bookings found.</td></tr>}
        </tbody>
      </table>
      </div>

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
            <dd>
              {detail.quoteRequest
                ? detail.quotedAmount != null
                  ? `${money(detail.quotedAmount)} ${detail.currency} (coordinator quote)`
                  : "Not priced yet — set it in the Quote section below"
                : `${money(detail.priceTotal)} ${detail.currency}`}
            </dd>
            <dt>Scheduled</dt>
            <dd>{when(detail.scheduledAt)}</dd>
            <dt>Created</dt>
            <dd>{when(detail.createdAt)}</dd>
          </dl>
          {/* ── Quote pricing (QUOTE bookings) — absorbed from the old Quotes screen ── */}
          {detail.quoteRequest && (
            <>
              <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>
                Quote
                {extra?.quote && (
                  <span className={`ax-badge ${extra.quote.status === "WON" ? "ok" : extra.quote.status === "LOST" ? "danger" : "muted"}`} style={{ marginLeft: 8 }}>
                    {extra.quote.status}
                  </span>
                )}
              </div>
              {extra === null ? (
                <div aria-label="Loading quote">
                  <Skel w="90%" />
                  <Skel w="60%" style={{ marginTop: 6 }} />
                  <Skel w={220} h={34} style={{ marginTop: 12, borderRadius: 8 }} />
                </div>
              ) : !extra.quote ? (
                <p className="ax-muted" style={{ margin: 0 }}>No quote attached to this booking.</p>
              ) : (
                <>
                  <p style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
                    {extra.quote.description || <span className="ax-muted">No description provided.</span>}
                  </p>

                  {extra.photos.length > 0 && (
                    <div className="ax-row" style={{ gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                      {extra.photos.map((p, i) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPhotoIdx(i)}
                          style={{ border: "none", background: "none", padding: 0, cursor: "zoom-in" }}
                          aria-label={`View photo ${i + 1} full size`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="ax-thumb" src={thumbUrl(p.url, 144)} alt={`Customer photo ${i + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="ax-row" style={{ gap: 6, marginTop: 12 }}>
                    <span className="ax-muted">$</span>
                    <input
                      className="ax-input"
                      style={{ width: 110 }}
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      placeholder="0.00"
                    />
                    <button className="ax-btn sm" onClick={() => askSetPrice(detail, extra.quote!.id, extra.quote!.quotedAmount)}>
                      Set price
                    </button>
                    {extra.configuration?.priceTotal != null && (
                      <button
                        type="button"
                        className="ax-btn ghost sm"
                        title="Copy the customer's configured total into the price field"
                        onClick={() => setQuotePrice((extra.configuration!.priceTotal! / 100).toFixed(2))}
                      >
                        Use indicative (~${(extra.configuration.priceTotal / 100).toFixed(2)})
                      </button>
                    )}
                  </div>
                  <p className="ax-muted" style={{ fontSize: 12, margin: "6px 0 0" }}>
                    Setting the price emails the customer their quote and lets them pay exactly this amount.
                    WON/LOST track automatically from payment, confirmation and cancellation.
                  </p>
                </>
              )}
            </>
          )}

          <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>Payments</div>
          {extra === null ? (
            <div aria-label="Loading payments">
              <Skel w="100%" h={38} style={{ borderRadius: 8 }} />
              <Skel w="100%" h={38} style={{ marginTop: 6, borderRadius: 8 }} />
            </div>
          ) : extra.payments.length === 0 ? (
            <p className="ax-muted" style={{ margin: 0 }}>No payments recorded for this booking.</p>
          ) : (
            <div className="ax-table-wrap">
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
                {extra.payments.map((p) => (
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
            </div>
          )}
          {extra !== null && extra.payments.some((p) => p.refundable) && (
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

      {detail && extra && photoIdx != null && (
        <Lightbox photos={extra.photos} index={photoIdx} onClose={() => setPhotoIdx(null)} onNavigate={setPhotoIdx} />
      )}

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

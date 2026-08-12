"use client";

import { useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";
import { ConfirmModal, Lightbox, Modal, thumbUrl, type ConfirmRequest } from "../../components/modal";

interface Quote {
  id: string;
  status: string;
  source: string;
  description: string;
  contactName: string;
  contactEmail: string;
  quotedAmount: number | null;
  /** Engine total for the customer's configuration (cents) — indicative, never binding. */
  indicativeAmount: number | null;
  currency: string;
  booking: { reference: string } | null;
  service: { slug: string; name: string } | null;
  /** Customer-uploaded job photos — what the coordinator prices from. */
  photos: { id: string; url: string }[];
  createdAt: string;
}

const STATUSES = ["NEW", "REVIEWING", "SENT", "WON", "LOST"];
const badge = (s: string) => (s === "LOST" ? "danger" : s === "WON" ? "ok" : s === "NEW" ? "warn" : "muted");

export default function QuotesPage() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  /** Id of the quote open in the detail modal (row data stays fresh across reloads). */
  const [detailId, setDetailId] = useState<string | null>(null);
  /** Index into the open quote's photos, when the lightbox is up. */
  const [photoIdx, setPhotoIdx] = useState<number | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    try {
      const { data, meta } = await apiWithMeta<Quote[]>(`/admin/quotes?${params}`);
      setErr(null);
      setRows(data);
      setMeta(meta ?? null);
      // Rebuild the price-input drafts from fresh rows, but keep any value the
      // user has already typed for a row that's still present — a reload from
      // one row's save must not wipe unsaved edits in other rows.
      setAmounts((prev) =>
        Object.fromEntries(
          data.map((q) => [
            q.id,
            q.id in prev ? prev[q.id] : q.quotedAmount != null ? (q.quotedAmount / 100).toFixed(2) : "",
          ]),
        ),
      );
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load quotes");
    }
  }, [page, status]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Throws on failure — the ConfirmModal shows the error and stays open. */
  async function patch(id: string, body: Record<string, unknown>, msg: string) {
    await api(`/admin/quotes/${id}`, { method: "PATCH", body });
    setNotice(msg);
    await load();
  }

  function askPrice(q: Quote) {
    const dollars = Number(amounts[q.id]);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setErr("Enter a positive amount.");
      return;
    }
    setErr(null);
    setConfirm({
      title: "Set quote price",
      body: (
        <>
          Set the quote for <b>{q.contactEmail}</b> ({q.service?.name ?? "no service"}) to{" "}
          <b>${dollars.toFixed(2)}</b>?
          {q.quotedAmount != null && (
            <> Currently <b>${(q.quotedAmount / 100).toFixed(2)}</b>.</>
          )}{" "}
          This is the amount the customer can pay.
        </>
      ),
      confirmLabel: `Set $${dollars.toFixed(2)}`,
      action: () => patch(q.id, { quotedAmount: Math.round(dollars * 100) }, "Quote price set."),
    });
  }

  function askStatus(q: Quote, next: string) {
    setConfirm({
      title: "Change quote status",
      body: (
        <>
          Change the quote for <b>{q.contactEmail}</b> ({q.service?.name ?? "no service"}) from <b>{q.status}</b> to{" "}
          <b>{next}</b>?
        </>
      ),
      confirmLabel: `Set ${next}`,
      danger: next === "LOST",
      action: () => patch(q.id, { status: next }, "Status updated."),
    });
  }

  const detail = detailId ? rows.find((q) => q.id === detailId) ?? null : null;

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {notice && <div className="ax-alert ok">{notice}</div>}

      <div className="ax-row" style={{ marginBottom: 12 }}>
        <select className="ax-select" style={{ maxWidth: 200 }} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <table className="ax-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Contact</th>
            <th>Received</th>
            <th>Photos</th>
            <th>Quoted</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((q) => (
            <tr key={q.id}>
              <td>{q.service?.name ?? "—"}</td>
              <td className="ax-muted">{q.contactEmail}</td>
              <td className="ax-muted">{new Date(q.createdAt).toLocaleDateString()}</td>
              <td className="ax-muted">{q.photos.length === 0 ? "—" : `${q.photos.length} photo${q.photos.length > 1 ? "s" : ""}`}</td>
              <td>{q.quotedAmount != null ? `$${(q.quotedAmount / 100).toFixed(2)}` : <span className="ax-muted">not set</span>}</td>
              <td>
                <div className="ax-row" style={{ gap: 6 }}>
                  <span className={`ax-badge ${badge(q.status)}`}>{q.status}</span>
                  <select className="ax-select" style={{ maxWidth: 120 }} value={q.status} onChange={(e) => askStatus(q, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                <button className="ax-btn ghost sm" onClick={() => { setErr(null); setNotice(null); setPhotoIdx(null); setDetailId(q.id); }}>Details</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={7} className="ax-muted">No quote requests found.</td></tr>}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />

      {detail && (
        <Modal title={`Quote — ${detail.service?.name ?? "no service"}`} onClose={() => setDetailId(null)} width={640}>
          {/* The page-level alerts sit behind the overlay — mirror them here so
              feedback for in-modal actions (price validation, saves) stays visible. */}
          {err && <div className="ax-alert err">{err}</div>}
          {notice && <div className="ax-alert ok">{notice}</div>}
          <dl className="ax-kv">
            <dt>Status</dt>
            <dd><span className={`ax-badge ${badge(detail.status)}`}>{detail.status}</span></dd>
            <dt>Contact</dt>
            <dd>
              {detail.contactName}
              <br />
              <span className="ax-muted">{detail.contactEmail}</span>
            </dd>
            <dt>Booking</dt>
            <dd>{detail.booking?.reference ?? <span className="ax-muted">{detail.source}</span>}</dd>
            <dt>Received</dt>
            <dd>{new Date(detail.createdAt).toLocaleString()}</dd>
            <dt>Indicative</dt>
            <dd>
              {detail.indicativeAmount != null ? (
                <>~${(detail.indicativeAmount / 100).toFixed(2)} <span className="ax-muted">— engine total for the customer&apos;s configuration, never binding</span></>
              ) : (
                "—"
              )}
            </dd>
          </dl>

          <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>Description</div>
          <p style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
            {detail.description || <span className="ax-muted">No description provided.</span>}
          </p>

          <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>
            Photos {detail.photos.length > 0 && <span className="ax-muted">({detail.photos.length})</span>}
          </div>
          {detail.photos.length === 0 ? (
            <p className="ax-muted" style={{ margin: 0 }}>No photos uploaded.</p>
          ) : (
            <div className="ax-row" style={{ gap: 8, flexWrap: "wrap" }}>
              {detail.photos.map((p, i) => (
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

          <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>Quoted price</div>
          <div className="ax-row" style={{ gap: 6 }}>
            <span className="ax-muted">$</span>
            <input
              className="ax-input"
              style={{ width: 110 }}
              value={amounts[detail.id] ?? ""}
              onChange={(e) => setAmounts((a) => ({ ...a, [detail.id]: e.target.value }))}
              placeholder="0.00"
            />
            <button className="ax-btn sm" onClick={() => askPrice(detail)}>Set price</button>
            {detail.indicativeAmount != null && (
              <button
                type="button"
                className="ax-btn ghost sm"
                title="Copy the configured-total into the quoted price"
                onClick={() => setAmounts((a) => ({ ...a, [detail.id]: (detail.indicativeAmount! / 100).toFixed(2) }))}
              >
                Use indicative (~${(detail.indicativeAmount / 100).toFixed(2)})
              </button>
            )}
          </div>

          <div className="ax-row" style={{ marginTop: 16, gap: 8 }}>
            <span className="ax-muted" style={{ fontSize: 13 }}>Status:</span>
            <select className="ax-select" style={{ maxWidth: 150 }} value={detail.status} onChange={(e) => askStatus(detail, e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}

      {detail && photoIdx != null && (
        <Lightbox
          photos={detail.photos}
          index={photoIdx}
          onClose={() => setPhotoIdx(null)}
          onNavigate={setPhotoIdx}
        />
      )}

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

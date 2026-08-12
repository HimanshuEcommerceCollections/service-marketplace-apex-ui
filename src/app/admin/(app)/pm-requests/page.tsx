"use client";

// Coordinator screening queue for property-manager enquiries submitted from
// /property-managers. Each row is a PMRequest joined with its parent
// QuoteRequest, which is where the triage state (status, quoted price) lives —
// so a price set here is the same audited write the Quotes screen performs.
//
// The public form collects a property address, a preferred timeline and a unit
// RANGE, none of which have columns on PMRequest; the form appends them to the
// scope notes, which is why the detail modal renders those notes verbatim.

import { useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";
import { ConfirmModal, Modal, type ConfirmRequest } from "../../components/modal";

interface PmRequest {
  id: string;
  quoteRequestId: string;
  company: string | null;
  unitsEst: number;
  bundle: "TURNOVER" | "LISTING_PREP";
  scopeNotes: string;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  quotedAmount: number | null;
  quotedAt: string | null;
  currency: string;
  createdAt: string;
}

const STATUSES = ["NEW", "REVIEWING", "SENT", "WON", "LOST"];
const BUNDLES = [
  { value: "TURNOVER", label: "Turnover" },
  { value: "LISTING_PREP", label: "Listing prep" },
];
const badge = (s: string) =>
  s === "LOST" ? "danger" : s === "WON" ? "ok" : s === "NEW" ? "warn" : "muted";
const bundleLabel = (b: string) => BUNDLES.find((x) => x.value === b)?.label ?? b;
const when = (iso: string) => new Date(iso).toLocaleDateString();

export default function PmRequestsPage() {
  const [rows, setRows] = useState<PmRequest[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [status, setStatus] = useState("");
  const [bundle, setBundle] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  /** Id of the request open in the detail modal (row data stays fresh across reloads). */
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    if (bundle) params.set("bundle", bundle);
    if (query) params.set("search", query);
    try {
      const { data, meta } = await apiWithMeta<PmRequest[]>(`/admin/pm-requests?${params}`);
      setErr(null);
      setRows(data);
      setMeta(meta ?? null);
      // Keep any price the user has already typed for a still-present row so a
      // reload triggered by one row's save doesn't wipe unsaved edits elsewhere.
      setAmounts((prev) =>
        Object.fromEntries(
          data.map((r) => [
            r.id,
            r.id in prev ? prev[r.id] : r.quotedAmount != null ? (r.quotedAmount / 100).toFixed(2) : "",
          ]),
        ),
      );
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load property manager requests");
    }
  }, [page, status, bundle, query]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Throws on failure — the ConfirmModal shows the error and stays open. */
  async function patch(id: string, body: Record<string, unknown>, msg: string) {
    await api(`/admin/pm-requests/${id}`, { method: "PATCH", body });
    setNotice(msg);
    await load();
  }

  function askPrice(r: PmRequest) {
    const dollars = Number(amounts[r.id]);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setErr("Enter a positive amount.");
      return;
    }
    setErr(null);
    setConfirm({
      title: "Set quote price",
      body: (
        <>
          Set the quote for <b>{r.company ?? r.contactName}</b> ({r.contactEmail}) to <b>${dollars.toFixed(2)}</b>?
          {r.quotedAmount != null && (
            <> Currently <b>${(r.quotedAmount / 100).toFixed(2)}</b>.</>
          )}{" "}
          This is the same audited write the Quotes screen performs.
        </>
      ),
      confirmLabel: `Set $${dollars.toFixed(2)}`,
      action: () => patch(r.id, { quotedAmount: Math.round(dollars * 100) }, "Quote price set."),
    });
  }

  function askStatus(r: PmRequest, next: string) {
    setConfirm({
      title: "Change request status",
      body: (
        <>
          Change the request from <b>{r.company ?? r.contactName}</b> ({r.contactEmail}) from <b>{r.status}</b> to{" "}
          <b>{next}</b>?
        </>
      ),
      confirmLabel: `Set ${next}`,
      danger: next === "LOST",
      action: () => patch(r.id, { status: next }, "Status updated."),
    });
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  const detail = detailId ? rows.find((r) => r.id === detailId) ?? null : null;

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {notice && <div className="ax-alert ok">{notice}</div>}

      <form className="ax-row" style={{ marginBottom: 12, gap: 8 }} onSubmit={applySearch}>
        <select
          className="ax-select"
          style={{ maxWidth: 180 }}
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="ax-select"
          style={{ maxWidth: 180 }}
          value={bundle}
          onChange={(e) => {
            setPage(1);
            setBundle(e.target.value);
          }}
        >
          <option value="">All bundles</option>
          {BUNDLES.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        <input
          className="ax-input"
          style={{ maxWidth: 240 }}
          placeholder="Search company, name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="ax-btn ghost sm" type="submit">
          Search
        </button>
        {(status || bundle || query) && (
          <button
            className="ax-btn ghost sm"
            type="button"
            onClick={() => {
              setStatus("");
              setBundle("");
              setSearch("");
              setQuery("");
              setPage(1);
            }}
          >
            Clear
          </button>
        )}
      </form>

      <table className="ax-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Units</th>
            <th>Bundle</th>
            <th>Received</th>
            <th>Quoted</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <b>{r.company ?? "—"}</b>
              </td>
              <td className="ax-muted">{r.contactEmail}</td>
              <td>{r.unitsEst}+</td>
              <td>
                <span className="ax-badge muted">{bundleLabel(r.bundle)}</span>
              </td>
              <td className="ax-muted">{when(r.createdAt)}</td>
              <td>{r.quotedAmount != null ? `$${(r.quotedAmount / 100).toFixed(2)}` : <span className="ax-muted">not set</span>}</td>
              <td>
                <div className="ax-row" style={{ gap: 6 }}>
                  <span className={`ax-badge ${badge(r.status)}`}>{r.status}</span>
                  <select
                    className="ax-select"
                    style={{ maxWidth: 120 }}
                    value={r.status}
                    onChange={(e) => askStatus(r, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                <button className="ax-btn ghost sm" onClick={() => { setErr(null); setNotice(null); setDetailId(r.id); }}>
                  Details
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="ax-muted">
                No property manager requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />

      {detail && (
        <Modal
          title={detail.company ?? detail.contactName}
          onClose={() => setDetailId(null)}
          width={640}
        >
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
              {detail.contactPhone && (
                <>
                  <br />
                  <span className="ax-muted">{detail.contactPhone}</span>
                </>
              )}
            </dd>
            <dt>Units</dt>
            <dd>{detail.unitsEst}+</dd>
            <dt>Bundle</dt>
            <dd><span className="ax-badge muted">{bundleLabel(detail.bundle)}</span></dd>
            <dt>Received</dt>
            <dd>{new Date(detail.createdAt).toLocaleString()}</dd>
            <dt>Quote request</dt>
            <dd>{detail.quoteRequestId.slice(0, 8).toUpperCase()}</dd>
            {detail.quotedAt && (
              <>
                <dt>Priced</dt>
                <dd>{new Date(detail.quotedAt).toLocaleString()}</dd>
              </>
            )}
          </dl>

          <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>Scope &amp; property details</div>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              fontSize: 13,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {detail.scopeNotes}
          </pre>

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
            <button className="ax-btn sm" onClick={() => askPrice(detail)}>
              Set price
            </button>
          </div>

          <div className="ax-row" style={{ marginTop: 16, gap: 8 }}>
            <span className="ax-muted" style={{ fontSize: 13 }}>Status:</span>
            <select
              className="ax-select"
              style={{ maxWidth: 150 }}
              value={detail.status}
              onChange={(e) => askStatus(detail, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      )}

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

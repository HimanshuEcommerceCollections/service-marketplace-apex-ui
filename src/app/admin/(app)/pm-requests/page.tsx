"use client";

// Coordinator screening queue for property-manager enquiries submitted from
// /property-managers. Each row is a PMRequest joined with its parent
// QuoteRequest, which is where the triage state (status, quoted price) lives —
// so a price set here is the same audited write the Quotes screen performs.
//
// The public form collects a property address, a preferred timeline and a unit
// RANGE, none of which have columns on PMRequest; the form appends them to the
// scope notes, which is why the expanded row renders those notes verbatim.

import { Fragment, useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";

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
  const [open, setOpen] = useState<string | null>(null);

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

  async function patch(id: string, body: Record<string, unknown>, msg: string) {
    setErr(null);
    setNotice(null);
    try {
      await api(`/admin/pm-requests/${id}`, { method: "PATCH", body });
      setNotice(msg);
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  function savePrice(id: string) {
    const dollars = Number(amounts[id]);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setErr("Enter a positive amount.");
      return;
    }
    void patch(id, { quotedAmount: Math.round(dollars * 100) }, "Quote price set.");
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

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
            <th>Quoted price</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <Fragment key={r.id}>
              <tr>
                <td>
                  <b>{r.company ?? "—"}</b>
                </td>
                <td className="ax-muted">
                  {r.contactName}
                  <br />
                  {r.contactEmail}
                </td>
                <td>{r.unitsEst}+</td>
                <td>
                  <span className="ax-badge muted">{bundleLabel(r.bundle)}</span>
                </td>
                <td className="ax-muted">{when(r.createdAt)}</td>
                <td>
                  <div className="ax-row" style={{ gap: 6 }}>
                    <span className="ax-muted">$</span>
                    <input
                      className="ax-input"
                      style={{ width: 90 }}
                      value={amounts[r.id] ?? ""}
                      onChange={(e) => setAmounts((a) => ({ ...a, [r.id]: e.target.value }))}
                      placeholder="0.00"
                    />
                    <button className="ax-btn sm" onClick={() => savePrice(r.id)}>
                      Set
                    </button>
                  </div>
                </td>
                <td>
                  <div className="ax-row" style={{ gap: 6 }}>
                    <span className={`ax-badge ${badge(r.status)}`}>{r.status}</span>
                    <select
                      className="ax-select"
                      style={{ maxWidth: 130 }}
                      value={r.status}
                      onChange={(e) => void patch(r.id, { status: e.target.value }, "Status updated.")}
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
                  <button
                    className="ax-btn ghost sm"
                    onClick={() => setOpen(open === r.id ? null : r.id)}
                  >
                    {open === r.id ? "Hide" : "Details"}
                  </button>
                </td>
              </tr>
              {open === r.id && (
                <tr>
                  <td colSpan={8}>
                    <div className="ax-card" style={{ margin: "6px 0" }}>
                      <h3>Scope &amp; property details</h3>
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          fontFamily: "inherit",
                          fontSize: 13,
                          margin: "10px 0 0",
                          lineHeight: 1.6,
                        }}
                      >
                        {r.scopeNotes}
                      </pre>
                      <p className="ax-muted" style={{ marginTop: 14, fontSize: 12.5 }}>
                        Phone: {r.contactPhone ?? "—"} · Quote request{" "}
                        {r.quoteRequestId.slice(0, 8).toUpperCase()}
                        {r.quotedAt && ` · priced ${new Date(r.quotedAt).toLocaleString()}`}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
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
    </>
  );
}

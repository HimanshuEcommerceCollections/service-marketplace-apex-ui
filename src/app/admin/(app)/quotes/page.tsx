"use client";

import { useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";

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
  createdAt: string;
}

const STATUSES = ["NEW", "REVIEWING", "SENT", "WON", "LOST"];

export default function QuotesPage() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setErr(null);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    try {
      const { data, meta } = await apiWithMeta<Quote[]>(`/admin/quotes?${params}`);
      setRows(data);
      setMeta(meta ?? null);
      setAmounts(Object.fromEntries(data.map((q) => [q.id, q.quotedAmount != null ? (q.quotedAmount / 100).toFixed(2) : ""])));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load quotes");
    }
  }, [page, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patch(id: string, body: Record<string, unknown>, msg: string) {
    setErr(null);
    setNotice(null);
    try {
      await api(`/admin/quotes/${id}`, { method: "PATCH", body });
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
            <th>Booking</th>
            <th>Contact</th>
            <th>Description</th>
            <th>Indicative</th>
            <th>Quoted price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((q) => (
            <tr key={q.id}>
              <td>{q.service?.name ?? "—"}</td>
              <td className="ax-muted">{q.booking?.reference ?? q.source}</td>
              <td className="ax-muted">{q.contactEmail}</td>
              <td style={{ maxWidth: 260 }}>{q.description.length > 80 ? q.description.slice(0, 80) + "…" : q.description}</td>
              <td>
                {q.indicativeAmount != null ? (
                  // The engine total for the customer's configuration — a starting
                  // point, not a price. "Use" copies it into the quote input.
                  <button
                    type="button"
                    className="ax-btn ghost sm"
                    title="Copy the configured-total into the quoted price"
                    onClick={() => setAmounts((a) => ({ ...a, [q.id]: (q.indicativeAmount! / 100).toFixed(2) }))}
                  >
                    ~${(q.indicativeAmount / 100).toFixed(2)} · use
                  </button>
                ) : (
                  <span className="ax-muted">—</span>
                )}
              </td>
              <td>
                <div className="ax-row" style={{ gap: 6 }}>
                  <span className="ax-muted">$</span>
                  <input
                    className="ax-input"
                    style={{ width: 90 }}
                    value={amounts[q.id] ?? ""}
                    onChange={(e) => setAmounts((a) => ({ ...a, [q.id]: e.target.value }))}
                    placeholder="0.00"
                  />
                  <button className="ax-btn sm" onClick={() => savePrice(q.id)}>Set</button>
                </div>
              </td>
              <td>
                <select className="ax-select" style={{ maxWidth: 130 }} value={q.status} onChange={(e) => void patch(q.id, { status: e.target.value }, "Status updated.")}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={7} className="ax-muted">No quote requests found.</td></tr>}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />
    </>
  );
}

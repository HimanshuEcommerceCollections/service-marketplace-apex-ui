"use client";

// The waitlist queue: who is waiting, where, and the button that tells them we've
// arrived. Gated on `geo:manage`, the capability that already governs areas, ZIP
// codes and per-service coverage — deciding who to tell that a ZIP is live is the
// same job as turning that ZIP on.
//
// Until this screen existed, waitlist rows only went IN. Two customer-facing
// surfaces promise "we'll email you as soon as we expand there" (the /service-area
// form and the /book wizard's ZIP gate) and nothing could keep that promise:
// there was no way to read the queue, let alone act on it. The demand panel is
// the other half — it's the number that should drive which area opens next.
//
// Notify is not undoable: it sends real email. Hence the confirm step, the
// ACTIVE-only server-side filter (nobody is mailed twice), and the exact count
// shown before you commit.

import { Fragment, useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";

interface WaitlistSignup {
  id: string;
  email: string;
  zip: string;
  name: string | null;
  phone: string | null;
  source: string;
  status: string;
  notifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Demand {
  zip: string;
  waiting: number;
}

interface NotifyResult {
  notified: number;
  failed: number;
  zips: string[];
}

const STATUSES = ["ACTIVE", "NOTIFIED", "CONVERTED"];
const SOURCES = [
  { value: "booking-flow", label: "Booking wizard" },
  { value: "service-area-miss", label: "ZIP check miss" },
  { value: "service-area-page", label: "Service-area page" },
];
const sourceLabel = (s: string) => SOURCES.find((x) => x.value === s)?.label ?? s;
const badge = (s: string) => (s === "CONVERTED" ? "ok" : s === "ACTIVE" ? "warn" : "muted");
const when = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString() : "—");

export default function WaitlistPage() {
  const [rows, setRows] = useState<WaitlistSignup[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [demand, setDemand] = useState<Demand[] | null>(null);
  const [status, setStatus] = useState("ACTIVE");
  const [source, setSource] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  /** ZIPs ticked for the next notify batch. */
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [notifying, setNotifying] = useState(false);
  const [areaName, setAreaName] = useState("");
  /** Set while the confirm prompt for a notify batch is open. */
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    if (query) {
      // A bare 5-digit query is almost always "show me this ZIP", which the
      // dedicated filter answers exactly rather than as a substring match.
      if (/^\d{5}$/.test(query)) params.set("zip", query);
      else params.set("search", query);
    }
    try {
      const { data, meta } = await apiWithMeta<WaitlistSignup[]>(`/admin/waitlist?${params}`);
      setErr(null);
      setRows(data);
      setMeta(meta ?? null);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load the waitlist");
    }
  }, [page, status, source, query]);

  const loadDemand = useCallback(async () => {
    try {
      setDemand(await api<Demand[]>("/admin/waitlist/demand"));
    } catch {
      // The queue is the point of this page; a missing summary panel shouldn't
      // read as the whole screen being broken.
      setDemand([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void loadDemand();
  }, [loadDemand]);

  function toggleZip(zip: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(zip)) next.delete(zip);
      else next.add(zip);
      return next;
    });
    setConfirming(false);
  }

  async function patchStatus(id: string, next: string) {
    setErr(null);
    setNotice(null);
    try {
      await api(`/admin/waitlist/${id}`, { method: "PATCH", body: { status: next } });
      setNotice("Signup updated.");
      await Promise.all([load(), loadDemand()]);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  async function notify() {
    const zips = [...picked];
    if (zips.length === 0) return;
    setNotifying(true);
    setErr(null);
    setNotice(null);
    try {
      const result = await api<NotifyResult>("/admin/waitlist/notify", {
        method: "POST",
        body: { zips, ...(areaName.trim() ? { areaName: areaName.trim() } : {}) },
      });
      setNotice(
        result.notified === 0 && result.failed === 0
          ? `Nobody was still waiting on ${zips.join(", ")}.`
          : `Emailed ${result.notified} signup(s)${
              result.failed ? ` — ${result.failed} could not be delivered and stay ACTIVE for a retry` : ""
            }.`,
      );
      setPicked(new Set());
      setAreaName("");
      setConfirming(false);
      await Promise.all([load(), loadDemand()]);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Notify failed");
    } finally {
      setNotifying(false);
    }
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  /** How many ACTIVE signups the picked ZIPs cover, per the demand summary. */
  const pickedWaiting = (demand ?? [])
    .filter((d) => picked.has(d.zip))
    .reduce((sum, d) => sum + d.waiting, 0);

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {notice && <div className="ax-alert ok">{notice}</div>}

      <div className="ax-card" style={{ marginBottom: 14 }}>
        <h3>Where people are waiting</h3>
        <p className="ax-muted" style={{ fontSize: 12.5, margin: "2px 0 12px" }}>
          ACTIVE signups per ZIP code — the demand behind an expansion decision. Tick the ZIPs you have just
          turned on in <b>ZIP codes</b> and <b>Service coverage</b>, then notify everyone waiting on them.
        </p>

        {demand === null ? (
          <p className="ax-muted">Loading…</p>
        ) : demand.length === 0 ? (
          <p className="ax-muted">Nobody is currently waiting.</p>
        ) : (
          <div className="ax-row" style={{ gap: 6, flexWrap: "wrap" }}>
            {demand.map((d) => (
              <button
                key={d.zip}
                type="button"
                className={`ax-btn ${picked.has(d.zip) ? "" : "ghost"} sm`}
                onClick={() => toggleZip(d.zip)}
              >
                {d.zip} · {d.waiting}
              </button>
            ))}
          </div>
        )}

        {picked.size > 0 && (
          <div style={{ marginTop: 14, borderTop: "1px solid var(--ax-line, #e6e6e6)", paddingTop: 14 }}>
            <div className="ax-row" style={{ gap: 8, flexWrap: "wrap" }}>
              <input
                className="ax-input"
                style={{ maxWidth: 220 }}
                placeholder="Area name for the email (optional)"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
              {confirming ? (
                <>
                  <button className="ax-btn sm" disabled={notifying} onClick={() => void notify()}>
                    {notifying ? "Sending…" : `Yes — email ${pickedWaiting} customer(s)`}
                  </button>
                  <button className="ax-btn ghost sm" disabled={notifying} onClick={() => setConfirming(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="ax-btn sm" onClick={() => setConfirming(true)}>
                  Notify {picked.size} ZIP(s)
                </button>
              )}
              <button className="ax-btn ghost sm" onClick={() => setPicked(new Set())}>
                Clear selection
              </button>
            </div>
            <p className="ax-muted" style={{ fontSize: 12.5, marginTop: 8 }}>
              {confirming ? (
                <>
                  This sends real email to <b>{pickedWaiting}</b> customer(s) on{" "}
                  <b>{[...picked].sort().join(", ")}</b> and marks them NOTIFIED. It can&apos;t be undone.
                  Make sure coverage is actually live for these ZIPs first.
                </>
              ) : (
                <>
                  Selected: <b>{[...picked].sort().join(", ")}</b> · {pickedWaiting} customer(s) waiting.
                  Only ACTIVE signups are mailed, so re-running this never emails anyone twice.
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <form className="ax-row" style={{ marginBottom: 12, gap: 8 }} onSubmit={applySearch}>
        <select
          className="ax-select"
          style={{ maxWidth: 160 }}
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
          style={{ maxWidth: 190 }}
          value={source}
          onChange={(e) => {
            setPage(1);
            setSource(e.target.value);
          }}
        >
          <option value="">All sources</option>
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          className="ax-input"
          style={{ maxWidth: 250 }}
          placeholder="Search email, name, phone or ZIP"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="ax-btn ghost sm" type="submit">
          Search
        </button>
        {(status || source || query) && (
          <button
            className="ax-btn ghost sm"
            type="button"
            onClick={() => {
              setStatus("");
              setSource("");
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
            <th>Contact</th>
            <th>ZIP</th>
            <th>Source</th>
            <th>Joined</th>
            <th>Notified</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <Fragment key={r.id}>
              <tr>
                <td>
                  <b>{r.name ?? r.email}</b>
                  {r.name && (
                    <>
                      <br />
                      <span className="ax-muted">{r.email}</span>
                    </>
                  )}
                  {r.phone && (
                    <>
                      <br />
                      <span className="ax-muted">{r.phone}</span>
                    </>
                  )}
                </td>
                <td>
                  <b>{r.zip}</b>
                </td>
                <td className="ax-muted">{sourceLabel(r.source)}</td>
                <td className="ax-muted">{when(r.createdAt)}</td>
                <td className="ax-muted">{when(r.notifiedAt)}</td>
                <td>
                  <div className="ax-row" style={{ gap: 6 }}>
                    <span className={`ax-badge ${badge(r.status)}`}>{r.status}</span>
                    <select
                      className="ax-select"
                      style={{ maxWidth: 130 }}
                      value={r.status}
                      onChange={(e) => void patchStatus(r.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            </Fragment>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="ax-muted">
                No waitlist signups match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />
    </>
  );
}

"use client";

// Coordinator screening queue for Become-an-Apex-Pro applications submitted from
// /become-a-pro. Gated on `pro:manage`, which COORDINATOR and ADMIN both hold.
//
// Trades are stored as service slugs; this screen renders their catalog labels.
// Acknowledgements are collected but NEVER verified (PRD) — the detail panel
// shows exactly what the applicant confirmed, and nothing more should be read
// into it.

import { Fragment, useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";

interface ProApplication {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  zip: string;
  trades: string[];
  acknowledgements: Record<string, Record<string, boolean>>;
  experience: string | null;
  company: string | null;
  availability: string | null;
  preferredStart: string | null;
  intro: string | null;
  status: string;
  notes: string | null;
  promotedUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUSES = ["RECEIVED", "REVIEWING", "CONTACTED"];
// Mirrors the catalog slugs the public form submits.
const TRADES: { slug: string; label: string }[] = [
  { slug: "cleaning", label: "Cleaning" },
  { slug: "lawn-care", label: "Lawn Care" },
  { slug: "power-washing", label: "Power Washing" },
  { slug: "painting", label: "Painting" },
  { slug: "junk-removal", label: "Junk Removal" },
  { slug: "pool", label: "Pool Service" },
  { slug: "pest-control", label: "Pest Control" },
  { slug: "home-security", label: "Home Security" },
  { slug: "smart-home", label: "Smart Home" },
  { slug: "handyman", label: "Handyman" },
  { slug: "tree-stump", label: "Tree & Stump" },
];
const tradeLabel = (slug: string) => TRADES.find((t) => t.slug === slug)?.label ?? slug;
const badge = (s: string) => (s === "CONTACTED" ? "ok" : s === "RECEIVED" ? "warn" : "muted");
const when = (iso: string) => new Date(iso).toLocaleDateString();

export default function ProApplicationsPage() {
  const [rows, setRows] = useState<ProApplication[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [status, setStatus] = useState("");
  const [trade, setTrade] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setErr(null);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    if (trade) params.set("trade", trade);
    if (query) params.set("search", query);
    try {
      const { data, meta } = await apiWithMeta<ProApplication[]>(`/admin/pro-applications?${params}`);
      setRows(data);
      setMeta(meta ?? null);
      setNotes(Object.fromEntries(data.map((r) => [r.id, r.notes ?? ""])));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load applications");
    }
  }, [page, status, trade, query]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patch(id: string, body: Record<string, unknown>, msg: string) {
    setErr(null);
    setNotice(null);
    try {
      await api(`/admin/pro-applications/${id}`, { method: "PATCH", body });
      setNotice(msg);
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed");
    }
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
          style={{ maxWidth: 170 }}
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
          value={trade}
          onChange={(e) => {
            setPage(1);
            setTrade(e.target.value);
          }}
        >
          <option value="">All trades</option>
          {TRADES.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          className="ax-input"
          style={{ maxWidth: 240 }}
          placeholder="Search name, email, company or ZIP"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="ax-btn ghost sm" type="submit">
          Search
        </button>
        {(status || trade || query) && (
          <button
            className="ax-btn ghost sm"
            type="button"
            onClick={() => {
              setStatus("");
              setTrade("");
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
            <th>Applicant</th>
            <th>ZIP</th>
            <th>Trades</th>
            <th>Experience</th>
            <th>Availability</th>
            <th>Applied</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <Fragment key={r.id}>
              <tr>
                <td>
                  <b>{r.name}</b>
                  <br />
                  <span className="ax-muted">{r.email}</span>
                  {r.company && (
                    <>
                      <br />
                      <span className="ax-muted">{r.company}</span>
                    </>
                  )}
                </td>
                <td className="ax-muted">{r.zip}</td>
                <td style={{ maxWidth: 220 }}>
                  <div className="ax-row" style={{ gap: 4, flexWrap: "wrap" }}>
                    {r.trades.map((t) => (
                      <span className="ax-badge muted" key={t}>
                        {tradeLabel(t)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="ax-muted">{r.experience ?? "—"}</td>
                <td className="ax-muted">{r.availability ?? "—"}</td>
                <td className="ax-muted">{when(r.createdAt)}</td>
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
                      <h3>Applicant detail</h3>
                      <p className="ax-muted" style={{ fontSize: 12.5 }}>
                        Phone: {r.phone ?? "—"} · Preferred start: {r.preferredStart ?? "—"}
                        {r.promotedUserId && " · promoted to a professional account"}
                      </p>

                      {r.intro && (
                        <>
                          <div className="ax-section-title" style={{ margin: "16px 0 6px" }}>
                            Introduction
                          </div>
                          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{r.intro}</p>
                        </>
                      )}

                      <div className="ax-section-title" style={{ margin: "16px 0 6px" }}>
                        Acknowledgements
                      </div>
                      <p className="ax-muted" style={{ fontSize: 12, margin: "0 0 8px" }}>
                        Self-declared by the applicant. Apex does not verify licenses — confirm
                        during onboarding.
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
                        {Object.entries(r.acknowledgements).map(([key, vals]) => (
                          <li key={key}>
                            <b>{key === "general" ? "General consent" : tradeLabel(key)}</b>:{" "}
                            {Object.entries(vals)
                              .map(([k, v]) => `${k} = ${v ? "yes" : "no"}`)
                              .join(", ")}
                          </li>
                        ))}
                        {Object.keys(r.acknowledgements).length === 0 && (
                          <li className="ax-muted">None recorded</li>
                        )}
                      </ul>

                      <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>
                        Coordinator notes
                      </div>
                      <div className="ax-row" style={{ gap: 8, alignItems: "flex-start" }}>
                        <textarea
                          className="ax-textarea"
                          style={{ flex: 1, minHeight: 70 }}
                          placeholder="Screening notes, onboarding follow-ups…"
                          value={notes[r.id] ?? ""}
                          onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                        />
                        <button
                          className="ax-btn sm"
                          onClick={() => void patch(r.id, { notes: notes[r.id] ?? "" }, "Notes saved.")}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="ax-muted">
                No pro applications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />
    </>
  );
}

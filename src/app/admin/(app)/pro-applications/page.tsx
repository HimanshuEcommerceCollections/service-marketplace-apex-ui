"use client";

// Coordinator screening queue for Become-an-Apex-Pro applications submitted from
// /become-a-pro. Gated on `pro:manage`, which COORDINATOR and ADMIN both hold.
//
// Trades are stored as service slugs; this screen renders their catalog labels.
// Acknowledgements are collected but NEVER verified (PRD) — the detail modal
// shows exactly what the applicant confirmed, and nothing more should be read
// into it.

import { useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";
import { ConfirmModal, Modal, type ConfirmRequest } from "../../components/modal";
import { TableSkeleton } from "../../components/skeleton";

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
  // null = first load in flight (skeleton); [] = genuinely empty.
  const [rows, setRows] = useState<ProApplication[] | null>(null);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [status, setStatus] = useState("");
  const [trade, setTrade] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  /** Id of the application open in the detail modal (row data stays fresh across reloads). */
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    if (trade) params.set("trade", trade);
    if (query) params.set("search", query);
    try {
      const { data, meta } = await apiWithMeta<ProApplication[]>(`/admin/pro-applications?${params}`);
      setErr(null);
      setRows(data);
      setMeta(meta ?? null);
      // Keep any note the user has already typed for a still-present row so a
      // reload triggered by one row's save doesn't wipe unsaved edits elsewhere.
      setNotes((prev) =>
        Object.fromEntries(data.map((r: ProApplication) => [r.id, r.id in prev ? prev[r.id] : r.notes ?? ""])),
      );
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load applications");
    }
  }, [page, status, trade, query]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Throws on failure — the ConfirmModal shows the error and stays open. */
  async function patch(id: string, body: Record<string, unknown>, msg: string) {
    await api(`/admin/pro-applications/${id}`, { method: "PATCH", body });
    setNotice(msg);
    await load();
  }

  function askStatus(r: ProApplication, next: string) {
    setConfirm({
      title: "Change application status",
      body: (
        <>
          Change <b>{r.name}</b>&apos;s application ({r.email}) from <b>{r.status}</b> to <b>{next}</b>?
        </>
      ),
      confirmLabel: `Set ${next}`,
      action: () => patch(r.id, { status: next }, "Status updated."),
    });
  }

  /** Notes are additive and low-risk — saved directly, no confirmation step. */
  async function saveNotes(id: string) {
    setErr(null);
    setNotice(null);
    setSavingNotes(true);
    try {
      await patch(id, { notes: notes[id] ?? "" }, "Notes saved.");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not save the notes");
    } finally {
      setSavingNotes(false);
    }
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  const detail = detailId ? (rows ?? []).find((r) => r.id === detailId) ?? null : null;

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

      <div className="ax-table-wrap">
      <table className="ax-table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>ZIP</th>
            <th className="ax-hide-md">Trades</th>
            <th className="ax-hide-md">Applied</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows === null && !err && <TableSkeleton cols={6} />}
          {(rows ?? []).map((r) => (
            <tr key={r.id}>
              <td>
                <b>{r.name}</b>
                <br />
                <span className="ax-muted">{r.email}</span>
              </td>
              <td className="ax-muted">{r.zip}</td>
              <td style={{ maxWidth: 240 }} className="ax-hide-md">
                <div className="ax-row" style={{ gap: 4, flexWrap: "wrap" }}>
                  {r.trades.map((t) => (
                    <span className="ax-badge muted" key={t}>
                      {tradeLabel(t)}
                    </span>
                  ))}
                </div>
              </td>
              <td className="ax-muted ax-hide-md">{when(r.createdAt)}</td>
              <td>
                <div className="ax-row" style={{ gap: 6 }}>
                  <span className={`ax-badge ${badge(r.status)}`}>{r.status}</span>
                  <select
                    className="ax-select"
                    style={{ maxWidth: 130 }}
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
          {rows !== null && rows.length === 0 && (
            <tr>
              <td colSpan={6} className="ax-muted">
                No pro applications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <Pager meta={meta} page={page} setPage={setPage} />

      {detail && (
        <Modal title={detail.name} onClose={() => setDetailId(null)} width={640}>
          {/* The page-level alerts sit behind the overlay — mirror them here so
              feedback for in-modal actions (notes save, status) stays visible. */}
          {err && <div className="ax-alert err">{err}</div>}
          {notice && <div className="ax-alert ok">{notice}</div>}
          <dl className="ax-kv">
            <dt>Status</dt>
            <dd>
              <span className={`ax-badge ${badge(detail.status)}`}>{detail.status}</span>
              {detail.promotedUserId && (
                <span className="ax-badge ok" style={{ marginLeft: 6 }}>promoted to pro</span>
              )}
            </dd>
            <dt>Email</dt>
            <dd>{detail.email}</dd>
            <dt>Phone</dt>
            <dd>{detail.phone ?? "—"}</dd>
            <dt>Company</dt>
            <dd>{detail.company ?? "—"}</dd>
            <dt>ZIP</dt>
            <dd>{detail.zip}</dd>
            <dt>Trades</dt>
            <dd>
              <span className="ax-row" style={{ gap: 4, flexWrap: "wrap" }}>
                {detail.trades.map((t) => (
                  <span className="ax-badge muted" key={t}>
                    {tradeLabel(t)}
                  </span>
                ))}
              </span>
            </dd>
            <dt>Experience</dt>
            <dd>{detail.experience ?? "—"}</dd>
            <dt>Availability</dt>
            <dd>{detail.availability ?? "—"}</dd>
            <dt>Preferred start</dt>
            <dd>{detail.preferredStart ?? "—"}</dd>
            <dt>Applied</dt>
            <dd>{new Date(detail.createdAt).toLocaleString()}</dd>
          </dl>

          {detail.intro && (
            <>
              <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>Introduction</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{detail.intro}</p>
            </>
          )}

          <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>Acknowledgements</div>
          <p className="ax-muted" style={{ fontSize: 12, margin: "0 0 8px" }}>
            Self-declared by the applicant. Apex does not verify licenses — confirm during onboarding.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
            {Object.entries(detail.acknowledgements).map(([key, vals]) => (
              <li key={key}>
                <b>{key === "general" ? "General consent" : tradeLabel(key)}</b>:{" "}
                {Object.entries(vals)
                  .map(([k, v]) => `${k} = ${v ? "yes" : "no"}`)
                  .join(", ")}
              </li>
            ))}
            {Object.keys(detail.acknowledgements).length === 0 && (
              <li className="ax-muted">None recorded</li>
            )}
          </ul>

          <div className="ax-section-title" style={{ margin: "18px 0 6px" }}>Coordinator notes</div>
          <div className="ax-row" style={{ gap: 8, alignItems: "flex-start" }}>
            <textarea
              className="ax-textarea"
              style={{ flex: 1, minHeight: 70 }}
              placeholder="Screening notes, onboarding follow-ups…"
              value={notes[detail.id] ?? ""}
              onChange={(e) => setNotes((n) => ({ ...n, [detail.id]: e.target.value }))}
            />
            <button className="ax-btn sm" disabled={savingNotes} onClick={() => void saveNotes(detail.id)}>
              {savingNotes ? "Saving…" : "Save"}
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

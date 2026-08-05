"use client";

// Recurring cadences — the GLOBAL cadence vocabulary (One-time / Weekly / …).
// Shared by every service; each service picks its own % + on/off per cadence in
// Edit pricing. Creating a cadence here adds it to every service's grid,
// inactive at 0% until an admin turns it on per service.

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

type Interval = "NONE" | "WEEK" | "MONTH";
type Status = "ACTIVE" | "INACTIVE";

interface Cadence {
  id: string;
  key: string;
  label: string;
  interval: Interval;
  intervalCount: number;
  sortOrder: number;
  status: Status;
}

const INTERVALS: { v: Interval; label: string }[] = [
  { v: "NONE", label: "one-time (no billing cycle)" },
  { v: "WEEK", label: "weeks" },
  { v: "MONTH", label: "months" },
];

const cycleLabel = (c: Cadence) =>
  c.interval === "NONE" ? "—" : `every ${c.intervalCount > 1 ? `${c.intervalCount} ` : ""}${c.interval.toLowerCase()}${c.intervalCount > 1 ? "s" : ""}`;

export default function RecurringCadencesPage() {
  const [rows, setRows] = useState<Cadence[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [label, setLabel] = useState("");
  const [interval, setInterval_] = useState<Interval>("WEEK");
  const [count, setCount] = useState("1");
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    () =>
      api<Cadence[]>("/admin/catalog/cadences")
        .then((data) => {
          setRows(data);
          setErr(null);
        })
        .catch((e) => setErr(e instanceof ApiError ? e.message : "Failed to load cadences")),
    [],
  );

  useEffect(() => {
    // setState only from promise callbacks — never synchronously in the effect.
    void api<Cadence[]>("/admin/catalog/cadences")
      .then((data) => {
        setRows(data);
        setErr(null);
      })
      .catch((e) => setErr(e instanceof ApiError ? e.message : "Failed to load cadences"));
  }, []);

  async function create() {
    if (!label.trim()) return;
    setBusy(true);
    setErr(null);
    setNotice(null);
    try {
      await api("/admin/catalog/cadences", {
        method: "POST",
        body: { label: label.trim(), interval, intervalCount: Math.max(1, Number(count) || 1) },
      });
      setLabel("");
      setCount("1");
      setNotice("Cadence created — it appears on every service, inactive until enabled per service.");
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(c: Cadence) {
    setErr(null);
    setNotice(null);
    try {
      await api(`/admin/catalog/cadences/${c.id}`, {
        method: "PATCH",
        body: { status: c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
      });
      setNotice("Cadence updated.");
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {notice && <div className="ax-alert ok">{notice}</div>}

      <div className="ax-card">
        <h3>Add cadence</h3>
        <div className="ax-row" style={{ gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <input className="ax-input" style={{ maxWidth: 200 }} placeholder="Label (e.g. Quarterly)" value={label} onChange={(e) => setLabel(e.target.value)} />
          <select className="ax-select" style={{ maxWidth: 220 }} value={interval} onChange={(e) => setInterval_(e.target.value as Interval)}>
            {INTERVALS.map((i) => (
              <option key={i.v} value={i.v}>{i.label}</option>
            ))}
          </select>
          {interval !== "NONE" && (
            <input className="ax-input" style={{ width: 90 }} placeholder="every N" value={count} onChange={(e) => setCount(e.target.value)} />
          )}
          <button className="ax-btn sm" onClick={() => void create()} disabled={busy}>
            {busy ? "Creating…" : "Add"}
          </button>
        </div>
      </div>

      <table className="ax-table" style={{ marginTop: 16 }}>
        <thead><tr><th>Cadence</th><th>Key</th><th>Billing cycle</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} style={c.status === "INACTIVE" ? { opacity: 0.55 } : undefined}>
              <td>{c.label}</td>
              <td className="ax-muted">{c.key}</td>
              <td className="ax-muted">{cycleLabel(c)}</td>
              <td><span className={`ax-badge ${c.status === "ACTIVE" ? "ok" : "muted"}`}>{c.status}</span></td>
              <td>
                <button className="ax-btn ghost sm" onClick={() => void toggle(c)}>
                  {c.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={5} className="ax-muted">No cadences.</td></tr>}
        </tbody>
      </table>
    </>
  );
}

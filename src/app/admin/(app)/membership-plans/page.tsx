"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

interface PlanView {
  id: string;
  key: string;
  name: string;
  description: string | null;
  interval: "WEEK" | "MONTH";
  intervalCount: number;
  fromPrice: number | null; // cents
  currency: string;
  active: boolean;
  service: { slug: string; name: string } | null;
}

const cadence = (interval: "WEEK" | "MONTH", n: number) => {
  const unit = interval === "WEEK" ? "week" : "month";
  return n === 1 ? `Every ${unit}` : `Every ${n} ${unit}s`;
};
const toDollars = (cents: number | null) => (cents == null ? "" : String(cents / 100));

export default function MembershipPlansPage() {
  const [rows, setRows] = useState<PlanView[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const load = useCallback(async () => {
    setErr(null);
    try {
      setRows(await api<PlanView[]>("/admin/membership-plans"));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load plans");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(fn: () => Promise<unknown>) {
    setErr(null);
    try {
      await fn();
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Action failed");
    }
  }

  function savePrice(id: string) {
    const dollars = parseFloat(editPrice);
    if (Number.isNaN(dollars) || dollars < 0) {
      setErr("Enter a valid price (e.g. 149)");
      return;
    }
    const cents = Math.round(dollars * 100);
    void run(async () => {
      await api(`/admin/membership-plans/${id}`, { method: "PATCH", body: { fromPrice: cents } });
      setEditId(null);
    });
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}

      <div className="ax-card" style={{ marginBottom: 16 }}>
        <p className="ax-muted" style={{ margin: 0 }}>
          The “from” price shown on each membership card at <b>/membership-plans</b>. Editing it updates the
          marketing site (within ~5 min). Plans without a Stripe link are <b>display-only</b> until Stripe is
          configured — customers can’t subscribe yet.
        </p>
      </div>

      <table className="ax-table">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Service</th>
            <th>Cadence</th>
            <th>From price / visit</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td className="ax-muted">{p.service?.slug ?? "—"}</td>
              <td className="ax-muted">{cadence(p.interval, p.intervalCount)}</td>
              <td>
                {editId === p.id ? (
                  <div className="ax-row" style={{ gap: 6 }}>
                    <span>$</span>
                    <input
                      className="ax-input"
                      style={{ maxWidth: 100 }}
                      inputMode="decimal"
                      placeholder="149"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      autoFocus
                    />
                  </div>
                ) : p.fromPrice != null ? (
                  `$${p.fromPrice / 100}`
                ) : (
                  <span className="ax-muted">—</span>
                )}
              </td>
              <td>
                <span className={`ax-badge ${p.active ? "ok" : "muted"}`}>{p.active ? "ACTIVE" : "HIDDEN"}</span>
              </td>
              <td>
                <div className="ax-row" style={{ gap: 6 }}>
                  {editId === p.id ? (
                    <>
                      <button className="ax-btn sm" onClick={() => savePrice(p.id)}>
                        Save
                      </button>
                      <button className="ax-btn ghost sm" onClick={() => setEditId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="ax-btn ghost sm"
                        onClick={() => {
                          setEditId(p.id);
                          setEditPrice(toDollars(p.fromPrice));
                        }}
                      >
                        Edit price
                      </button>
                      <button
                        className="ax-btn ghost sm"
                        onClick={() =>
                          void run(() =>
                            api(`/admin/membership-plans/${p.id}`, { method: "PATCH", body: { active: !p.active } }),
                          )
                        }
                      >
                        {p.active ? "Hide" : "Show"}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="ax-muted">
                No membership plans yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

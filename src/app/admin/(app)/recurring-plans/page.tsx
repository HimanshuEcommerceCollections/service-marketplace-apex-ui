"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

interface ServiceLite {
  slug: string;
  name: string;
}
interface RecurringView {
  serviceSlug: string;
  serviceName: string;
  heading: string | null;
  plans: {
    id: string;
    name: string;
    freq: string;
    amount: string;
    unit: string | null;
    disc: string | null;
    best: boolean;
    cta: string;
  }[];
}
interface PlanRow {
  name: string;
  freq: string;
  amount: string;
  unit: string;
  disc: string;
  best: boolean;
  cta: string;
}

const emptyRow = (): PlanRow => ({ name: "", freq: "", amount: "", unit: "", disc: "", best: false, cta: "" });

export default function RecurringPlansPage() {
  const [services, setServices] = useState<ServiceLite[]>([]);
  const [slug, setSlug] = useState("");
  const [heading, setHeading] = useState("");
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load the service list once (drives the picker).
  useEffect(() => {
    void (async () => {
      try {
        const list = await api<ServiceLite[]>("/services");
        setServices(list);
        setSlug((s) => s || list[0]?.slug || "");
      } catch (e) {
        setErr(e instanceof ApiError ? e.message : "Failed to load services");
      }
    })();
  }, []);

  const loadRecurring = useCallback(async (sl: string) => {
    if (!sl) return;
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const v = await api<RecurringView>(`/admin/catalog/services/${sl}/recurring`);
      setHeading(v.heading ?? "");
      setRows(
        v.plans.map((p) => ({
          name: p.name,
          freq: p.freq,
          amount: p.amount,
          unit: p.unit ?? "",
          disc: p.disc ?? "",
          best: p.best,
          cta: p.cta,
        })),
      );
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load recurring plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecurring(slug);
  }, [slug, loadRecurring]);

  function updateRow(i: number, patch: Partial<PlanRow>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  // Only one plan may be "Most popular".
  function setBest(i: number) {
    setRows((rs) => rs.map((r, idx) => ({ ...r, best: idx === i })));
  }
  function move(i: number, dir: -1 | 1) {
    setRows((rs) => {
      const j = i + dir;
      if (j < 0 || j >= rs.length) return rs;
      const next = rs.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function removeRow(i: number) {
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  }
  function addRow() {
    setRows((rs) => [...rs, emptyRow()]);
  }

  async function save() {
    setErr(null);
    setMsg(null);
    for (const [i, r] of rows.entries()) {
      if (!r.name.trim() || !r.freq.trim() || !r.amount.trim() || !r.cta.trim()) {
        setErr(`Plan ${i + 1}: name, cadence, amount and button label are all required.`);
        return;
      }
    }
    setSaving(true);
    try {
      await api(`/admin/catalog/services/${slug}/recurring`, {
        method: "PUT",
        body: {
          heading: heading.trim() || null,
          plans: rows.map((r) => ({
            name: r.name.trim(),
            freq: r.freq.trim(),
            amount: r.amount.trim(),
            unit: r.unit.trim() || null,
            disc: r.disc.trim() || null,
            best: r.best,
            cta: r.cta.trim(),
          })),
        },
      });
      setMsg("Saved — the service page updates within ~5 min.");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {msg && <div className="ax-alert ok">{msg}</div>}

      <div className="ax-card" style={{ marginBottom: 16 }}>
        <p className="ax-muted" style={{ margin: "0 0 12px" }}>
          The “Recurring plans” cards shown on each <b>/services/…</b> page. Prices here are display labels only —
          they don’t drive the live configurator estimate. Row order is the display order; mark one plan as
          <b> Most popular</b>.
        </p>
        <div className="ax-row" style={{ gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label className="ax-muted" htmlFor="svc">
            Service
          </label>
          <select
            id="svc"
            className="ax-input"
            style={{ maxWidth: 260 }}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="ax-card ax-muted">Loading…</div>
      ) : (
        <>
          <div className="ax-card" style={{ marginBottom: 16 }}>
            <label className="ax-muted" htmlFor="heading">
              Section heading
            </label>
            <input
              id="heading"
              className="ax-input"
              style={{ width: "100%", marginTop: 6 }}
              placeholder="Book once. Never think about it again."
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
            />
          </div>

          {rows.map((r, i) => (
            <div className="ax-card" key={i} style={{ marginBottom: 12 }}>
              <div className="ax-row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                <b>Plan {i + 1}</b>
                <div className="ax-row" style={{ gap: 6 }}>
                  <button className="ax-btn ghost sm" onClick={() => move(i, -1)} disabled={i === 0}>
                    ↑
                  </button>
                  <button className="ax-btn ghost sm" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                    ↓
                  </button>
                  <button className="ax-btn ghost sm" onClick={() => removeRow(i)}>
                    Remove
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                <Field label="Name" value={r.name} onChange={(v) => updateRow(i, { name: v })} placeholder="Weekly" />
                <Field
                  label="Cadence"
                  value={r.freq}
                  onChange={(v) => updateRow(i, { freq: v })}
                  placeholder="Every week"
                />
                <Field label="Amount" value={r.amount} onChange={(v) => updateRow(i, { amount: v })} placeholder="$119" />
                <Field label="Unit" value={r.unit} onChange={(v) => updateRow(i, { unit: v })} placeholder="/visit" />
                <Field
                  label="Discount"
                  value={r.disc}
                  onChange={(v) => updateRow(i, { disc: v })}
                  placeholder="Save 15%"
                />
                <Field
                  label="Button label"
                  value={r.cta}
                  onChange={(v) => updateRow(i, { cta: v })}
                  placeholder="Choose weekly"
                />
              </div>
              <label className="ax-row" style={{ gap: 8, marginTop: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={r.best} onChange={() => setBest(i)} />
                <span>Most popular (highlighted card)</span>
              </label>
            </div>
          ))}

          <div className="ax-row" style={{ gap: 8, marginTop: 12 }}>
            <button className="ax-btn ghost" onClick={addRow} disabled={rows.length >= 8}>
              + Add plan
            </button>
            <button className="ax-btn" onClick={() => void save()} disabled={saving || !slug}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <span className="ax-muted" style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
        {label}
      </span>
      <input
        className="ax-input"
        style={{ width: "100%" }}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

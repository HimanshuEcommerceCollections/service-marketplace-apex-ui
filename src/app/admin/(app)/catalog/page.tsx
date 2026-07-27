"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

interface ServiceOption { id: string; name: string; slug: string }
interface EditOption { id: string; key: string; label: string; priceDelta: number }
interface EditGroup { key: string; label: string; inputType: string; options: EditOption[] }
interface EditRule { id: string; key: string; label: string; kind: string; calc: string; value: number }
interface EditView {
  id: string;
  slug: string;
  name: string;
  pricingMode: "PRICED" | "FROM" | "QUOTE";
  basePrice: number;
  fromPrice: number | null;
  currency: string;
  groups: EditGroup[];
  rules: EditRule[];
}

const c2d = (c: number) => (c / 100).toFixed(2);
const d2c = (s: string) => Math.round(Number(s) * 100);

export default function EditPricingPage() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [slug, setSlug] = useState("");
  const [view, setView] = useState<EditView | null>(null);
  const [basePrice, setBasePrice] = useState("");
  const [fromPrice, setFromPrice] = useState("");
  const [optDeltas, setOptDeltas] = useState<Record<string, string>>({});
  const [ruleVals, setRuleVals] = useState<Record<string, string>>({});
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<ServiceOption[]>("/services").then(setServices).catch(() => setServices([]));
  }, []);

  async function loadService(s: string) {
    setErr(null);
    setNotice(null);
    setSlug(s);
    setView(null);
    if (!s) return;
    try {
      const v = await api<EditView>(`/admin/catalog/services/${s}`);
      setView(v);
      setBasePrice(c2d(v.basePrice));
      setFromPrice(v.fromPrice != null ? c2d(v.fromPrice) : "");
      setOptDeltas(Object.fromEntries(v.groups.flatMap((g) => g.options.map((o) => [o.id, c2d(o.priceDelta)]))));
      setRuleVals(Object.fromEntries(v.rules.map((r) => [r.id, r.calc === "percent" ? String(r.value) : c2d(r.value)])));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load service");
    }
  }

  async function save() {
    if (!view) return;
    setBusy(true);
    setErr(null);
    setNotice(null);
    try {
      const body = {
        basePrice: d2c(basePrice),
        ...(view.pricingMode === "FROM" && fromPrice !== "" ? { fromPrice: d2c(fromPrice) } : {}),
        options: view.groups.flatMap((g) => g.options.map((o) => ({ id: o.id, priceDelta: d2c(optDeltas[o.id] ?? "0") }))),
        rules: view.rules.map((r) => ({
          id: r.id,
          value: r.calc === "percent" ? Number(ruleVals[r.id] ?? "0") : d2c(ruleVals[r.id] ?? "0"),
        })),
      };
      await api(`/admin/catalog/services/${view.slug}/pricing`, { method: "PUT", body });
      setNotice("Pricing saved — live immediately for new quotes and bookings.");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {notice && <div className="ax-alert ok">{notice}</div>}

      <div className="ax-field" style={{ maxWidth: 320 }}>
        <label>Service</label>
        <select className="ax-select" value={slug} onChange={(e) => void loadService(e.target.value)}>
          <option value="">— choose a service —</option>
          {services.map((s) => (
            <option key={s.id} value={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      {view && view.pricingMode === "QUOTE" && (
        <div className="ax-card" style={{ marginTop: 16 }}>
          <p className="ax-muted">{view.name} is a quote service — it has no configurable pricing.</p>
        </div>
      )}

      {view && view.pricingMode !== "QUOTE" && (
        <>
          <div className="ax-card" style={{ marginTop: 16 }}>
            <h3>{view.name}</h3>
            <div className="ax-row" style={{ gap: 16, marginTop: 10 }}>
              <div className="ax-field" style={{ width: 160 }}>
                <label>Base price ($)</label>
                <input className="ax-input" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
              </div>
              {view.pricingMode === "FROM" && (
                <div className="ax-field" style={{ width: 160 }}>
                  <label>From price ($)</label>
                  <input className="ax-input" value={fromPrice} onChange={(e) => setFromPrice(e.target.value)} />
                </div>
              )}
            </div>
          </div>

          {view.groups.filter((g) => g.options.length > 0).map((g) => (
            <div className="ax-card" style={{ marginTop: 12 }} key={g.key}>
              <h3>{g.label}</h3>
              <table className="ax-table" style={{ marginTop: 8 }}>
                <thead><tr><th>Option</th><th>Delta ($)</th></tr></thead>
                <tbody>
                  {g.options.map((o) => (
                    <tr key={o.id}>
                      <td>{o.label}</td>
                      <td>
                        <input className="ax-input" style={{ width: 120 }} value={optDeltas[o.id] ?? ""} onChange={(e) => setOptDeltas((m) => ({ ...m, [o.id]: e.target.value }))} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {view.rules.length > 0 && (
            <div className="ax-card" style={{ marginTop: 12 }}>
              <h3>Discount rules</h3>
              <table className="ax-table" style={{ marginTop: 8 }}>
                <thead><tr><th>Rule</th><th>{"Value"}</th></tr></thead>
                <tbody>
                  {view.rules.map((r) => (
                    <tr key={r.id}>
                      <td>{r.label} <span className="ax-muted">({r.kind}, {r.calc})</span></td>
                      <td>
                        <div className="ax-row" style={{ gap: 4 }}>
                          <input className="ax-input" style={{ width: 100 }} value={ruleVals[r.id] ?? ""} onChange={(e) => setRuleVals((m) => ({ ...m, [r.id]: e.target.value }))} />
                          <span className="ax-muted">{r.calc === "percent" ? "%" : "$"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button className="ax-btn" style={{ marginTop: 16 }} onClick={() => void save()} disabled={busy}>
            {busy ? "Saving…" : "Save pricing"}
          </button>
        </>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

interface ServiceOption { id: string; name: string; slug: string }
interface EditOption { id: string; key: string; label: string; priceDelta: number }
interface EditGroup { key: string; label: string; inputType: string; options: EditOption[] }
interface EditRule { id: string; key: string; label: string; kind: string; calc: string; value: number }
type PricingMode = "FROM" | "QUOTE";

interface EditView {
  id: string;
  slug: string;
  name: string;
  pricingMode: PricingMode;
  basePrice: number;
  currency: string;
  typicalDuration: string | null;
  recurringDiscount: string | null;
  groups: EditGroup[];
  rules: EditRule[];
}

const MODE_HELP: Record<PricingMode, string> = {
  FROM: "Binding — customers pay the configured total when they book. Base price is the payable minimum AND the “from $X” listed on the site; add-on deltas can be $0 (free).",
  QUOTE: "Coordinator-priced — customers see the configured total as an indication only; you set the final amount on the Quotes page before they can pay.",
};

const c2d = (c: number) => (c / 100).toFixed(2);
const d2c = (s: string) => Math.round(Number(s) * 100);

export default function EditPricingPage() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [slug, setSlug] = useState("");
  const [view, setView] = useState<EditView | null>(null);
  const [mode, setMode] = useState<PricingMode>("FROM");
  const [basePrice, setBasePrice] = useState("");
  const [typicalDuration, setTypicalDuration] = useState("");
  const [recurringDiscount, setRecurringDiscount] = useState("");
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
      setMode(v.pricingMode);
      setBasePrice(c2d(v.basePrice));
      setTypicalDuration(v.typicalDuration ?? "");
      setRecurringDiscount(v.recurringDiscount ?? "");
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
      // Both modes carry the full base + add-ons pricing now: FROM charges it at
      // booking; QUOTE shows it as the indicative figure the coordinator starts from.
      const body: Record<string, unknown> = {
        pricingMode: mode,
        basePrice: d2c(basePrice),
        typicalDuration: typicalDuration.trim() || null,
        recurringDiscount: recurringDiscount.trim() || null,
        options: view.groups.flatMap((g) => g.options.map((o) => ({ id: o.id, priceDelta: d2c(optDeltas[o.id] ?? "0") }))),
        rules: view.rules.map((r) => ({
          id: r.id,
          value: r.calc === "percent" ? Number(ruleVals[r.id] ?? "0") : d2c(ruleVals[r.id] ?? "0"),
        })),
      };
      await api(`/admin/catalog/services/${view.slug}/pricing`, { method: "PUT", body });
      setNotice("Saved — live on the site within ~5 min.");
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

      {view && (
        <>
          <div className="ax-card" style={{ marginTop: 16 }}>
            <h3>{view.name}</h3>
            <p className="ax-muted" style={{ marginTop: 2 }}>
              Compare-table labels (shown on /pricing). Leave blank to hide.
            </p>
            <div className="ax-row" style={{ gap: 16, marginTop: 10 }}>
              <div className="ax-field" style={{ width: 200 }}>
                <label>Typical duration</label>
                <input className="ax-input" placeholder="e.g. 2–3 hrs" value={typicalDuration} onChange={(e) => setTypicalDuration(e.target.value)} />
              </div>
              <div className="ax-field" style={{ width: 200 }}>
                <label>Recurring discount</label>
                <input className="ax-input" placeholder="e.g. up to 15%" value={recurringDiscount} onChange={(e) => setRecurringDiscount(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="ax-card" style={{ marginTop: 12 }}>
            <h3>Pricing mode</h3>
            <div className="ax-row" style={{ gap: 8, marginTop: 10 }}>
              {(["FROM", "QUOTE"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`ax-btn sm${mode === m ? "" : " ghost"}`}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {m === "FROM" ? "FROM — pay at booking" : "QUOTE — coordinator priced"}
                </button>
              ))}
            </div>
            <p className="ax-muted" style={{ marginTop: 10 }}>{MODE_HELP[mode]}</p>
          </div>

          <div className="ax-card" style={{ marginTop: 12 }}>
            <div className="ax-row" style={{ gap: 16 }}>
              <div className="ax-field" style={{ width: 160 }}>
                <label>Base price ($)</label>
                <input className="ax-input" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
              </div>
            </div>
            <p className="ax-muted" style={{ marginTop: 8 }}>
              {mode === "FROM"
                ? "The one number: the minimum a customer pays AND the “from $X” the site lists. Add-on deltas below stack on top — keep each required group's cheapest option at $0 so the cheapest configuration costs exactly this. Set to $0 to list no from-price."
                : "Base price + add-ons below produce the indicative figure shown to the customer and next to the quote request — the final amount is whatever you set on the Quotes page."}
            </p>
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
            {busy ? "Saving…" : "Save"}
          </button>
        </>
      )}
    </>
  );
}

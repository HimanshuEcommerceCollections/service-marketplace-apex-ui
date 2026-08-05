"use client";

// The admin service editor for the Recurring/Plans pricing model. Sections:
// mode → base price + tax → Configurations (full group/option lifecycle) →
// Recurring (per-cadence % + on/off against the global cadence list).
//
// Entity operations (add group/option, toggle status, rename) commit
// immediately via their own endpoints and refresh the view; the number fields
// (mode, base, tax, duration, option deltas) batch into one "Save pricing" PUT.

import { useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

type PricingMode = "FROM" | "QUOTE";
type InputType = "SELECT" | "MULTISELECT" | "QUANTITY" | "TOGGLE" | "TEXTAREA";
type Status = "ACTIVE" | "INACTIVE";

interface ServiceOption { id: string; name: string; slug: string }
interface EditOption {
  id: string;
  key: string;
  label: string;
  sublabel: string | null;
  priceDelta: number;
  status: Status;
}
interface EditGroup {
  id: string;
  key: string;
  label: string;
  description: string | null;
  inputType: InputType;
  isRequired: boolean;
  quantityMin: number | null;
  quantityMax: number | null;
  unitLabel: string | null;
  unitPrice: number | null;
  status: Status;
  options: EditOption[];
}
interface RecurringRow {
  cadenceId: string;
  key: string;
  label: string;
  discountPercent: number;
  isActive: boolean;
}
interface EditView {
  id: string;
  slug: string;
  name: string;
  pricingMode: PricingMode;
  basePrice: number;
  taxRateBps: number;
  currency: string;
  typicalDuration: string | null;
  groups: EditGroup[];
  recurring: RecurringRow[];
}

const MODE_HELP: Record<PricingMode, string> = {
  FROM: "Binding — customers pay the configured total when they book. Base price is the payable minimum AND the “from $X” listed on the site.",
  QUOTE: "Coordinator-priced — customers see the configured total as an indication only; you set the final amount on the Quotes page before they can pay.",
};

const c2d = (c: number) => (c / 100).toFixed(2);
const d2c = (s: string) => Math.round(Number(s) * 100);

export default function EditPricingPage() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [slug, setSlug] = useState("");
  const [view, setView] = useState<EditView | null>(null);

  // pricing fields (batched into the PUT)
  const [mode, setMode] = useState<PricingMode>("FROM");
  const [basePrice, setBasePrice] = useState("");
  const [taxPct, setTaxPct] = useState("");
  const [typicalDuration, setTypicalDuration] = useState("");
  const [optDeltas, setOptDeltas] = useState<Record<string, string>>({});

  // recurring grid (its own PUT)
  const [rec, setRec] = useState<RecurringRow[]>([]);

  // new-configuration form
  const [gLabel, setGLabel] = useState("");
  const [gDesc, setGDesc] = useState("");
  const [gType, setGType] = useState<"SELECT" | "MULTISELECT" | "QUANTITY">("SELECT");
  const [gRequired, setGRequired] = useState(false);
  const [gUnitLabel, setGUnitLabel] = useState("");
  const [gUnitPrice, setGUnitPrice] = useState("");

  // per-group new-option drafts
  const [optDrafts, setOptDrafts] = useState<Record<string, { label: string; delta: string }>>({});

  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<ServiceOption[]>("/services").then(setServices).catch(() => setServices([]));
  }, []);

  function applyView(v: EditView) {
    setView(v);
    setMode(v.pricingMode);
    setBasePrice(c2d(v.basePrice));
    setTaxPct((v.taxRateBps / 100).toFixed(2));
    setTypicalDuration(v.typicalDuration ?? "");
    setOptDeltas(Object.fromEntries(v.groups.flatMap((g) => g.options.map((o) => [o.id, c2d(o.priceDelta)]))));
    setRec(v.recurring);
  }

  async function loadService(s: string) {
    setErr(null);
    setNotice(null);
    setSlug(s);
    setView(null);
    if (!s) return;
    try {
      applyView(await api<EditView>(`/admin/catalog/services/${s}`));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load service");
    }
  }

  /** Entity ops commit immediately and return the fresh view. */
  async function run(msg: string, fn: () => Promise<EditView>) {
    setErr(null);
    setNotice(null);
    try {
      applyView(await fn());
      setNotice(msg);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  async function savePricing() {
    if (!view) return;
    setBusy(true);
    setErr(null);
    setNotice(null);
    try {
      const body = {
        pricingMode: mode,
        basePrice: d2c(basePrice),
        taxRateBps: Math.round(Number(taxPct) * 100),
        typicalDuration: typicalDuration.trim() || null,
        options: view.groups.flatMap((g) =>
          g.options.map((o) => ({ id: o.id, priceDelta: d2c(optDeltas[o.id] ?? "0") })),
        ),
      };
      applyView(await api<EditView>(`/admin/catalog/services/${view.slug}/pricing`, { method: "PUT", body }));
      setNotice("Pricing saved — live on the site within ~5 min.");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveRecurring() {
    if (!view) return;
    await run("Recurring settings saved.", () =>
      api<EditView>(`/admin/catalog/services/${view.slug}/recurring`, {
        method: "PUT",
        body: { rows: rec.map((r) => ({ cadenceId: r.cadenceId, discountPercent: r.discountPercent, isActive: r.isActive })) },
      }),
    );
  }

  async function addGroup() {
    if (!view || !gLabel.trim()) return;
    await run("Configuration added.", () =>
      api<EditView>(`/admin/catalog/services/${view.slug}/groups`, {
        method: "POST",
        body: {
          label: gLabel.trim(),
          description: gDesc.trim() || null,
          inputType: gType,
          isRequired: gRequired,
          ...(gType === "QUANTITY"
            ? { unitLabel: gUnitLabel.trim(), unitPrice: d2c(gUnitPrice || "0"), quantityMin: 0, quantityMax: 99 }
            : {}),
        },
      }),
    );
    setGLabel("");
    setGDesc("");
    setGRequired(false);
    setGUnitLabel("");
    setGUnitPrice("");
  }

  const patchGroup = (g: EditGroup, body: Record<string, unknown>, msg: string) =>
    run(msg, () => api<EditView>(`/admin/catalog/services/${view!.slug}/groups/${g.id}`, { method: "PATCH", body }));

  const patchOption = (o: EditOption, body: Record<string, unknown>, msg: string) =>
    run(msg, () => api<EditView>(`/admin/catalog/services/${view!.slug}/options/${o.id}`, { method: "PATCH", body }));

  async function addOption(g: EditGroup) {
    const draft = optDrafts[g.id];
    if (!draft?.label.trim()) return;
    await run("Option added.", () =>
      api<EditView>(`/admin/catalog/services/${view!.slug}/groups/${g.id}/options`, {
        method: "POST",
        body: { label: draft.label.trim(), priceDelta: d2c(draft.delta || "0") },
      }),
    );
    setOptDrafts((d) => ({ ...d, [g.id]: { label: "", delta: "" } }));
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
          {/* ── Pricing mode ─────────────────────────────────────────── */}
          <div className="ax-card" style={{ marginTop: 16 }}>
            <h3>Pricing mode</h3>
            <div className="ax-row" style={{ gap: 8, marginTop: 10 }}>
              {(["FROM", "QUOTE"] as const).map((m) => (
                <button key={m} type="button" className={`ax-btn sm${mode === m ? "" : " ghost"}`} aria-pressed={mode === m} onClick={() => setMode(m)}>
                  {m === "FROM" ? "FROM — pay at booking" : "QUOTE — coordinator priced"}
                </button>
              ))}
            </div>
            <p className="ax-muted" style={{ marginTop: 10 }}>{MODE_HELP[mode]}</p>
          </div>

          {/* ── Base price + tax ─────────────────────────────────────── */}
          <div className="ax-card" style={{ marginTop: 12 }}>
            <div className="ax-row" style={{ gap: 16 }}>
              <div className="ax-field" style={{ width: 160 }}>
                <label>Base price ($)</label>
                <input className="ax-input" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
              </div>
              <div className="ax-field" style={{ width: 140 }}>
                <label>Tax (%)</label>
                <input className="ax-input" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} />
              </div>
              <div className="ax-field" style={{ width: 200 }}>
                <label>Typical duration</label>
                <input className="ax-input" placeholder="e.g. 2–3 hrs" value={typicalDuration} onChange={(e) => setTypicalDuration(e.target.value)} />
              </div>
            </div>
            <p className="ax-muted" style={{ marginTop: 8 }}>
              Base price is the minimum a customer pays AND the “from $X” the site lists ($0 = no from-price shown).
              Keep each required configuration&apos;s cheapest option at $0 so the cheapest set-up costs exactly the base.
              Tax is applied at checkout on the discounted total. “Recurring discount up to X%” on the site is derived
              automatically from the Recurring section below.
            </p>
          </div>

          {/* ── Configurations ───────────────────────────────────────── */}
          <div className="ax-card" style={{ marginTop: 12 }}>
            <h3>Configurations</h3>
            <p className="ax-muted" style={{ marginTop: 2 }}>
              Groups of options customers pick from. $0 options render as “Included”.
            </p>

            {view.groups.map((g) => (
              <div key={g.id} className="ax-card" style={{ marginTop: 10, background: "var(--bg, #fafafa)" }}>
                <div className="ax-row" style={{ gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <strong style={g.status === "INACTIVE" ? { opacity: 0.5, textDecoration: "line-through" } : undefined}>
                    {g.label}
                  </strong>
                  <span className="ax-badge muted">
                    {g.inputType === "SELECT" ? "choose one" : g.inputType === "MULTISELECT" ? "choose many" : g.inputType === "QUANTITY" ? `quantity · ${g.unitLabel ?? "per unit"} @ $${c2d(g.unitPrice ?? 0)}` : g.inputType.toLowerCase()}
                  </span>
                  {g.isRequired && <span className="ax-badge warn">required</span>}
                  <span style={{ marginLeft: "auto" }} className="ax-row">
                    <button className="ax-btn ghost sm" onClick={() => void patchGroup(g, { isRequired: !g.isRequired }, "Configuration updated.")}>
                      {g.isRequired ? "Make optional" : "Make required"}
                    </button>
                    <button className="ax-btn ghost sm" onClick={() => void patchGroup(g, { status: g.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }, "Configuration updated.")}>
                      {g.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </span>
                </div>
                {g.description && <p className="ax-muted" style={{ marginTop: 4 }}>{g.description}</p>}

                {(g.inputType === "SELECT" || g.inputType === "MULTISELECT") && (
                  <>
                    <table className="ax-table" style={{ marginTop: 8 }}>
                      <thead><tr><th>Option</th><th>Delta ($)</th><th></th></tr></thead>
                      <tbody>
                        {g.options.map((o) => (
                          <tr key={o.id} style={o.status === "INACTIVE" ? { opacity: 0.5 } : undefined}>
                            <td>
                              {o.label}
                              {(optDeltas[o.id] === "0.00" || optDeltas[o.id] === "0") && <span className="ax-badge ok" style={{ marginLeft: 8 }}>Included</span>}
                            </td>
                            <td>
                              <input className="ax-input" style={{ width: 110 }} value={optDeltas[o.id] ?? ""} onChange={(e) => setOptDeltas((m) => ({ ...m, [o.id]: e.target.value }))} />
                            </td>
                            <td>
                              <button className="ax-btn ghost sm" onClick={() => void patchOption(o, { status: o.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }, "Option updated.")}>
                                {o.status === "ACTIVE" ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="ax-row" style={{ gap: 8, marginTop: 8 }}>
                      <input
                        className="ax-input"
                        style={{ maxWidth: 220 }}
                        placeholder="New option label"
                        value={optDrafts[g.id]?.label ?? ""}
                        onChange={(e) => setOptDrafts((d) => ({ ...d, [g.id]: { label: e.target.value, delta: d[g.id]?.delta ?? "" } }))}
                      />
                      <input
                        className="ax-input"
                        style={{ width: 110 }}
                        placeholder="Delta $ (0 = incl.)"
                        value={optDrafts[g.id]?.delta ?? ""}
                        onChange={(e) => setOptDrafts((d) => ({ ...d, [g.id]: { label: d[g.id]?.label ?? "", delta: e.target.value } }))}
                      />
                      <button className="ax-btn sm" onClick={() => void addOption(g)}>Add option</button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* new configuration */}
            <div className="ax-card" style={{ marginTop: 14 }}>
              <h3 style={{ fontSize: 14 }}>Add configuration</h3>
              <div className="ax-row" style={{ gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                <input className="ax-input" style={{ maxWidth: 200 }} placeholder="Label (e.g. Add-ons)" value={gLabel} onChange={(e) => setGLabel(e.target.value)} />
                <input className="ax-input" style={{ maxWidth: 280 }} placeholder="Description (optional)" value={gDesc} onChange={(e) => setGDesc(e.target.value)} />
                <select className="ax-select" style={{ maxWidth: 170 }} value={gType} onChange={(e) => setGType(e.target.value as typeof gType)}>
                  <option value="SELECT">Choose one</option>
                  <option value="MULTISELECT">Choose many</option>
                  <option value="QUANTITY">Quantity (per unit)</option>
                </select>
                <label className="ax-row" style={{ gap: 6, alignItems: "center", fontSize: 13 }}>
                  <input type="checkbox" checked={gRequired} onChange={(e) => setGRequired(e.target.checked)} /> required
                </label>
                {gType === "QUANTITY" && (
                  <>
                    <input className="ax-input" style={{ width: 130 }} placeholder="Unit (per hour)" value={gUnitLabel} onChange={(e) => setGUnitLabel(e.target.value)} />
                    <input className="ax-input" style={{ width: 120 }} placeholder="Unit price $" value={gUnitPrice} onChange={(e) => setGUnitPrice(e.target.value)} />
                  </>
                )}
                <button className="ax-btn sm" onClick={() => void addGroup()}>Add</button>
              </div>
            </div>
          </div>

          {/* ── Recurring ────────────────────────────────────────────── */}
          <div className="ax-card" style={{ marginTop: 12 }}>
            <h3>Recurring</h3>
            <p className="ax-muted" style={{ marginTop: 2 }}>
              Which cadences this service offers, and the % off the configured total when a customer picks one — this is
              the discount mechanism. Manage the global cadence list under “Recurring cadences”.
            </p>
            <table className="ax-table" style={{ marginTop: 8 }}>
              <thead><tr><th>Cadence</th><th>Offered</th><th>Discount (%)</th></tr></thead>
              <tbody>
                {rec.map((r, i) => (
                  <tr key={r.cadenceId}>
                    <td>{r.label}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={r.isActive}
                        onChange={(e) => setRec((rows) => rows.map((x, xi) => (xi === i ? { ...x, isActive: e.target.checked } : x)))}
                      />
                    </td>
                    <td>
                      <input
                        className="ax-input"
                        style={{ width: 90 }}
                        value={String(r.discountPercent)}
                        onChange={(e) => setRec((rows) => rows.map((x, xi) => (xi === i ? { ...x, discountPercent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) } : x)))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="ax-btn sm" style={{ marginTop: 10 }} onClick={() => void saveRecurring()}>Save recurring</button>
          </div>

          <button className="ax-btn" style={{ marginTop: 16 }} onClick={() => void savePricing()} disabled={busy}>
            {busy ? "Saving…" : "Save pricing"}
          </button>
        </>
      )}
    </>
  );
}

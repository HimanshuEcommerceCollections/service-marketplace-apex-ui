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
import {
  DURATION_UNITS,
  EMPTY_DURATION,
  firstError,
  fromDurationDraft,
  money,
  optionalMoney,
  percent,
  previewDuration,
  toDurationDraft,
  wholeNumber,
  type DurationDraft,
  type DurationMode,
  type DurationUnit,
  type Parsed,
} from "../../lib/fields";

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
/** Editing shape for a recurring row — the percent stays a string until save. */
interface RecDraft {
  cadenceId: string;
  label: string;
  discount: string;
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

/** Inline field error. Renders nothing when the field parses. */
function Err({ of }: { of: Parsed<unknown> }) {
  return of.ok ? null : <span className="ax-err">{of.error}</span>;
}
/** Red border on a field that failed to parse. */
const bad = (r: Parsed<unknown>) => (r.ok ? "ax-input" : "ax-input bad");

export default function EditPricingPage() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [slug, setSlug] = useState("");
  const [view, setView] = useState<EditView | null>(null);

  // pricing fields (batched into the PUT)
  const [mode, setMode] = useState<PricingMode>("FROM");
  const [basePrice, setBasePrice] = useState("");
  const [taxPct, setTaxPct] = useState("");
  const [duration, setDuration] = useState<DurationDraft>(EMPTY_DURATION);
  const [optDeltas, setOptDeltas] = useState<Record<string, string>>({});

  // recurring grid (its own PUT). Percentages are held as raw strings so a typo
  // stays visible and blockable instead of collapsing to 0 on keystroke.
  const [rec, setRec] = useState<RecDraft[]>([]);

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
    setDuration(toDurationDraft(v.typicalDuration));
    setOptDeltas(Object.fromEntries(v.groups.flatMap((g) => g.options.map((o) => [o.id, c2d(o.priceDelta)]))));
    setRec(
      v.recurring.map((r) => ({
        cadenceId: r.cadenceId,
        label: r.label,
        discount: String(r.discountPercent),
        isActive: r.isActive,
      })),
    );
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

    // Parse before anything else: an unparsed field would reach the API as NaN
    // -> null -> silently coerced to 0, saving a zeroed price as a "success".
    const base = money(basePrice);
    const tax = percent(taxPct);
    const dur = fromDurationDraft(duration);
    if (!base.ok || !tax.ok || !dur.ok) {
      setNotice(null);
      setErr(firstError(base, tax, dur) ?? "Please fix the highlighted fields.");
      return;
    }
    const options: { id: string; priceDelta: number }[] = [];
    for (const g of view.groups) {
      for (const o of g.options) {
        const delta = optionalMoney(optDeltas[o.id] ?? "");
        if (!delta.ok) {
          setNotice(null);
          setErr(`“${o.label}” delta: ${delta.error}`);
          return;
        }
        options.push({ id: o.id, priceDelta: delta.value });
      }
    }

    setBusy(true);
    setErr(null);
    setNotice(null);
    try {
      const body = {
        pricingMode: mode,
        basePrice: base.value,
        taxRateBps: tax.value,
        typicalDuration: dur.value,
        options,
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
    const rows: { cadenceId: string; discountPercent: number; isActive: boolean }[] = [];
    for (const r of rec) {
      const pct = wholeNumber(r.discount, 0, 100);
      if (!pct.ok) {
        setNotice(null);
        setErr(`“${r.label}” discount: ${pct.error}`);
        return;
      }
      rows.push({ cadenceId: r.cadenceId, discountPercent: pct.value, isActive: r.isActive });
    }
    await run("Recurring settings saved.", () =>
      api<EditView>(`/admin/catalog/services/${view.slug}/recurring`, { method: "PUT", body: { rows } }),
    );
  }

  async function addGroup() {
    if (!view || !gLabel.trim()) return;
    // QUANTITY needs a real unit price — the server rejects the group otherwise.
    const unitPrice = optionalMoney(gUnitPrice);
    if (gType === "QUANTITY") {
      if (!gUnitLabel.trim()) {
        setErr("Quantity configurations need a unit label (e.g. “per hour”).");
        return;
      }
      if (!unitPrice.ok) {
        setErr(`Unit price: ${unitPrice.error}`);
        return;
      }
    }
    await run("Configuration added.", () =>
      api<EditView>(`/admin/catalog/services/${view.slug}/groups`, {
        method: "POST",
        body: {
          label: gLabel.trim(),
          description: gDesc.trim() || null,
          inputType: gType,
          isRequired: gRequired,
          ...(gType === "QUANTITY"
            ? { unitLabel: gUnitLabel.trim(), unitPrice: unitPrice.ok ? unitPrice.value : 0, quantityMin: 0, quantityMax: 99 }
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
    const delta = optionalMoney(draft.delta ?? "");
    if (!delta.ok) {
      setErr(`New option delta: ${delta.error}`);
      return;
    }
    await run("Option added.", () =>
      api<EditView>(`/admin/catalog/services/${view!.slug}/groups/${g.id}/options`, {
        method: "POST",
        body: { label: draft.label.trim(), priceDelta: delta.value },
      }),
    );
    setOptDrafts((d) => ({ ...d, [g.id]: { label: "", delta: "" } }));
  }

  // ── Derived validation ──────────────────────────────────────────────────────
  // One source of truth for the inline messages AND the Save buttons' disabled
  // state, so what the admin sees and what the form allows can never disagree.
  const baseR = money(basePrice);
  const taxR = percent(taxPct);
  const durR = fromDurationDraft(duration);
  const deltaR: Record<string, Parsed<number>> = Object.fromEntries(
    (view?.groups ?? []).flatMap((g) => g.options.map((o) => [o.id, optionalMoney(optDeltas[o.id] ?? "")])),
  );
  const pricingInvalid = !baseR.ok || !taxR.ok || !durR.ok || Object.values(deltaR).some((r) => !r.ok);

  const discountR: Record<string, Parsed<number>> = Object.fromEntries(
    rec.map((r) => [r.cadenceId, wholeNumber(r.discount, 0, 100)]),
  );
  const recurringInvalid = Object.values(discountR).some((r) => !r.ok);

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
            <div className="ax-row" style={{ gap: 16, alignItems: "flex-start" }}>
              <div className="ax-field" style={{ width: 160 }}>
                <label htmlFor="base-price">Base price ($)</label>
                <input
                  id="base-price"
                  className={bad(baseR)}
                  inputMode="decimal"
                  aria-invalid={!baseR.ok}
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
                <Err of={baseR} />
              </div>
              <div className="ax-field" style={{ width: 140 }}>
                <label htmlFor="tax-pct">Tax (%)</label>
                <input
                  id="tax-pct"
                  className={bad(taxR)}
                  inputMode="decimal"
                  aria-invalid={!taxR.ok}
                  value={taxPct}
                  onChange={(e) => setTaxPct(e.target.value)}
                />
                <Err of={taxR} />
              </div>
            </div>

            {/* Typical duration — composed, so the site's labels stay consistent. */}
            <div className="ax-field" style={{ marginTop: 4 }}>
              <label>Typical duration</label>
              <div className="ax-row" style={{ gap: 8 }}>
                {(
                  [
                    ["RANGE", "Range"],
                    ["APPROX", "Approx."],
                    ["CUSTOM", "Custom label"],
                  ] as const
                ).map(([m, text]) => (
                  <button
                    key={m}
                    type="button"
                    className={`ax-btn sm${duration.mode === m ? "" : " ghost"}`}
                    aria-pressed={duration.mode === m}
                    onClick={() => setDuration((d) => ({ ...d, mode: m as DurationMode }))}
                  >
                    {text}
                  </button>
                ))}
              </div>

              <div className="ax-row" style={{ gap: 8, marginTop: 8 }}>
                {duration.mode === "CUSTOM" ? (
                  <input
                    className={bad(durR)}
                    style={{ maxWidth: 260 }}
                    placeholder="e.g. Consultation, Varies, Per block"
                    value={duration.label}
                    onChange={(e) => setDuration((d) => ({ ...d, label: e.target.value }))}
                  />
                ) : (
                  <>
                    {duration.mode === "APPROX" && <span className="ax-hint">~</span>}
                    <input
                      className={bad(durR)}
                      style={{ width: 80 }}
                      inputMode="numeric"
                      placeholder={duration.mode === "RANGE" ? "min" : "approx"}
                      value={duration.min}
                      onChange={(e) => setDuration((d) => ({ ...d, min: e.target.value }))}
                    />
                    {duration.mode === "RANGE" && (
                      <>
                        <span className="ax-hint">to</span>
                        <input
                          className={bad(durR)}
                          style={{ width: 80 }}
                          inputMode="numeric"
                          placeholder="max"
                          value={duration.max}
                          onChange={(e) => setDuration((d) => ({ ...d, max: e.target.value }))}
                        />
                      </>
                    )}
                    <select
                      className="ax-select"
                      style={{ width: 100 }}
                      value={duration.unit}
                      onChange={(e) => setDuration((d) => ({ ...d, unit: e.target.value as DurationUnit }))}
                    >
                      {DURATION_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </>
                )}
                <span className="ax-hint">
                  Site shows: <strong>{previewDuration(duration)}</strong>
                </span>
              </div>
              <Err of={durR} />
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
                              <input
                                className={bad(deltaR[o.id] ?? { ok: true, value: 0 })}
                                style={{ width: 110 }}
                                inputMode="decimal"
                                value={optDeltas[o.id] ?? ""}
                                onChange={(e) => setOptDeltas((m) => ({ ...m, [o.id]: e.target.value }))}
                              />
                              {deltaR[o.id] && <Err of={deltaR[o.id]} />}
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
                        className={bad(discountR[r.cadenceId] ?? { ok: true, value: 0 })}
                        style={{ width: 90 }}
                        inputMode="numeric"
                        value={r.discount}
                        onChange={(e) => setRec((rows) => rows.map((x, xi) => (xi === i ? { ...x, discount: e.target.value } : x)))}
                      />
                      {discountR[r.cadenceId] && <Err of={discountR[r.cadenceId]} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="ax-btn sm" style={{ marginTop: 10 }} onClick={() => void saveRecurring()} disabled={recurringInvalid}>
              Save recurring
            </button>
          </div>

          <div className="ax-row" style={{ marginTop: 16, gap: 12 }}>
            <button className="ax-btn" onClick={() => void savePricing()} disabled={busy || pricingInvalid}>
              {busy ? "Saving…" : "Save pricing"}
            </button>
            {pricingInvalid && <span className="ax-err">Fix the highlighted fields to save.</span>}
          </div>
        </>
      )}
    </>
  );
}

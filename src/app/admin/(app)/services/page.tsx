"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

type Mode = "PRICED" | "FROM" | "QUOTE";

interface ServiceListItem {
  id: string;
  name: string;
  slug: string;
  pricingMode: Mode;
  fromPrice: number | null;
  currency: string;
  status: string;
  isRecurringEligible: boolean;
}

interface ConfigOption {
  key: string;
  label: string;
  sublabel: string | null;
  priceDelta: number;
}
interface ConfigGroup {
  key: string;
  label: string;
  inputType: "SELECT" | "MULTISELECT" | "QUANTITY" | "TOGGLE" | "TEXTAREA";
  isRequired: boolean;
  options: ConfigOption[];
}
interface ServiceConfig {
  slug: string;
  name: string;
  pricingMode: Mode;
  configGroups: ConfigGroup[];
}

interface Money {
  amount: number;
  currency: string;
}
interface LineItem {
  label: string;
  amount: Money;
  kind: string;
}
interface DisplayedPrice {
  total: Money;
  subtotal?: Money;
  line_items: LineItem[];
}
interface PricePreview {
  mode: Mode;
  displayed_price: DisplayedPrice | null;
  from_price: Money | null;
  is_from_band: boolean;
  requires_description: boolean;
}

const money = (m: Money | null | undefined) =>
  m ? `$${(m.amount / 100).toFixed(2)}` : "—";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceListItem[] | null>(null);
  const [selected, setSelected] = useState<ServiceConfig | null>(null);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [preview, setPreview] = useState<PricePreview | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pricing, setPricing] = useState(false);

  useEffect(() => {
    api<ServiceListItem[]>("/services")
      .then(setServices)
      .catch((e) => setErr(e instanceof ApiError ? e.message : "Failed to load services"));
  }, []);

  async function configure(slug: string) {
    setErr(null);
    setPreview(null);
    setSelections({});
    try {
      const cfg = await api<ServiceConfig>(`/services/${slug}/config`);
      setSelected(cfg);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load configurator");
    }
  }

  function setSelect(key: string, value: string) {
    setSelections((s) => ({ ...s, [key]: value }));
  }
  function toggleMulti(key: string, optKey: string) {
    setSelections((s) => {
      const cur = Array.isArray(s[key]) ? (s[key] as string[]) : [];
      return { ...s, [key]: cur.includes(optKey) ? cur.filter((k) => k !== optKey) : [...cur, optKey] };
    });
  }

  async function getPrice() {
    if (!selected) return;
    setErr(null);
    setPricing(true);
    try {
      const p = await api<PricePreview>(`/services/${selected.slug}/config/price`, {
        method: "POST",
        body: { selections, quantity: 1 },
      });
      setPreview(p);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Pricing failed");
    } finally {
      setPricing(false);
    }
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {services === null ? (
        <p className="ax-muted">Loading catalog…</p>
      ) : services.length === 0 ? (
        <div className="ax-card">
          <h3>No services yet</h3>
          <p>The catalog is empty — run <code>npm run prisma:seed</code> in the server to load the 11 services.</p>
        </div>
      ) : (
        <table className="ax-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Slug</th>
              <th>Mode</th>
              <th>From / base</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td className="ax-muted">{s.slug}</td>
                <td>
                  <span className={`ax-badge ${s.pricingMode === "QUOTE" ? "muted" : s.pricingMode === "FROM" ? "warn" : "ok"}`}>
                    {s.pricingMode}
                  </span>
                </td>
                <td>{s.fromPrice != null ? `From $${(s.fromPrice / 100).toFixed(0)}` : "—"}</td>
                <td>
                  <button className="ax-btn ghost sm" onClick={() => void configure(s.slug)}>
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <>
          <h2 className="ax-section-title">{selected.name} — live price tester</h2>
          <div className="ax-card">
            {selected.configGroups.map((g) => (
              <div className="ax-field" key={g.key}>
                <label>
                  {g.label} {g.isRequired && <span className="ax-muted">*</span>}
                </label>
                {g.inputType === "SELECT" && (
                  <select
                    className="ax-select"
                    value={(selections[g.key] as string) ?? ""}
                    onChange={(e) => setSelect(g.key, e.target.value)}
                  >
                    <option value="">— choose —</option>
                    {g.options.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label} {o.priceDelta ? `(+$${(o.priceDelta / 100).toFixed(0)})` : ""}
                      </option>
                    ))}
                  </select>
                )}
                {g.inputType === "MULTISELECT" && (
                  <div className="ax-row">
                    {g.options.map((o) => {
                      const checked = Array.isArray(selections[g.key]) && (selections[g.key] as string[]).includes(o.key);
                      return (
                        <label key={o.key} className="ax-row" style={{ gap: 6 }}>
                          <input type="checkbox" checked={checked} onChange={() => toggleMulti(g.key, o.key)} />
                          {o.label} {o.priceDelta ? `(+$${(o.priceDelta / 100).toFixed(0)})` : ""}
                        </label>
                      );
                    })}
                  </div>
                )}
                {g.inputType === "TEXTAREA" && (
                  <p className="ax-muted">Quote service — a pro provides a custom quote (no live price).</p>
                )}
              </div>
            ))}

            {selected.pricingMode !== "QUOTE" && (
              <button className="ax-btn" onClick={() => void getPrice()} disabled={pricing}>
                {pricing ? "Pricing…" : "Get live price"}
              </button>
            )}
          </div>

          {preview && (
            <div className="ax-card" style={{ marginTop: 16 }}>
              {preview.mode === "QUOTE" || !preview.displayed_price ? (
                <p className="ax-muted">This is a quote service — final pricing is confirmed by a pro.</p>
              ) : (
                <>
                  <div className="ax-lines">
                    {preview.displayed_price.line_items.map((li, i) => (
                      <div key={i}>
                        <span>{li.label}</span>
                        <span>{money(li.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="ax-lines" style={{ marginTop: 8 }}>
                    <div>
                      <span className="ax-total">Total</span>
                      <span className="ax-total">{money(preview.displayed_price.total)}</span>
                    </div>
                  </div>
                  {preview.is_from_band && preview.from_price && (
                    <p className="ax-muted" style={{ marginTop: 8 }}>
                      Shown as “From {money(preview.from_price)}” — final pricing confirmed by your pro.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

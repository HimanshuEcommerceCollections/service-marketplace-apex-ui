"use client";

import "../auth.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCustomerAuth } from "../(customer)/customer-auth";
import { api, ApiError } from "../lib/api-client";

type Mode = "PRICED" | "FROM" | "QUOTE";
interface Svc { id: string; name: string; slug: string; summary: string | null; pricingMode: Mode; fromPrice: number | null }
interface Opt { key: string; label: string; sublabel: string | null; priceDelta: number }
interface Grp { key: string; label: string; inputType: "SELECT" | "MULTISELECT" | "QUANTITY" | "TOGGLE" | "TEXTAREA"; isRequired: boolean; options: Opt[] }
interface Cfg { slug: string; name: string; pricingMode: Mode; configGroups: Grp[] }
interface Money { amount: number; currency: string }
interface Preview {
  mode: Mode;
  displayed_price: { total: Money; line_items: { label: string; amount: Money; kind: string }[] } | null;
  from_price: Money | null;
  requires_description: boolean;
}
type SubmitResult =
  | { outcome: "BOOKED"; reference: string; status: string }
  | { outcome: "WAITLISTED"; waitlist_signup: { zip: string } };

const money = (m: Money | null | undefined) => (m ? `$${(m.amount / 100).toFixed(2)}` : "—");
const STEPS: { key: string; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "configure", label: "Configure" },
  { key: "details", label: "Details" },
];

function Shell({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <div className="auth">
      <div className="bk-wrap">
        <div className="bk-head">
          <h1>Book a service</h1>
          <Link className="auth-linkbtn" href="/account">My account</Link>
        </div>
        <div className="bk-steps">
          {STEPS.map((s) => (
            <span key={s.key} className={`bk-step ${s.key === step ? "on" : ""}`}>{s.label}</span>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

export default function BookingFlow() {
  const { user, loading } = useCustomerAuth();
  const [step, setStep] = useState<"service" | "configure" | "details" | "done">("service");
  const [services, setServices] = useState<Svc[] | null>(null);
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ street: "", city: "", state: "NC", zip: "" });
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Svc[]>("/services").then(setServices).catch(() => setServices([]));
  }, []);
  useEffect(() => {
    if (user) setContact((c) => ({ ...c, name: c.name || user.name, email: c.email || user.email }));
  }, [user]);

  if (loading) return <Shell step="service"><p className="auth-muted">Loading…</p></Shell>;
  if (!user) {
    return (
      <Shell step="service">
        <div className="bk-panel">
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Sign in to book</h2>
          <p className="auth-muted">You need an Apex account to request a service.</p>
          <div className="bk-actions">
            <Link className="auth-btn" style={{ width: "auto", textDecoration: "none", display: "inline-block" }} href="/login">Sign in</Link>
            <Link className="bk-btn-ghost" style={{ textDecoration: "none", display: "inline-block" }} href="/signup">Create account</Link>
          </div>
        </div>
      </Shell>
    );
  }

  async function chooseService(slug: string) {
    setErr(null);
    setPreview(null);
    setSelections({});
    setDescription("");
    try {
      const c = await api<Cfg>(`/services/${slug}/config`);
      setCfg(c);
      setStep("configure");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load configurator");
    }
  }

  function setSelect(key: string, value: string) {
    setSelections((s) => ({ ...s, [key]: value }));
    setPreview(null);
  }
  function toggleMulti(key: string, optKey: string) {
    setSelections((s) => {
      const cur = Array.isArray(s[key]) ? (s[key] as string[]) : [];
      return { ...s, [key]: cur.includes(optKey) ? cur.filter((k) => k !== optKey) : [...cur, optKey] };
    });
    setPreview(null);
  }

  async function getPrice() {
    if (!cfg || cfg.pricingMode === "QUOTE") return;
    setErr(null);
    try {
      setPreview(await api<Preview>(`/services/${cfg.slug}/config/price`, { method: "POST", body: { selections } }));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Pricing failed");
    }
  }

  async function submit() {
    if (!cfg) return;
    if (!/^\d{5}$/.test(address.zip)) return setErr("Enter a valid 5-digit ZIP code.");
    setBusy(true);
    setErr(null);
    try {
      const r = await api<SubmitResult>("/bookings", {
        method: "POST",
        body: {
          service_type: cfg.slug,
          configuration: {
            selections,
            ...(cfg.pricingMode === "QUOTE" ? { description } : {}),
          },
          contact: { name: contact.name, email: contact.email, phone: contact.phone || undefined },
          address,
          request_id: crypto.randomUUID(),
          ...(preview?.displayed_price ? { displayed_price: { total: preview.displayed_price.total } } : {}),
        },
      });
      setResult(r);
      setStep("done");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell step={step === "done" ? "details" : step}>
      {err && <div className="auth-alert err">{err}</div>}

      {step === "service" && (
        services === null ? (
          <p className="auth-muted">Loading services…</p>
        ) : (
          <div className="bk-grid">
            {services.map((s) => (
              <button key={s.id} className="bk-service" onClick={() => void chooseService(s.slug)}>
                <h3>{s.name}</h3>
                <p>{s.summary}</p>
                <span className="from">{s.pricingMode === "QUOTE" ? "Free quote" : s.fromPrice != null ? `From $${(s.fromPrice / 100).toFixed(0)}` : "Live price"}</span>
              </button>
            ))}
          </div>
        )
      )}

      {step === "configure" && cfg && (
        <>
          <div className="bk-panel">
            <h2 style={{ marginTop: 0, fontSize: 18 }}>{cfg.name}</h2>
            {cfg.configGroups.map((g) => (
              <div className="auth-field" key={g.key}>
                <label>{g.label} {g.isRequired && <span className="auth-muted">*</span>}</label>
                {g.inputType === "SELECT" && (
                  <select className="auth-input" value={(selections[g.key] as string) ?? ""} onChange={(e) => setSelect(g.key, e.target.value)}>
                    <option value="">— choose —</option>
                    {g.options.map((o) => (
                      <option key={o.key} value={o.key}>{o.label}{o.priceDelta ? ` (+$${(o.priceDelta / 100).toFixed(0)})` : ""}</option>
                    ))}
                  </select>
                )}
                {g.inputType === "MULTISELECT" && (
                  <div className="bk-row">
                    {g.options.map((o) => {
                      const on = Array.isArray(selections[g.key]) && (selections[g.key] as string[]).includes(o.key);
                      return (
                        <label key={o.key} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <input type="checkbox" checked={on} onChange={() => toggleMulti(g.key, o.key)} />
                          {o.label}{o.priceDelta ? ` (+$${(o.priceDelta / 100).toFixed(0)})` : ""}
                        </label>
                      );
                    })}
                  </div>
                )}
                {g.inputType === "TEXTAREA" && (
                  <textarea className="auth-input" style={{ minHeight: 90 }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about your project (10+ characters)" />
                )}
              </div>
            ))}

            {cfg.pricingMode !== "QUOTE" && (
              <button className="bk-btn-ghost" onClick={() => void getPrice()}>Estimate price</button>
            )}
          </div>

          {preview?.displayed_price && (
            <div className="bk-panel">
              {preview.displayed_price.line_items.map((li, i) => (
                <div className="bk-line" key={i}><span>{li.label}</span><span>{money(li.amount)}</span></div>
              ))}
              <div className="bk-line bk-total"><span>{preview.mode === "FROM" ? "From" : "Estimated total"}</span><span>{money(preview.displayed_price.total)}</span></div>
              <p className="auth-muted" style={{ marginTop: 8 }}>{preview.mode === "PRICED" ? "Final total confirmed by your coordinator." : "Final pricing confirmed by your pro."}</p>
            </div>
          )}

          <div className="bk-actions">
            <button className="bk-btn-ghost" onClick={() => setStep("service")}>Back</button>
            <button className="auth-btn" style={{ width: "auto" }} onClick={() => setStep("details")}>Continue</button>
          </div>
        </>
      )}

      {step === "details" && cfg && (
        <>
          <div className="bk-panel">
            <h2 style={{ marginTop: 0, fontSize: 18 }}>Your details</h2>
            <div className="auth-field"><label>Name</label><input className="auth-input" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></div>
            <div className="auth-field"><label>Email</label><input className="auth-input" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
            <div className="auth-field"><label>Phone (optional)</label><input className="auth-input" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
            <div className="auth-field"><label>Street address</label><input className="auth-input" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} /></div>
            <div className="bk-row">
              <div className="auth-field" style={{ flex: "1 1 200px" }}><label>City</label><input className="auth-input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></div>
              <div className="auth-field" style={{ width: 80 }}><label>State</label><input className="auth-input" value={address.state} maxLength={2} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></div>
              <div className="auth-field" style={{ width: 120 }}><label>ZIP</label><input className="auth-input" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder="27513" /></div>
            </div>
          </div>
          <div className="bk-actions">
            <button className="bk-btn-ghost" onClick={() => setStep("configure")}>Back</button>
            <button className="auth-btn" style={{ width: "auto" }} onClick={() => void submit()} disabled={busy}>{busy ? "Submitting…" : "Confirm booking"}</button>
          </div>
        </>
      )}

      {step === "done" && result && (
        <div className="bk-panel">
          {result.outcome === "BOOKED" ? (
            <>
              <div className="auth-alert ok">Booking received!</div>
              <p>Your reference is <strong>{result.reference}</strong>. A coordinator will confirm shortly.</p>
              <p className="auth-foot"><Link href="/account">View my bookings →</Link></p>
            </>
          ) : (
            <>
              <div className="auth-alert ok">You&apos;re on the waitlist</div>
              <p className="auth-muted">We don&apos;t serve {result.waitlist_signup.zip} yet — we&apos;ll email you when we expand there.</p>
            </>
          )}
        </div>
      )}
    </Shell>
  );
}

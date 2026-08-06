"use client";

// Subscribe to a Plan: /subscribe?plan=<id>. Collects the job details
// (the service's configuration — describes the work, never the price: the
// plan's price is BINDING) plus the service address, then hands off to Stripe
// Checkout via POST /me/memberships. Reuses the /book design system (.pg-book).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SiteNav from "../../components/shared/SiteNav";
import SiteFooter from "../../components/shared/SiteFooter";
import { mountChrome } from "../../lib/shared/chrome";
import { useCustomerAuth } from "../lib/customer-auth";
import { api, ApiError } from "../lib/api-client";
import { Check, Lock, Arrow } from "../book/icons";

type SelectionValue = string | number | boolean | string[];

interface PlanView {
  id: string;
  name: string;
  interval: string;
  intervalCount: number;
  fromPrice: number | null;
  currency: string;
  bullets?: string[];
  service: { slug: string; name: string } | null;
}
interface Grp {
  key: string;
  label: string;
  description: string | null;
  inputType: "SELECT" | "MULTISELECT" | "QUANTITY" | "TOGGLE" | "TEXTAREA";
  isRequired: boolean;
  quantityMin: number | null;
  quantityMax: number | null;
  unitLabel: string | null;
  options: { key: string; label: string }[];
}
interface Cfg {
  slug: string;
  configGroups: Grp[];
}

const money = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

export default function SubscribeView() {
  const { user, loading } = useCustomerAuth();
  const params = useSearchParams();
  const planId = params.get("plan") ?? "";

  const [plan, setPlan] = useState<PlanView | null>(null);
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [selections, setSelections] = useState<Record<string, SelectionValue>>({});
  const [address, setAddress] = useState({ street: "", city: "", state: "NC", zip: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Missing ?plan= is knowable at render time — derived, not set in an effect.
  const [missing, setMissing] = useState(false);
  const notFound = !planId || missing;

  useEffect(() => mountChrome(), []);

  useEffect(() => {
    if (!planId) return;
    let active = true;
    api<PlanView[]>("/membership/plans")
      .then(async (plans) => {
        const p = plans.find((x) => x.id === planId) ?? null;
        if (!active) return;
        if (!p || !p.service) {
          setMissing(true);
          return;
        }
        setPlan(p);
        const c = await api<Cfg>(`/services/${p.service.slug}/config`);
        if (!active) return;
        // Seed required single-selects + quantity minimums so the strict
        // validation at subscribe has a complete starting point.
        const seed: Record<string, SelectionValue> = {};
        for (const g of c.configGroups) {
          if (g.inputType === "SELECT" && g.isRequired && g.options[0]) seed[g.key] = g.options[0].key;
          if (g.inputType === "QUANTITY") seed[g.key] = g.quantityMin ?? 1;
        }
        setSelections(seed);
        setCfg(c);
      })
      .catch(() => active && setMissing(true));
    return () => {
      active = false;
    };
  }, [planId]);

  const cadenceLabel = useMemo(() => {
    if (!plan) return "";
    if (plan.interval === "WEEK") return plan.intervalCount === 1 ? "every week" : `every ${plan.intervalCount} weeks`;
    if (plan.interval === "MONTH") return plan.intervalCount === 1 ? "every month" : `every ${plan.intervalCount} months`;
    return "";
  }, [plan]);

  const setValue = (key: string, v: SelectionValue) => setSelections((s) => ({ ...s, [key]: v }));
  const toggleMulti = (key: string, optKey: string) =>
    setSelections((s) => {
      const cur = Array.isArray(s[key]) ? (s[key] as string[]) : [];
      return { ...s, [key]: cur.includes(optKey) ? cur.filter((k) => k !== optKey) : [...cur, optKey] };
    });

  async function subscribe() {
    if (!plan) return;
    if (!address.street.trim() || !address.city.trim() || !/^\d{5}$/.test(address.zip)) {
      setErr("Please fill in the service address (5-digit ZIP).");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await api<{ checkout_url: string | null }>("/me/memberships", {
        method: "POST",
        body: { planId: plan.id, selections, address },
      });
      if (r.checkout_url) {
        window.location.assign(r.checkout_url);
        return; // navigating away — keep the button disabled
      }
      setErr("Checkout couldn't be started. Please try again.");
      setBusy(false);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Subscription failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="pg-book">
      <SiteNav />
      <div className="bk-wrap solo" style={{ alignContent: "start" }}>
        <div style={{ width: "100%", maxWidth: 640 }}>
          {loading ? (
            <div className="bk-gate" aria-busy="true">
              <div className="skel" style={{ height: 30, width: 220, margin: "0 auto" }} />
            </div>
          ) : !user ? (
            <div className="bk-gate">
              <span className="gi">
                <Lock />
              </span>
              <h2>Sign in to subscribe</h2>
              <p>You need an Apex account to start a plan.</p>
              <div className="cta-row">
                <Link className="btn btn-primary ripple" href={`/login?next=${encodeURIComponent(`/subscribe?plan=${planId}`)}`}>
                  Sign in <Arrow />
                </Link>
                <Link className="btn btn-line ripple" href="/signup">
                  Create account
                </Link>
              </div>
            </div>
          ) : notFound ? (
            <div className="bk-gate">
              <h2>Plan not found</h2>
              <p>This plan is no longer available.</p>
              <div className="cta-row">
                <Link className="btn btn-primary ripple" href="/membership-plans">
                  See current plans
                </Link>
              </div>
            </div>
          ) : !plan || !cfg ? (
            <div className="bk-gate" aria-busy="true">
              <div className="skel" style={{ height: 30, width: 260, margin: "0 auto" }} />
            </div>
          ) : (
            <>
              <div className="step-h" style={{ marginTop: 8 }}>
                <h2>{plan.name}</h2>
                <p>
                  {plan.service?.name} · billed {cadenceLabel} ·{" "}
                  <strong>{plan.fromPrice != null ? money(plan.fromPrice, plan.currency) : ""}</strong> + tax per cycle
                </p>
              </div>

              {(plan.bullets?.length ?? 0) > 0 && (
                <div className="quote-note" style={{ marginBottom: 18 }}>
                  <p>{plan.bullets!.join(" · ")}</p>
                </div>
              )}

              {err && (
                <div className="quote-note" role="alert" style={{ marginBottom: 18 }}>
                  <p>{err}</p>
                </div>
              )}

              <div className="cfg">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 16 }}>Your job details</h3>
                {cfg.configGroups
                  .filter((g) => g.inputType !== "TEXTAREA")
                  .map((g) => {
                    const v = selections[g.key];
                    return (
                      <div className="fld" key={g.key}>
                        <label>
                          {g.label}
                          {g.isRequired ? " *" : ""}
                        </label>
                        {g.inputType === "SELECT" && (
                          <div className="seg">
                            {g.options.map((o) => (
                              <button key={o.key} className={v === o.key ? "on" : ""} onClick={() => setValue(g.key, o.key)}>
                                {o.label}
                              </button>
                            ))}
                          </div>
                        )}
                        {g.inputType === "MULTISELECT" && (
                          <div className="checks">
                            {g.options.map((o) => {
                              const on = Array.isArray(v) && v.includes(o.key);
                              return (
                                <div key={o.key} className={`chk${on ? " on" : ""}`} onClick={() => toggleMulti(g.key, o.key)}>
                                  <span className="box">
                                    <Check />
                                  </span>
                                  <span className="t">{o.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {g.inputType === "QUANTITY" && (
                          <div className="stepper">
                            <button onClick={() => setValue(g.key, Math.max(g.quantityMin ?? 1, (typeof v === "number" ? v : 1) - 1))}>−</button>
                            <span className="val">{typeof v === "number" ? v : g.quantityMin ?? 1}</span>
                            <button onClick={() => setValue(g.key, Math.min(g.quantityMax ?? 20, (typeof v === "number" ? v : 1) + 1))}>+</button>
                          </div>
                        )}
                        {g.description && <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--slate4)" }}>{g.description}</p>}
                      </div>
                    );
                  })}
              </div>

              <div className="blk" style={{ marginTop: 16 }}>
                <h3>Service address</h3>
                <div className="form-grid">
                  <div className="ff full">
                    <input id="sub-street" placeholder=" " value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                    <label htmlFor="sub-street">Street address</label>
                  </div>
                  <div className="ff">
                    <input id="sub-city" placeholder=" " value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    <label htmlFor="sub-city">City</label>
                  </div>
                  <div className="ff">
                    <input id="sub-zip" placeholder=" " inputMode="numeric" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                    <label htmlFor="sub-zip">ZIP code</label>
                  </div>
                </div>
              </div>

              <div className="bk-nav">
                <Link className="btn btn-line ripple" href="/membership-plans">
                  Back to plans
                </Link>
                <button className="btn btn-primary ripple" onClick={() => void subscribe()} disabled={busy}>
                  {busy ? "Redirecting…" : "Continue to secure checkout"} <Arrow />
                </button>
              </div>
              <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--slate4)" }}>
                You&apos;ll confirm your card on Stripe&apos;s secure checkout. Cancel anytime. Billing stops at the period end.
              </p>
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

"use client";

// section: /book — the 5-step booking design (apex-booking.html) wired to the API.
//
// The design ships its own client-side price engine: a hardcoded SVC list of 11
// services, a FIELDS map of configurator controls, and a priceFor() that invents
// totals in the browser. None of that is used. Quoting a customer a number this
// page made up would be a real defect, so only the SKIN is ported — the services,
// the configurator groups and every price come from the server exactly as before:
//
//   GET  /services                        -> the step-1 cards
//   GET  /services/:slug/config           -> configGroups for step 2
//   POST /services/:slug/config/price     -> the live estimate (steps 2/3 + summary)
//   POST /bookings                        -> submit, with the same idempotency key
//
// Mapping the API's inputType onto the design's controls:
//   SELECT -> .seg pills   MULTISELECT -> .checks/.chk   QUANTITY -> .stepper
//   TOGGLE -> a single .chk   TEXTAREA -> .quote-note + textarea
//
// The design's step 4 collects property type, preferred date and time window, none
// of which exist in the booking schema — `configuration` is a closed Zod object, so
// putting them there would silently drop them. They go into the schema's top-level
// `notes` string instead, which is what actually reaches a coordinator.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SiteNav from "../../components/shared/SiteNav";
import SiteFooter from "../../components/shared/SiteFooter";
import { mountChrome } from "../../lib/shared/chrome";
import { useCustomerAuth } from "../lib/customer-auth";
import { api, ApiError } from "../lib/api-client";
import PayBooking from "../../components/payments/PayBooking";
import { SERVICE_ICON, Check, Arrow, Info, Lock } from "./icons";

type Mode = "FROM" | "QUOTE";
type InputType = "SELECT" | "MULTISELECT" | "QUANTITY" | "TOGGLE" | "TEXTAREA";
type SelectionValue = string | number | boolean | string[];

interface Svc {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  pricingMode: Mode;
  fromPrice: number | null;
}
interface Opt {
  key: string;
  label: string;
  sublabel: string | null;
  priceDelta: number;
}
interface Grp {
  key: string;
  label: string;
  description: string | null;
  inputType: InputType;
  isRequired: boolean;
  selectMin: number | null;
  selectMax: number | null;
  // QUANTITY groups: numeric bounds + the unit strategy (quantity × unitPrice).
  quantityMin: number | null;
  quantityMax: number | null;
  unitLabel: string | null;
  unitPrice: number | null;
  options: Opt[];
}
interface Cfg {
  slug: string;
  name: string;
  pricingMode: Mode;
  configGroups: Grp[];
}
interface Money {
  amount: number;
  currency: string;
}
interface Preview {
  mode: Mode;
  displayed_price: { total: Money; line_items: { label: string; amount: Money; kind: string }[] } | null;
  from_price: Money | null;
  requires_description: boolean;
}
/** A payment frequency the service offers (admin's Recurring grid). */
interface RecurringOption {
  cadenceId: string;
  key: string;
  label: string;
  discountPercent: number;
  isSubscription: boolean;
}
type SubmitResult =
  | { outcome: "BOOKED"; reference: string; status: string }
  | { outcome: "WAITLISTED"; waitlist_signup: { zip: string } }
  // A recurring frequency was chosen, so this is a subscription: Stripe
  // Checkout owns the rest and the first visit arrives from the webhook.
  | { outcome: "CHECKOUT"; checkout_url: string; membership_id: string };

const STEPS = ["Service", "Configure", "Pricing", "Details", "Confirm"] as const;
const PROP_TYPES = ["House", "Apartment", "Commercial"] as const;
const SLOTS = [
  { v: "Morning (8–11am)", label: "Morning" },
  { v: "Midday (11am–2pm)", label: "Midday" },
  { v: "Afternoon (2–5pm)", label: "Afternoon" },
  { v: "Flexible", label: "Flexible" },
] as const;

const dollars = (cents: number) => `$${Math.round(cents / 100).toLocaleString()}`;
const money = (m: Money | null | undefined) => (m ? dollars(m.amount) : "—");

/** Count-up on the big estimate figure; respects reduced motion. */
function useCountUp(target: number | null): string {
  const [shown, setShown] = useState(target ?? 0);
  const fromRef = useRef(0);
  useEffect(() => {
    if (target == null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    fromRef.current = target;
    if (reduce || from === target) {
      setShown(target);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / 900, 1);
      setShown(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return Math.round(shown).toLocaleString();
}

export default function BookingFlow() {
  const { user, loading } = useCustomerAuth();
  useEffect(() => mountChrome(), []);

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const [services, setServices] = useState<Svc[] | null>(null);
  const [cfg, setCfg] = useState<Cfg | null>(null);
  // Payment frequency: what the service offers, and which one is selected.
  // Anything other than one-time makes this booking a subscription.
  const [recOptions, setRecOptions] = useState<RecurringOption[]>([]);
  const [cadenceKey, setCadenceKey] = useState<string>("one-time");
  /** The selected frequency, or undefined for plain one-time. */
  const chosenCadence = recOptions.find((o) => o.key === cadenceKey && o.isSubscription);
  const [selections, setSelections] = useState<Record<string, SelectionValue>>({});
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [pricing, setPricing] = useState(false);

  // Contact fields are DERIVED from the session with per-field overrides rather than
  // copied into state by an effect: prefilling via setState would cascade a render
  // and need clobber-guards. `??` (not `||`) means clearing a field to "" sticks
  // instead of snapping back to the session value.
  const [edits, setEdits] = useState<Partial<Record<"first" | "last" | "email" | "phone", string>>>({});
  const [address, setAddress] = useState({ street: "", city: "", state: "NC", zip: "" });
  const [propType, setPropType] = useState<string>(PROP_TYPES[0]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [result, setResult] = useState<SubmitResult | null>(null);
  // FROM bookings pay at booking: true once the card settles in this session.
  const [paid, setPaid] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // A service load is in flight (step-1 cards disabled while it resolves).
  const [selecting, setSelecting] = useState(false);
  // The debounced preview is behind the current selections: submit is gated on
  // this so the echoed total always matches what the customer is looking at.
  const [priceStale, setPriceStale] = useState(false);

  // Idempotency key: one per wizard run, reused across retries (a failed submit
  // + retry must present the SAME id). Generated lazily on first submit to stay
  // SSR-safe; reset in restart() so "book another" gets a fresh id.
  const requestId = useRef<string | null>(null);
  // Request-epoch guard for chooseService: rapid card clicks race, and the
  // slower response must not overwrite the faster one's config/selections.
  const chooseEpoch = useRef(0);

  const params = useSearchParams();
  // Deep-link preselection (?service=/?plan=) runs once, after services load.
  const deepLinked = useRef(false);
  const wantPlan = useRef<string | null>(null);

  useEffect(() => {
    api<Svc[]>("/services")
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  const nameParts = (user?.name ?? "").trim().split(/\s+/).filter(Boolean);
  const contact = {
    first: edits.first ?? nameParts[0] ?? "",
    last: edits.last ?? nameParts.slice(1).join(" "),
    email: edits.email ?? user?.email ?? "",
    phone: edits.phone ?? "",
  };
  const setContactField = (k: "first" | "last" | "email" | "phone", v: string) =>
    setEdits((e) => ({ ...e, [k]: v }));

  const isQuote = cfg?.pricingMode === "QUOTE";

  // Live pricing, debounced: the design's step 3 and the sticky summary both read a
  // server total, replacing the old manual "Estimate price" button.
  useEffect(() => {
    // QUOTE never echoes a price, so it is never "stale" — clear the gate.
    if (!cfg || isQuote) {
      setPriceStale(false);
      return;
    }
    // Selections just changed: the current preview no longer matches them until
    // this run resolves. Cleared in .then when the fresh total lands.
    setPriceStale(true);
    let active = true;
    const t = setTimeout(() => {
      // Flipped inside the timeout, not the effect body: the indicator should track
      // the actual request, not the debounce window.
      setPricing(true);
      api<Preview>(`/services/${cfg.slug}/config/price`, {
        method: "POST",
        // The server applies the cadence discount — the estimate the customer
        // sees is the same number the booking recomputes, so no PRICE_MISMATCH.
        body: { selections, ...(chosenCadence ? { cadenceId: chosenCadence.cadenceId } : {}) },
      })
        .then((p) => {
          if (!active) return;
          setPreview(p);
          // This total now corresponds to the current selections.
          setPriceStale(false);
        })
        // A partial configuration legitimately fails validation while the user is
        // still choosing; keep the last good total rather than flashing an error.
        // Leave priceStale set: without a matching preview we echo no price.
        .catch(() => active && setPreview(null))
        .finally(() => active && setPricing(false));
    }, 350);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [cfg, isQuote, selections, chosenCadence]);

  // The API returns cents; the count-up animates whole dollars so the headline
  // figure matches the money()-formatted rows below it.
  const total = preview?.displayed_price ? Math.round(preview.displayed_price.total.amount / 100) : null;
  const counted = useCountUp(total);

  const chooseService = useCallback(async (slug: string) => {
    // Capture this call's epoch; a later click bumps the ref and every awaited
    // continuation below bails, so only the newest selection wins the state.
    const epoch = ++chooseEpoch.current;
    setErr(null);
    setPreview(null);
    setSelections({});
    setDescription("");
    setSelecting(true);
    try {
      const c = await api<Cfg>(`/services/${slug}/config`);
      if (chooseEpoch.current !== epoch) return;
      setCfg(c);
      // Frequencies are admin-controlled; a service offering none stays one-time.
      const detail = await api<{ recurringOptions?: RecurringOption[] }>(`/services/${slug}`).catch(() => null);
      if (chooseEpoch.current !== epoch) return;
      setRecOptions(detail?.recurringOptions ?? []);
      setCadenceKey("one-time");
      // Seed required single-selects with their first option so the first price
      // call is valid and the summary is not empty on arrival. Quantity groups
      // seed at their minimum (0 is legitimate — e.g. "Additional hours").
      const seed: Record<string, SelectionValue> = {};
      for (const g of c.configGroups) {
        if (g.inputType === "SELECT" && g.isRequired && g.options[0]) seed[g.key] = g.options[0].key;
        if (g.inputType === "QUANTITY") seed[g.key] = g.quantityMin ?? 1;
      }
      setSelections(seed);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      if (chooseEpoch.current !== epoch) return;
      setErr(e instanceof ApiError ? e.message : "Failed to load the configurator.");
    } finally {
      // Only the current epoch clears the flag; a superseded call leaves it set
      // for the winner to release.
      if (chooseEpoch.current === epoch) setSelecting(false);
    }
  }, []);

  const go = useCallback((n: number) => {
    if (n < 1 || n > 5) return;
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Deep-link preselection: CTAs across the site link to /book?service=<slug>
  // (optionally &plan=recurring). Runs once, after the cards load. An unknown
  // or missing ?service= leaves the wizard at the normal step 1.
  useEffect(() => {
    if (deepLinked.current || !services) return;
    deepLinked.current = true;
    const wantSlug = params.get("service");
    if (!wantSlug) return;
    const match = services.find((s) => s.slug === wantSlug);
    if (!match) return;
    // Plan is applied once the service's recurring options arrive (below).
    wantPlan.current = params.get("plan");
    void chooseService(match.slug);
  }, [services, params, chooseService]);

  // Apply a deep-linked ?plan= once the chosen service's frequencies load.
  // "recurring" picks the first subscription option; a specific key matches by
  // key. Consumed once; a normal (non-deep-linked) selection is a no-op.
  useEffect(() => {
    const want = wantPlan.current;
    if (!want || recOptions.length === 0) return;
    wantPlan.current = null;
    const opt =
      want === "recurring"
        ? recOptions.find((o) => o.isSubscription)
        : recOptions.find((o) => o.key === want && o.isSubscription);
    if (opt) setCadenceKey(opt.key);
  }, [recOptions]);

  const setValue = (key: string, v: SelectionValue) => setSelections((s) => ({ ...s, [key]: v }));
  const toggleMulti = (key: string, optKey: string) =>
    setSelections((s) => {
      const cur = Array.isArray(s[key]) ? (s[key] as string[]) : [];
      return { ...s, [key]: cur.includes(optKey) ? cur.filter((k) => k !== optKey) : [...cur, optKey] };
    });

  /** Human-readable selection lines for the summary and the review table. */
  const cfgLines = useMemo(() => {
    if (!cfg) return [];
    const out: [string, string][] = [];
    for (const g of cfg.configGroups) {
      const v = selections[g.key];
      if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) continue;
      if (typeof v === "number" && v === 0) continue; // 0-quantity adds nothing
      const labelOf = (k: string) => g.options.find((o) => o.key === k)?.label ?? k;
      if (Array.isArray(v)) out.push([g.label, v.map(labelOf).join(", ")]);
      else if (typeof v === "boolean") out.push([g.label, v ? "Yes" : "No"]);
      else if (typeof v === "number") out.push([g.label, String(v)]);
      else out.push([g.label, labelOf(v)]);
    }
    return out;
  }, [cfg, selections]);

  const FIELDS = ["first", "last", "email", "phone", "street", "city", "state", "zip"] as const;
  const fieldValue = (id: (typeof FIELDS)[number]) =>
    id === "first" || id === "last" || id === "email" || id === "phone"
      ? contact[id]
      : address[id as "street" | "city" | "state" | "zip"];

  const fieldError = (id: (typeof FIELDS)[number]): string | null => {
    const v = fieldValue(id).trim();
    if (id === "email") return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : "Enter a valid email";
    if (id === "phone") return v.replace(/\D/g, "").length >= 10 ? null : "Enter a valid phone";
    if (id === "zip") return /^\d{5}$/.test(v) ? null : "5-digit ZIP required";
    if (id === "state") return v.length === 2 ? null : "2-letter state";
    return v.length > 0 ? null : "Required";
  };
  const detailsValid = FIELDS.every((f) => fieldError(f) === null);

  async function submit() {
    if (!cfg || !agree) return;
    // Don't submit a stale total: if the debounced preview hasn't caught up to
    // the current selections, the echoed price would 422 (PRICE_MISMATCH). Wait
    // for the fetch to resolve (the button is disabled meanwhile too).
    if (!isQuote && priceStale) return;
    setBusy(true);
    setErr(null);
    // One idempotency key per wizard run, generated lazily (SSR-safe) and reused
    // so a failed submit + retry replays as the same request server-side.
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      // The server sends configuration.description only for QUOTE; a priced (FROM)
      // service 422s DESCRIPTION_NOT_ALLOWED if it carries one. requires_description
      // mirrors that (true only for QUOTE).
      const sendsDescription = isQuote || !!preview?.requires_description;
      // Property type / schedule have no home in `configuration` (closed schema) —
      // they ride in `notes`, which the coordinator actually reads. A TEXTAREA on a
      // priced service can't ride in description, so its text goes here too rather
      // than being dropped.
      const notes = [
        `Property type: ${propType}`,
        date ? `Preferred date: ${date}` : null,
        slot ? `Time window: ${slot}` : null,
        !sendsDescription && description.trim() ? `Project details: ${description.trim()}` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      const r = await api<SubmitResult>("/bookings", {
        method: "POST",
        body: {
          service_type: cfg.slug,
          configuration: {
            selections,
            ...(sendsDescription ? { description } : {}),
          },
          contact: {
            name: `${contact.first} ${contact.last}`.trim(),
            email: contact.email.trim(),
            phone: contact.phone.trim() || undefined,
          },
          address,
          // A recurring cadence turns this into a subscription server-side.
          ...(chosenCadence ? { cadence_id: chosenCadence.cadenceId } : {}),
          request_id: requestId.current,
          // Never echo a price for QUOTE: its preview total is indicative, and the
          // server 422s (QUOTE_PRICE_NOT_ALLOWED) if a client presents one as a price.
          ...(!isQuote && preview?.displayed_price ? { displayed_price: { total: preview.displayed_price.total } } : {}),
          notes,
        },
      });
      // A subscription doesn't finish here — Stripe Checkout collects the card
      // and the first visit is created by the invoice.paid webhook.
      if (r.outcome === "CHECKOUT") {
        window.location.assign(r.checkout_url);
        return; // navigating away — leave the button disabled
      }
      setResult(r);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Booking failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function restart() {
    setDone(false);
    setResult(null);
    setPaid(false);
    setCfg(null);
    setSelections({});
    setDescription("");
    setPreview(null);
    setAgree(false);
    setTouched({});
    // A brand-new booking gets a fresh idempotency key.
    requestId.current = null;
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const shellStep = done ? 5 : step;

  return (
    <div className="pg-book">
      <SiteNav />

      {/* Stepper and summary are gated on the session, not just hidden: a visitor
          who cannot book yet has no steps to walk and nothing to summarise. Keyed
          on `user` rather than `!loading` so neither flashes in and back out while
          the session is still resolving. */}
      {user && (
        <div className="bk-progress">
          <div className="steps">
            <div className="fill" style={{ width: `${((shellStep - 1) / 4) * 88}%` }} />
            {STEPS.map((label, i) => {
              const n = i + 1;
              const isDone = done || n < shellStep;
              return (
                <div
                  key={label}
                  className={`stepdot${n === shellStep && !done ? " active" : ""}${isDone ? " done" : ""}`}
                  onClick={() => isDone && !done && go(n)}
                >
                  <span className="c">{isDone ? <Check /> : n}</span>
                  <span className="l">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={`bk-wrap${user ? "" : " solo"}`}>
        <div className="bk-main">
          {err && (
            <div className="quote-note" role="alert" style={{ marginBottom: 20 }}>
              <Info />
              <p>{err}</p>
            </div>
          )}

          {/* The API rejects an anonymous booking, so ask up front rather than
              letting someone configure a request that cannot submit. */}
          {!loading && !user && (
            <div className="bk-gate">
              <span className="gi">
                <Lock />
              </span>
              <h2>Sign in to book</h2>
              <p>You need an Apex account to request a service.</p>
              <div className="cta-row">
                <Link className="btn btn-primary ripple" href="/login?next=%2Fbook">
                  Sign in <Arrow />
                </Link>
                <Link className="btn btn-line ripple" href="/signup">
                  Create account
                </Link>
              </div>
            </div>
          )}

          {loading && (
            <div className="bk-gate" aria-busy="true">
              <div className="skel" style={{ height: 64, width: 64, borderRadius: 18, margin: "0 auto 20px" }} />
              <div className="skel" style={{ height: 30, width: 220, margin: "0 auto 12px" }} />
              <div className="skel" style={{ height: 16, width: 280, margin: "0 auto" }} />
            </div>
          )}

          {!loading && user && !done && (
            <>
              {/* ---------- STEP 1: service ---------- */}
              <section className={`step${step === 1 ? " active" : ""}`}>
                <div className="step-h">
                  <h2>Choose your service</h2>
                  <p>Select the service you&apos;d like Apex to handle.</p>
                </div>
                {services === null ? (
                  <div className="svc-grid">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="skel" style={{ height: 168 }} />
                    ))}
                  </div>
                ) : (
                  <div className="svc-grid">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        className={`svc-card${cfg?.slug === s.slug ? " sel" : ""}`}
                        onClick={() => void chooseService(s.slug)}
                        disabled={selecting}
                      >
                        <span className="pick" />
                        <span className="svc-ic">{SERVICE_ICON(s.slug)}</span>
                        <h4>{s.name}</h4>
                        <p>{s.summary}</p>
                        <div className="svc-price">
                          {s.pricingMode === "QUOTE" ? (
                            "Custom Estimate"
                          ) : s.fromPrice != null ? (
                            <>
                              <small>from </small>
                              {dollars(s.fromPrice)}
                            </>
                          ) : (
                            "Live price"
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* ---------- STEP 2: configure ---------- */}
              <section className={`step${step === 2 ? " active" : ""}`}>
                <div className="step-h">
                  <h2>Configure your service</h2>
                  <p>Tell us the details so we can tailor your quote.</p>
                </div>
                <div className="cfg">
                  {isQuote && (
                    <div className="quote-note">
                      <Info />
                      <p>
                        This service is quoted after a quick review. Tell us about your project and a coordinator
                        will follow up with a tailored quote.
                      </p>
                    </div>
                  )}
                  {cfg?.configGroups.map((g) => {
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
                              <button
                                key={o.key}
                                className={v === o.key ? "on" : ""}
                                onClick={() => setValue(g.key, o.key)}
                              >
                                {o.label}
                                {o.priceDelta ? ` +${dollars(o.priceDelta)}` : ""}
                              </button>
                            ))}
                          </div>
                        )}

                        {g.inputType === "MULTISELECT" && (
                          <div className="checks">
                            {g.options.map((o) => {
                              const on = Array.isArray(v) && v.includes(o.key);
                              return (
                                <div
                                  key={o.key}
                                  className={`chk${on ? " on" : ""}`}
                                  onClick={() => toggleMulti(g.key, o.key)}
                                >
                                  <span className="box">
                                    <Check />
                                  </span>
                                  <span className="t">{o.label}</span>
                                  {o.priceDelta ? <span className="pr">{dollars(o.priceDelta)}</span> : null}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {g.inputType === "QUANTITY" && (
                          <div className="stepper">
                            {/* `?? bound` not `|| 1`: 0 is a legitimate quantity. */}
                            <button
                              onClick={() =>
                                setValue(g.key, Math.max(g.quantityMin ?? 1, (typeof v === "number" ? v : g.quantityMin ?? 1) - 1))
                              }
                              aria-label={`Decrease ${g.label}`}
                            >
                              −
                            </button>
                            <span className="val">
                              {typeof v === "number" ? v : g.quantityMin ?? 1}
                              {g.unitLabel ? <small style={{ fontSize: 11, fontWeight: 600, color: "var(--slate4)", marginLeft: 4 }}>{g.unitLabel.replace(/^per\s+/i, "")}{(typeof v === "number" ? v : 1) === 1 ? "" : "s"}</small> : null}
                            </span>
                            <button
                              onClick={() =>
                                setValue(g.key, Math.min(g.quantityMax ?? 20, (typeof v === "number" ? v : g.quantityMin ?? 1) + 1))
                              }
                              aria-label={`Increase ${g.label}`}
                            >
                              +
                            </button>
                          </div>
                        )}

                        {g.inputType === "TOGGLE" && (
                          <div className="checks">
                            <div
                              className={`chk${v === true ? " on" : ""}`}
                              onClick={() => setValue(g.key, v !== true)}
                            >
                              <span className="box">
                                <Check />
                              </span>
                              <span className="t">{g.label}</span>
                            </div>
                          </div>
                        )}

                        {g.inputType === "TEXTAREA" && (
                          <textarea
                            className="task"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell us about your project (10+ characters)"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="bk-nav">
                  <button className="btn btn-line ripple" onClick={() => go(1)}>
                    Back
                  </button>
                  <button className="btn btn-primary ripple" onClick={() => go(3)}>
                    Continue <Arrow />
                  </button>
                </div>
              </section>

              {/* ---------- STEP 3: pricing ---------- */}
              <section className={`step${step === 3 ? " active" : ""}`}>
                <div className="step-h">
                  <h2>Your estimate</h2>
                  <p>Live pricing based on your configuration. Final price confirmed on site.</p>
                </div>

                {/* Payment frequency — the ONE place a cadence is chosen. The
                    options and their discounts come from the admin's Recurring
                    grid, and the server applies the discount to the total. */}
                {recOptions.length > 1 && (
                  <div className="fld" style={{ marginBottom: 18 }}>
                    <label>Payment frequency</label>
                    <div className="seg">
                      {recOptions.map((o) => (
                        <button
                          key={o.cadenceId}
                          type="button"
                          className={cadenceKey === o.key ? "on" : ""}
                          onClick={() => setCadenceKey(o.key)}
                        >
                          {o.label}
                          {o.discountPercent > 0 && ` · −${o.discountPercent}%`}
                        </button>
                      ))}
                    </div>
                    <p style={{ marginTop: 8, fontSize: 12.5, color: "var(--slate4)" }}>
                      {chosenCadence
                        ? `Billed ${chosenCadence.label.toLowerCase()} — you'll confirm your card on Stripe's secure checkout, and can cancel anytime.`
                        : "A single visit, paid once when you book."}
                    </p>
                  </div>
                )}

                <div className="pcard">
                  <span className="glow" />
                  {isQuote || !preview?.displayed_price ? (
                    <>
                      <span className="lbl">Your estimate</span>
                      <div className="custom">{isQuote ? "Custom Estimate" : pricing ? "Pricing…" : "—"}</div>
                      <p style={{ position: "relative", color: "rgba(255,255,255,.75)", marginTop: 12, maxWidth: "38ch" }}>
                        {isQuote
                          ? "A coordinator will review your project details and send a tailored quote, usually within one business day."
                          : "Choose your options on the previous step to see a live estimate."}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="lbl">{preview.mode === "FROM" ? "Starting from" : "Estimated total"}</span>
                      <div className="amt">
                        $<span>{counted}</span>
                      </div>
                      <div className="rows">
                        <div className="r">
                          <span>Service</span>
                          <b>{cfg?.name}</b>
                        </div>
                        {cfgLines.map(([k, val]) => (
                          <div className="r" key={k}>
                            <span>{k}</span>
                            <b>{val}</b>
                          </div>
                        ))}
                        {preview.displayed_price.line_items.map((li, i) => (
                          <div className="r" key={i}>
                            <span>{li.label}</span>
                            <b>{money(li.amount)}</b>
                          </div>
                        ))}
                        <div className="r total">
                          <span>Total</span>
                          <b>{money(preview.displayed_price.total)}</b>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="bk-nav">
                  <button className="btn btn-line ripple" onClick={() => go(2)}>
                    Back
                  </button>
                  <button className="btn btn-primary ripple" onClick={() => go(4)}>
                    Continue <Arrow />
                  </button>
                </div>
              </section>

              {/* ---------- STEP 4: details ---------- */}
              <section className={`step${step === 4 ? " active" : ""}`}>
                <div className="step-h">
                  <h2>Contact &amp; address</h2>
                  <p>Where should we send your assigned professional?</p>
                </div>

                <div className="blk">
                  <h3>Personal information</h3>
                  <div className="form-grid">
                    <Field id="first" label="First name" autoComplete="given-name" value={contact.first} onChange={(v) => setContactField("first", v)} touched={touched} setTouched={setTouched} error={fieldError("first")} />
                    <Field id="last" label="Last name" autoComplete="family-name" value={contact.last} onChange={(v) => setContactField("last", v)} touched={touched} setTouched={setTouched} error={fieldError("last")} />
                    <Field id="email" label="Email address" type="email" autoComplete="email" full value={contact.email} onChange={(v) => setContactField("email", v)} touched={touched} setTouched={setTouched} error={fieldError("email")} />
                    <Field id="phone" label="Phone number" type="tel" autoComplete="tel" full value={contact.phone} onChange={(v) => setContactField("phone", v)} touched={touched} setTouched={setTouched} error={fieldError("phone")} />
                  </div>
                </div>

                <div className="blk">
                  <h3>Property address</h3>
                  <div className="form-grid">
                    <Field id="street" label="Street address" autoComplete="address-line1" full value={address.street} onChange={(v) => setAddress({ ...address, street: v })} touched={touched} setTouched={setTouched} error={fieldError("street")} />
                    <Field id="city" label="City" autoComplete="address-level2" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} touched={touched} setTouched={setTouched} error={fieldError("city")} />
                    <Field id="state" label="State" autoComplete="address-level1" maxLength={2} value={address.state} onChange={(v) => setAddress({ ...address, state: v.toUpperCase() })} touched={touched} setTouched={setTouched} error={fieldError("state")} />
                    <Field id="zip" label="ZIP code" inputMode="numeric" autoComplete="postal-code" value={address.zip} onChange={(v) => setAddress({ ...address, zip: v })} touched={touched} setTouched={setTouched} error={fieldError("zip")} />
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 10, color: "var(--ink)" }}>
                      Property type
                    </label>
                    <div className="prop-cards">
                      {PROP_TYPES.map((p) => (
                        <div key={p} className={`prop${propType === p ? " on" : ""}`} onClick={() => setPropType(p)}>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="blk">
                  <h3>Preferred schedule</h3>
                  <div className="form-grid">
                    <div className="ff">
                      <input id="dt" type="date" placeholder=" " value={date} onChange={(e) => setDate(e.target.value)} />
                      <label htmlFor="dt" style={{ top: 8, fontSize: 11, fontWeight: 700, color: "var(--bblue)" }}>
                        Preferred date
                      </label>
                      <div className="msg" />
                    </div>
                    <div className="full">
                      <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 8, color: "var(--ink)" }}>
                        Time window
                      </label>
                      <div className="slots">
                        {SLOTS.map((s) => (
                          <button key={s.v} className={slot === s.v ? "on" : ""} onClick={() => setSlot(s.v)}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bk-nav">
                  <button className="btn btn-line ripple" onClick={() => go(3)}>
                    Back
                  </button>
                  <button
                    className="btn btn-primary ripple"
                    onClick={() => {
                      setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])));
                      if (detailsValid) go(5);
                    }}
                  >
                    Continue <Arrow />
                  </button>
                </div>
              </section>

              {/* ---------- STEP 5: review ---------- */}
              <section className={`step${step === 5 ? " active" : ""}`}>
                <div className="step-h">
                  <h2>Review &amp; confirm</h2>
                  <p>One last look before we send it to your coordinator.</p>
                </div>
                <div className="rev">
                  <Row k="Service" v={cfg?.name ?? "—"} />
                  {cfgLines.map(([k, v]) => (
                    <Row key={k} k={k} v={v} />
                  ))}
                  <Row k="Estimated price" v={isQuote ? "Custom estimate" : money(preview?.displayed_price?.total)} />
                  <Row k="Name" v={`${contact.first} ${contact.last}`.trim()} />
                  <Row k="Email" v={contact.email} />
                  <Row k="Phone" v={contact.phone} />
                  <Row k="Address" v={[address.street, address.city, address.state, address.zip].filter(Boolean).join(", ")} />
                  <Row k="Property type" v={propType} />
                  <Row k="Preferred schedule" v={[date, slot].filter(Boolean).join(" · ") || "Flexible"} />
                </div>
                <label className={`agree${agree ? " on" : ""}`} onClick={() => setAgree((a) => !a)}>
                  <span className="box">
                    <Check />
                  </span>
                  <p>I understand final pricing may be confirmed by my assigned professional.</p>
                </label>
                <div className="bk-nav">
                  <button className="btn btn-line ripple" onClick={() => go(4)}>
                    Back
                  </button>
                  <button
                    className="btn btn-primary ripple"
                    onClick={() => void submit()}
                    disabled={!agree || busy || (!isQuote && priceStale)}
                  >
                    {busy ? "Submitting…" : !isQuote && priceStale ? "Updating price…" : "Submit booking request"}
                  </button>
                </div>
              </section>
            </>
          )}

          {/* ---------- PAYMENT (FROM: pay at booking) ---------- */}
          {done && result && result.outcome === "BOOKED" && result.status === "AWAITING_PAYMENT" && !paid && (
            <div className="success show" style={{ maxWidth: 640 }}>
              <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)" }}>Secure your booking</h2>
              <div className="bid">{result.reference}</div>
              <p>Your booking is reserved. Complete the payment to confirm it.</p>
              <div className="pay-pane">
                <PayBooking reference={result.reference} onPaid={() => setPaid(true)} />
              </div>
              <p className="auth-muted" style={{ marginTop: 14, fontSize: 13, color: "var(--slate4)" }}>
                Not ready? You can pay later from{" "}
                <Link href="/my-bookings" style={{ textDecoration: "underline" }}>
                  My Bookings
                </Link>{" "}
                — unpaid bookings cancel automatically after 24 hours.
              </p>
            </div>
          )}

          {/* ---------- SUCCESS ---------- */}
          {done && result && !(result.outcome === "BOOKED" && result.status === "AWAITING_PAYMENT" && !paid) && (
            <div className="success show">
              <div className="ill">
                <Check />
              </div>
              {result.outcome === "BOOKED" ? (
                <>
                  <h2>{paid ? "Payment received!" : "You're all set!"}</h2>
                  <div className="bid">{result.reference}</div>
                  <p>
                    {paid
                      ? "Your booking is paid and confirmed on our side. A coordinator will schedule your visit shortly."
                      : "We've received your booking request. Our coordinator will contact you shortly to confirm the final details."}
                  </p>
                  <div className="cta-row">
                    <Link className="btn btn-primary ripple" href="/my-bookings">
                      View my bookings <Arrow />
                    </Link>
                    <button className="btn btn-line ripple" onClick={restart}>
                      Book another service
                    </button>
                  </div>
                </>
              ) : result.outcome === "WAITLISTED" ? (
                <>
                  <h2>You&apos;re on the waitlist</h2>
                  <p>
                    We don&apos;t serve {result.waitlist_signup.zip} yet. We&apos;ll email you as soon as we
                    expand there.
                  </p>
                  <div className="cta-row">
                    <button className="btn btn-primary ripple" onClick={restart}>
                      Book another service
                    </button>
                    <Link className="btn btn-line ripple" href="/">
                      Return home
                    </Link>
                  </div>
                </>
              ) : null /* CHECKOUT redirects away before rendering */}
            </div>
          )}
        </div>

        {/* ---------- sticky summary ---------- */}
        {user && (
        <aside className="bk-side">
          <div className="sum">
            <h4>
              <Check />
              Booking summary
            </h4>
            <div className="prog">
              <i style={{ width: `${(shellStep / 5) * 100}%` }} />
            </div>
            {!cfg ? (
              <div className="empty">Select a service to get started.</div>
            ) : (
              <>
                <div className="srv">
                  <span className="ic">{SERVICE_ICON(cfg.slug)}</span>
                  <div>
                    <b>{cfg.name}</b>
                    <span>Step {shellStep} of 5</span>
                  </div>
                </div>
                {cfgLines.length > 0 && (
                  <div className="cfgsum">
                    {cfgLines.map(([k, v]) => (
                      <div className="cs" key={k}>
                        <span>{k}</span>
                        <b>{v}</b>
                      </div>
                    ))}
                  </div>
                )}
                <div className="tot">
                  <div className="est">
                    <span>{isQuote ? "Estimate" : preview?.mode === "FROM" ? "From" : "Estimated"}</span>
                    <b>{isQuote ? "Custom" : total != null ? dollars(total) : pricing ? "…" : "—"}</b>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rrow">
      <span>{k}</span>
      <b>{v || "—"}</b>
    </div>
  );
}

/** Floating-label field from the design (.ff), validated on blur then live. */
function Field({
  id,
  label,
  value,
  onChange,
  error,
  touched,
  setTouched,
  full,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  touched: Record<string, boolean>;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  full?: boolean;
  // Omit the DOM handlers this component owns, or the spread below would widen
  // onChange back to a ChangeEventHandler and fight the (v: string) signature.
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange" | "onBlur">) {
  const show = touched[id];
  const state = !show ? "" : error ? " err" : " ok";
  return (
    <div className={`ff${state}${full ? " full" : ""}`}>
      <input
        id={id}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, [id]: true }))}
        aria-invalid={show && error ? true : undefined}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>
      <div className="msg">{show && error ? error : ""}</div>
    </div>
  );
}

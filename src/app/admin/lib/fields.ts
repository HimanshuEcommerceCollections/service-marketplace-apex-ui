// Shared parsing + validation for the admin editors. Every numeric admin input
// goes through here, because the naive path is silently destructive: an input
// like "Apple" becomes Math.round(Number("Apple") * 100) === NaN, JSON.stringify
// turns NaN into null, and the API's z.coerce.number() coerces null to 0. The
// save then "succeeds" with the base price zeroed — which reads on the site as
// "no from-price". Parse here, block the save, and never send NaN.
//
// Limits mirror server/src/modules/catalog/catalog.validation.ts. Keep them in
// step: the server rejects what these accept only if it is stricter, and a
// mismatch surfaces as an opaque 400 instead of an inline message.

export const MAX_CENTS = 2_000_000; // $20,000 ceiling on any single amount
export const MAX_TAX_BPS = 2_000; // 20% ceiling on a service tax rate
export const MAX_DURATION_CHARS = 40; // Service.typicalDuration column cap

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

const ok = <T,>(value: T): Parsed<T> => ({ ok: true, value });
const bad = (error: string): Parsed<never> => ({ ok: false, error });

/** Tolerate what admins actually paste: "$1,499.00" -> "1499.00". */
const clean = (raw: string) => raw.trim().replace(/^\$/, "").replace(/,/g, "");

const DECIMAL = /^\d+(\.\d{1,2})?$/;
const WHOLE = /^\d+$/;

/** Dollars -> integer cents. Empty is an error; use `optionalMoney` to allow blank. */
export function money(raw: string, max = MAX_CENTS): Parsed<number> {
  const s = clean(raw);
  if (!s) return bad("Required");
  if (!DECIMAL.test(s)) return bad("Numbers only — e.g. 149 or 149.50");
  const cents = Math.round(Number(s) * 100);
  if (cents > max) return bad(`Max $${(max / 100).toLocaleString("en-US")}`);
  return ok(cents);
}

/** Blank counts as $0 — for "delta" fields where empty means "included". */
export function optionalMoney(raw: string, max = MAX_CENTS): Parsed<number> {
  return clean(raw) ? money(raw, max) : ok(0);
}

/** Percent -> basis points, e.g. "7.25" -> 725. */
export function percent(raw: string, maxBps = MAX_TAX_BPS): Parsed<number> {
  const s = clean(raw).replace(/%$/, "").trim();
  if (!s) return bad("Required");
  if (!DECIMAL.test(s)) return bad("Numbers only — e.g. 7.25");
  const bps = Math.round(Number(s) * 100);
  if (bps > maxBps) return bad(`Max ${maxBps / 100}%`);
  return ok(bps);
}

/** Plain integer within an inclusive range. */
export function wholeNumber(raw: string, min: number, max: number): Parsed<number> {
  const s = clean(raw);
  if (!s) return bad("Required");
  if (!WHOLE.test(s)) return bad("Whole numbers only");
  const n = Number(s);
  if (n < min || n > max) return bad(`Must be ${min}–${max}`);
  return ok(n);
}

/** First error in a set of parsed fields, or null when everything is valid. */
export function firstError(...results: Parsed<unknown>[]): string | null {
  for (const r of results) if (!r.ok) return r.error;
  return null;
}

// ── Typical duration ─────────────────────────────────────────────────────────
// Stored as the display string the site renders ("2–3 hrs"), so existing values
// and every consumer keep working. The draft below is only an editing shape:
// RANGE and APPROX compose a consistently formatted string, and CUSTOM carries
// the non-numeric labels ("Consultation", "Varies", "Per block") that a purely
// numeric widget would have destroyed.

export const DURATION_UNITS = ["min", "hrs", "days"] as const;
export type DurationUnit = (typeof DURATION_UNITS)[number];
export type DurationMode = "RANGE" | "APPROX" | "CUSTOM";

export interface DurationDraft {
  mode: DurationMode;
  min: string;
  max: string;
  unit: DurationUnit;
  label: string;
}

export const EMPTY_DURATION: DurationDraft = { mode: "RANGE", min: "", max: "", unit: "hrs", label: "" };

const UNITS = DURATION_UNITS.join("|");
// Accept en dash or hyphen on the way in; always write en dash on the way out.
const RANGE_RE = new RegExp(`^(\\d+)\\s*[–-]\\s*(\\d+)\\s*(${UNITS})$`);
const APPROX_RE = new RegExp(`^~\\s*(\\d+)\\s*(${UNITS})$`);

/** Reverse-parse a stored duration into the editing shape. */
export function toDurationDraft(stored: string | null): DurationDraft {
  const s = (stored ?? "").trim();
  if (!s) return { ...EMPTY_DURATION };

  const range = RANGE_RE.exec(s);
  if (range) return { mode: "RANGE", min: range[1], max: range[2], unit: range[3] as DurationUnit, label: "" };

  const approx = APPROX_RE.exec(s);
  if (approx) return { mode: "APPROX", min: approx[1], max: "", unit: approx[2] as DurationUnit, label: "" };

  return { ...EMPTY_DURATION, mode: "CUSTOM", label: s };
}

/** Compose the stored string. `null` means "no duration set" (a cleared field). */
export function fromDurationDraft(d: DurationDraft): Parsed<string | null> {
  if (d.mode === "CUSTOM") {
    const label = d.label.trim();
    if (!label) return ok(null);
    if (label.length > MAX_DURATION_CHARS) return bad(`Max ${MAX_DURATION_CHARS} characters`);
    return ok(label);
  }

  if (d.mode === "APPROX") {
    if (!d.min.trim()) return ok(null);
    const n = wholeNumber(d.min, 1, 999);
    if (!n.ok) return n;
    return ok(`~${n.value} ${d.unit}`);
  }

  // RANGE — both blank clears the field, one blank is an incomplete range.
  if (!d.min.trim() && !d.max.trim()) return ok(null);
  const lo = wholeNumber(d.min, 1, 999);
  if (!lo.ok) return lo;
  const hi = wholeNumber(d.max, 1, 999);
  if (!hi.ok) return hi;
  if (lo.value >= hi.value) return bad("The high end must be greater than the low end");
  return ok(`${lo.value}–${hi.value} ${d.unit}`);
}

/** What the site will show, for the live preview under the inputs. */
export function previewDuration(d: DurationDraft): string {
  const r = fromDurationDraft(d);
  if (!r.ok) return "—";
  return r.value ?? "not shown";
}

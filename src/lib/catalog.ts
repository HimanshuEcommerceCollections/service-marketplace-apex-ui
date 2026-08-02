// Server-side catalog reads for the marketing pages (RSC only). ISR-cached with
// a 300s TTL and tagged so an admin pricing change can bust them precisely via
// POST /api/revalidate -> revalidateTag('catalog') (doc 07 §8). These run at
// build/prerender and on revalidation; if the API is unreachable they resolve to
// null so pages fall back to their static content instead of failing the build.

import type { ServiceConfig, ServicePlan } from "../data/serviceContent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";
const TTL_SECONDS = 300;

export type PricingMode = "PRICED" | "FROM" | "QUOTE";

/** One "Recurring plans" card (service detail only; admin-controlled). */
export interface RecurringPlanView {
  id: string;
  name: string;
  freq: string;
  amount: string;
  unit: string | null;
  disc: string | null;
  best: boolean;
  cta: string;
}

export interface CatalogService {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  pricingMode: PricingMode;
  fromPrice: number | null; // integer cents
  currency: string;
  badges: string[];
  isRecurringEligible: boolean;
  typicalDuration: string | null; // e.g. "2–3 hrs"
  recurringDiscount: string | null; // e.g. "up to 15%"
  // Detail-only (GET /services/:slug): the service page's Recurring section.
  recurringHeading?: string | null;
  recurringPlans?: RecurringPlanView[];
}

export interface MembershipPlanView {
  id: string;
  key: string;
  name: string;
  description: string | null;
  interval: "WEEK" | "MONTH";
  intervalCount: number;
  fromPrice: number | null; // cents; display "from $X / visit" member price
  currency: string;
  service: { slug: string; name: string } | null;
}

export interface CoverageArea {
  id: string;
  name: string;
  slug: string;
  duration: string | null; // admin-controlled response-time label (e.g. "15 MIN")
  zipCodes: { zipCode: string; city: string | null; state: string | null }[];
}

async function catalogFetch<T>(path: string, tags: string[]): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: TTL_SECONDS, tags } });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T };
    return json?.data ?? null;
  } catch {
    return null; // marketing pages must render even when the API is down
  }
}

export function getServices(): Promise<CatalogService[] | null> {
  return catalogFetch<CatalogService[]>("/services", ["catalog"]);
}

export function getService(slug: string): Promise<CatalogService | null> {
  return catalogFetch<CatalogService>(`/services/${slug}`, ["catalog", `service:${slug}`]);
}

export function getMembershipPlans(): Promise<MembershipPlanView[] | null> {
  return catalogFetch<MembershipPlanView[]>("/membership/plans", ["catalog"]);
}

/** Active service areas + their ZIPs/cities (feeds the home Service Coverage section). */
export function getAreas(): Promise<CoverageArea[] | null> {
  return catalogFetch<CoverageArea[]>("/service-area/areas", ["coverage"]);
}

/** Whole-dollar label from integer cents, e.g. 14900 -> "$149". */
export function formatFromPrice(cents: number, currency = "USD"): string {
  const symbol = currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${Math.round(cents / 100)}`;
}

/** Live "from $X" label for a service, or undefined if it has no numeric from-price. */
export async function livePrice(slug: string): Promise<string | undefined> {
  const svc = await getService(slug);
  return svc?.fromPrice != null ? formatFromPrice(svc.fromPrice, svc.currency) : undefined;
}

/** A service page's Recurring section (admin-controlled), or null if none is configured. */
export interface RecurringSection {
  heading: string; // "" when the admin hasn't set one — callers fall back to their own copy
  plans: ServicePlan[];
}

/** Map the API's recurring cards to the shape the <Recurring/> component renders. */
function toRecurringPlans(svc: CatalogService): ServicePlan[] | null {
  if (!svc.recurringPlans?.length) return null;
  return svc.recurringPlans.map((p) => ({
    name: p.name,
    freq: p.freq,
    amount: p.amount,
    unit: p.unit ?? undefined,
    disc: p.disc ?? undefined,
    best: p.best || undefined,
    choose: p.cta,
  }));
}

/**
 * Overlay a shared <ServicePage/> config with live catalog data: the hero "from"
 * price and the whole Recurring section (heading + plans). Falls back to the
 * static content per-field when the API is down or a field isn't configured.
 */
export async function overlayServicePage(config: ServiceConfig, slug: string): Promise<ServiceConfig> {
  const svc = await getService(slug);
  if (!svc) return config;
  const hero =
    svc.fromPrice != null
      ? { ...config.content.hero, price: formatFromPrice(svc.fromPrice, svc.currency) }
      : config.content.hero;
  const plans = toRecurringPlans(svc);
  const recurring = plans ? { heading: svc.recurringHeading || config.recurring.heading, plans } : config.recurring;
  return { ...config, content: { ...config.content, hero }, recurring };
}

/**
 * Live Recurring section for a service by slug — used by the dedicated (non-shared)
 * pages (cleaning, lawn care) that keep their plans in the component. Returns null
 * so the page falls back to its hardcoded plans.
 */
export async function getRecurringSection(slug: string): Promise<RecurringSection | null> {
  const svc = await getService(slug);
  if (!svc) return null;
  const plans = toRecurringPlans(svc);
  return plans ? { heading: svc.recurringHeading ?? "", plans } : null;
}

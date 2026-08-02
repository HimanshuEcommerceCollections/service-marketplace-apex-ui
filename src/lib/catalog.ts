// Server-side catalog reads for the marketing pages (RSC only). ISR-cached with
// a 300s TTL and tagged so an admin pricing change can bust them precisely via
// POST /api/revalidate -> revalidateTag('catalog') (doc 07 §8). These run at
// build/prerender and on revalidation; if the API is unreachable they resolve to
// null so pages fall back to their static content instead of failing the build.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";
const TTL_SECONDS = 300;

export type PricingMode = "PRICED" | "FROM" | "QUOTE";

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

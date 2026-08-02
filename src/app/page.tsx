import type { Metadata } from 'next';
import './apex.css';
import './testimonials.css';
import ApexHome from '../components/apex/ApexHome';
import { chapters as staticChapters, type Chapter } from '../data/apex/chapters';
import { getServices, getAreas, formatFromPrice, type CatalogService, type CoverageArea } from '../lib/catalog';

export const metadata: Metadata = {
  title: 'Apex Total Home Services — One Call. Every Home Service.',
  description:
    'From cleaning and lawn care to smart home automation, security, painting, pool maintenance, and handyman services, Apex delivers every essential home service through one trusted team.',
  // Preserved from the source document (draft/preview experience).
  robots: { index: false, follow: false },
};

// Runs during HTML parse, before the hero paints: hides the intro-animated hero
// elements (via the .hero-preanim class + apex.css) so they don't flash in fully
// visible for a frame before GSAP — loaded lazily in mountApex — takes over and
// snaps them to their hidden start state. Guarded by the same window flag the
// runtime sets, so it only hides on the genuine first load, never on a
// client-side navigation back to home (where the intro no longer replays). A
// 2.5s timeout is a safety net so the text can never stay hidden.
const PREANIM_SCRIPT =
  "try{if(!window.__apexHeroIntroPlayed){var d=document.documentElement;" +
  "d.classList.add('hero-preanim');" +
  "setTimeout(function(){d.classList.remove('hero-preanim')},2500)}}catch(e){}";

// Overlay live from-prices onto the showcase chapters, keyed by slug. Only the
// numeric "$NNN" inside a price spec is swapped, preserving "from " / "/hr".
const DOLLAR = /\$\d[\d,]*/;
function overlayChapters(services: CatalogService[] | null): Chapter[] {
  const priceBySlug = new Map(
    (services ?? [])
      .filter((s) => s.fromPrice != null)
      .map((s) => [s.slug, formatFromPrice(s.fromPrice as number, s.currency)] as const),
  );
  return staticChapters.map((c) => {
    const label = priceBySlug.get(c.slug);
    if (!label) return c;
    return {
      ...c,
      specs: c.specs.map((sp) =>
        sp.num && DOLLAR.test(sp.value) ? { ...sp, value: sp.value.replace(DOLLAR, () => label) } : sp,
      ),
    };
  });
}

// The served cities, each labelled with its admin-set response time. An Area IS a
// city, so the list is the areas themselves -- NOT the cities on their ZIPs, which
// also include neighbouring postal towns a city's coverage happens to reach. The
// API returns active areas only, so deactivating a city drops it from the section.
function deriveTowns(areas: CoverageArea[] | null): { name: string; time: string }[] {
  const mins = (d: string) => {
    const n = parseInt(d, 10);
    return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
  };
  return (areas ?? [])
    .map((a) => ({ name: a.name, time: a.duration ?? '' }))
    .sort((x, y) => mins(x.time) - mins(y.time) || x.name.localeCompare(y.name));
}

export default async function Home() {
  // ISR-cached, tag-busted reads; both fall back to null (→ static content) if the API is down.
  const [services, areas] = await Promise.all([getServices(), getAreas()]);
  const chapters = overlayChapters(services);
  const towns = deriveTowns(areas);
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PREANIM_SCRIPT }} />
      <ApexHome
        chapters={chapters}
        towns={towns.length ? towns : undefined}
        townCount={towns.length || undefined}
      />
    </>
  );
}

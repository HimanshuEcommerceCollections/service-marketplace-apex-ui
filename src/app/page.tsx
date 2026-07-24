import type { Metadata } from 'next';
import './apex.css';
import './testimonials.css';
import ApexHome from '../components/apex/ApexHome';

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

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PREANIM_SCRIPT }} />
      <ApexHome />
    </>
  );
}

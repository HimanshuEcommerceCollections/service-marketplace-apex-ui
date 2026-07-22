/* eslint-disable @next/next/no-img-element */
// Shared site navbar — the home page's floating pill nav, reused across all pages.
// Styling comes from apex.css on the home page and from chrome.css elsewhere.
// Scroll state (.scrolled) is applied by whichever page runtime is active
// (mountApex on home, mountChrome elsewhere). Links are absolute so they work
// from any route; service items with a dedicated route link there, the rest to
// the home showcase.
import Link from 'next/link';

const services = [
  { label: 'Cleaning', href: '/services/house-cleaning' },
  { label: 'Lawn Care', href: '/services/lawncare' },
  { label: 'Power Washing', href: '/#showcase' },
  { label: 'Painting', href: '/#showcase' },
  { label: 'Junk Removal', href: '/#showcase' },
  { label: 'Pool', href: '/services/pool' },
  { label: 'Pest Control', href: '/services/pestcontrol' },
  { label: 'Home Security', href: '/#showcase' },
  { label: 'Smart Home', href: '/#showcase' },
  { label: 'Handyman', href: '/#showcase' },
  { label: 'Tree & Stump', href: '/#showcase' },
];

export default function SiteNav() {
  return (
    <>
      <nav className="nav" id="nav">
        <Link className="brand" href="/" aria-label="Apex Total Home Services home">
          <span className="bmark">
            <img className="apex-ico" src="/assets/images/image-1.png" alt="Apex" />
          </span>
          <span className="bname">
            Apex<small>Total Home</small>
          </span>
        </Link>
        <div className="navlinks">
          <span className="svc-dd">
            <Link href="/#showcase" className="has-dd">
              Services{' '}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Link>
            <div className="dd">
              {services.map((s, i) => (
                <Link key={i} href={s.href}>
                  {s.label}
                </Link>
              ))}
            </div>
          </span>
          <Link href="/#how">How it works</Link>
          <Link href="/#recurring">Plans</Link>
          <Link href="/#book">Pricing</Link>
          <Link href="/#coverage">Service area</Link>
          <Link href="/#book">For property managers</Link>
          <Link href="/#book" className="becomepro">
            Become a pro
          </Link>
          <Link className="nav-cta magnetic" href="/#book">
            Book now
          </Link>
        </div>
        <button className="navtoggle" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </nav>
      <div id="top" />
    </>
  );
}

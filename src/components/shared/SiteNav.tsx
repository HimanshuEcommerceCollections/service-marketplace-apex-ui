/* eslint-disable @next/next/no-img-element */
'use client';
// Shared site navbar — the home page's floating pill nav, reused across all pages.
// Styling comes from apex.css on the home page and from chrome.css elsewhere.
// Scroll state (.scrolled) is applied by whichever page runtime is active
// (mountApex on home, mountChrome elsewhere). Links are absolute so they work
// from any route; service items with a dedicated route link there, the rest to
// the home showcase.
//
// Mobile menu: <900px the desktop .navlinks are hidden (chrome.css/apex.css) and
// the .navtoggle hamburger opens a slide-down panel by adding `.open` to #nav
// (panel styling lives in the chrome sheets). The panel closes on route change
// (usePathname) and on any link tap.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const services = [
  { label: 'Cleaning', href: '/services/house-cleaning' },
  { label: 'Lawn Care', href: '/services/lawncare' },
  { label: 'Power Washing', href: '/services/power-washing' },
  { label: 'Painting', href: '/services/painting' },
  { label: 'Junk Removal', href: '/services/junk-removal' },
  { label: 'Pool', href: '/services/pool' },
  { label: 'Pest Control', href: '/services/pest-control' },
  { label: 'Home Security', href: '/services/home-security' },
  { label: 'Smart Home', href: '/services/smart-home' },
  { label: 'Handyman', href: '/services/handyman' },
  { label: 'Tree & Stump', href: '/services/tree-stump' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile panel whenever the route changes (client navigation).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={`nav${open ? ' open' : ''}`} id="nav">
        <Link className="brand" href="/" aria-label="Apex Total Home Services home" onClick={close}>
          <span className="bmark">
            <img className="apex-ico" src="/assets/images/image-1.png" alt="Apex" />
          </span>
          <span className="bname">
            Apex<small>Total Home</small>
          </span>
        </Link>
        <div className="navlinks">
          <span className="svc-dd">
            <Link href="/#showcase" className="has-dd" onClick={close}>
              Services{' '}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Link>
            <div className="dd">
              {services.map((s, i) => (
                <Link key={i} href={s.href} onClick={close}>
                  {s.label}
                </Link>
              ))}
            </div>
          </span>
          <Link href="/#how" onClick={close}>How it works</Link>
          <Link href="/membership-plans" onClick={close}>Plans</Link>
          <Link href="/membership-plans" onClick={close}>Pricing</Link>
          <Link href="/#coverage" onClick={close}>Service area</Link>
          <Link href="/#showcase" onClick={close}>For property managers</Link>
          <Link href="/book" className="becomepro" onClick={close}>
            Become a pro
          </Link>
          <Link className="nav-cta magnetic" href="/book" onClick={close}>
            Book now
          </Link>
        </div>
        <button
          className="navtoggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>
      <div id="top" />
    </>
  );
}

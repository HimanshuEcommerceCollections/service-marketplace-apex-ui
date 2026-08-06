/* eslint-disable @next/next/no-img-element */
// Shared site footer — the home page's premium footer, reused across all pages.
// Styling comes from apex.css on home and chrome.css elsewhere. The .fv2 reveal
// is driven by gsap on home (mountApex) and by the .in class elsewhere (mountChrome).
// Links are absolute so they work from any route.
import Link from 'next/link';

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const servicesCol = [
  { label: 'Home Cleaning', href: '/services/house-cleaning' },
  { label: 'Lawn Care', href: '/services/lawncare' },
  { label: 'Power Washing', href: '/services/power-washing' },
  { label: 'Painting', href: '/services/painting' },
  { label: 'Junk Removal', href: '/services/junk-removal' },
  { label: 'Pool Service', href: '/services/pool' },
];
const moreCol = [
  { label: 'Pest Control', href: '/services/pest-control' },
  { label: 'Home Security', href: '/services/home-security' },
  { label: 'Smart Home', href: '/services/smart-home' },
  { label: 'Handyman', href: '/services/handyman' },
  { label: 'Tree & Stump', href: '/services/tree-stump' },
];
const companyCol = [
  { label: 'About', href: '/#hero' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Plans', href: '/membership-plans' },
  { label: 'Service area', href: '/service-area' },
  { label: 'Property managers', href: '/property-managers' },
  { label: 'Become a pro', href: '/become-a-pro' },
  { label: 'FAQ', href: '/#faq' },
];

export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="foot-ambient a" />
      <div className="foot-ambient b" />
      <div className="foot-cta fv2">
        <div>
          <h3>One call. Whole house handled.</h3>
          <p>Book a trusted pro in minutes: cleaning, lawn, repairs and more, all under one roof.</p>
        </div>
        <div className="foot-cta-side">
          <Link className="foot-cta-btn magnetic" href="/book">
            Book now <Arrow />
          </Link>
          <form className="foot-news" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={'Home tips & seasonal offers'} aria-label="Email" />
            <button type="submit" aria-label="Subscribe">
              <Arrow />
            </button>
          </form>
        </div>
      </div>

      <div className="foot-grid">
        <div className="foot-brand fv2">
          <Link className="fbrand" href="/">
            <span className="fmark">
              <img className="apex-ico" src="/assets/images/image-16.png" alt="Apex" />
            </span>
            <span className="fname">
              Apex<small>Total Home</small>
            </span>
          </Link>
          <p>
            Premium home services, professionally delivered. Locally owned, fully insured, and backed
            by our satisfaction guarantee.
          </p>
          <div className="foot-social">
            <a href="#top" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#top" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v6h3v-6H16l.5-3h-3V9.5C13.5 9.2 13.7 9 14 9z" />
              </svg>
            </a>
            <a href="#top" aria-label="X">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 3h3l-6.6 7.6L21.8 21h-5.9l-4.2-5.6L6.7 21H3.7l7-8.1L2.5 3h6l3.8 5.1L17.5 3zm-1 16h1.6L8 4.7H6.3L16.5 19z" />
              </svg>
            </a>
            <a href="#top" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.6 7.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 4 12 4 12 4s-4 0-6.8.3c-.4.1-1.3.1-2 .9-.6.6-.8 2-.8 2S2 8.8 2 10.4v1.2c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.8 1.7.8 2.1.9C6.7 19.7 12 20 12 20s4 0 6.8-.3c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.2c0-1.6-.2-3.2-.2-3.2zM10 14.5v-5l4.3 2.5-4.3 2.5z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="foot-cols fv2">
          <div>
            <h4>Services</h4>
            {servicesCol.map((l, i) => (
              <Link key={i} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>More</h4>
            {moreCol.map((l, i) => (
              <Link key={i} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>Company</h4>
            {companyCol.map((l, i) => (
              <Link key={i} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="foot-mark" aria-hidden="true">
        APEX
      </div>

      <div className="foot-bar">
        <span>&copy; 2026 Apex Total Home Services · Wake County, NC</span>
        <span className="foot-badges">Licensed · Bonded · Insured</span>
        <span>
          <a href="#top">Privacy</a> · <a href="#top">Terms</a>
        </span>
      </div>
    </footer>
  );
}

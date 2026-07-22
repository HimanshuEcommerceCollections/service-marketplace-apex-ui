/* eslint-disable @next/next/no-img-element */
// section: HERO — copy + mosaic (big film cell + 7 photo tiles in grid slots
// m1–m5, l1, l2). Media (src/alt) comes from data/cleaning/media.
import Link from 'next/link';
import { heroVideo, heroTiles } from '../../data/cleaning/media';

const SLOTS = ['m1', 'm2', 'm3', 'm4', 'm5', 'l1', 'l2'];

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <div className="hero-copy">
          <div className="crumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/#showcase">Services</Link> &nbsp;/&nbsp; Cleaning
          </div>
          <span className="eyebrow">Cleaning</span>
          <h1>
            A spotless home,
            <br />
            <em>on your schedule.</em>
          </h1>
          <p className="lede">
            Recurring or one-time cleans, priced by beds and baths, handled by the same trusted team every visit.
          </p>
          <div className="hero-badges">
            <span className="pill">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z" />
              </svg>
              4.9 (1.2k reviews)
            </span>
            <span className="pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Vetted &amp; insured
            </span>
            <span className="pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              ~90-sec booking
            </span>
          </div>
          <div className="hero-price">
            <div className="pbadge">
              <span className="lbl">Priced from</span>
              <span className="val">
                <small>from </small>$129
              </span>
            </div>
          </div>
          <div className="hero-cta">
            <a className="btn btn-primary" href="/book?service=cleaning">
              Book now{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn btn-ghost" href="#configure">
              Estimate my price
            </a>
          </div>
        </div>
        <div className="hero-mosaic reveal">
          <div className="m big">
            <video autoPlay muted loop playsInline preload="auto">
              <source src={heroVideo.src} type="video/mp4" />
            </video>
          </div>
          {heroTiles.map((t, i) => (
            <div key={i} className={`m ${SLOTS[i]}`}>
              <img src={t.src} alt={t.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

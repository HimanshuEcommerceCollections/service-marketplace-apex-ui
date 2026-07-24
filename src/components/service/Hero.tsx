/* eslint-disable @next/next/no-img-element */
// Shared service HERO — copy column + mosaic (big cell + 7 photo tiles in grid
// slots m1–m5, l1, l2). Fully data-driven from HeroContent. The big cell renders
// a <video> or <img> from bigMedia.type — the only structural variation.
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { HeroContent, HeroBadgeIcon } from '../../data/serviceContent';

const SLOTS = ['m1', 'm2', 'm3', 'm4', 'm5', 'l1', 'l2'];

const BADGE_ICON: Record<HeroBadgeIcon, ReactNode> = {
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
};

export default function Hero({ content }: { content: HeroContent }) {
  const c = content;
  return (
    <header className="hero">
      <div className="wrap">
        <div className="hero-copy">
          <div className="crumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/#showcase">Services</Link> &nbsp;/&nbsp; {c.breadcrumb}
          </div>
          <span className="eyebrow">{c.eyebrow}</span>
          <h1>
            {c.titleLead}
            <br />
            <em>{c.titleEm}</em>
          </h1>
          <p className="lede">{c.description}</p>
          <div className="hero-badges">
            {c.badges.map((b, i) => (
              <span className="pill" key={i}>
                {BADGE_ICON[b.icon]}
                {b.label}
              </span>
            ))}
          </div>
          <div className="hero-price">
            <div className="pbadge">
              <span className="lbl">{c.priceLabel}</span>
              <span className="val">
                <small>from </small>
                {c.price}
              </span>
            </div>
          </div>
          <div className="hero-cta">
            <a className="btn btn-primary" href={`/book?service=${c.bookingSlug}`}>
              {c.ctaPrimary}{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn btn-ghost" href="#configure">
              {c.ctaSecondary}
            </a>
          </div>
        </div>
        <div className="hero-mosaic reveal">
          <div className="m big">
            {c.bigMedia.type === 'video' ? (
              <video autoPlay muted loop playsInline preload="auto">
                <source src={c.bigMedia.src} type="video/mp4" />
              </video>
            ) : (
              <img src={c.bigMedia.src} alt={c.bigMedia.alt} loading="eager" />
            )}
          </div>
          {c.tiles.map((t, i) => (
            <div key={i} className={`m ${SLOTS[i]}`}>
              <img src={t.src} alt={t.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

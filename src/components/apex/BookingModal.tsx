'use client';

// Booking is no longer an inline homepage section — it opens as a modal overlay
// when any "Book" CTA is clicked. The wizard markup (children = <Booking/> with
// #book) is always in the DOM (so the runtime's bookingInit can build it); this
// component only controls the overlay's open/closed state.
//
// Any <a href="#book"> or <a href="/#book"> anywhere on the page opens it — caught
// with a capture-phase listener so it also pre-empts the Lenis smooth-scroll and
// Next <Link> navigation those CTAs would otherwise do. Landing on /#book (e.g.
// navigated in from another page) opens it on mount too.

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export default function BookingModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openModal = () => setOpen(true);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '#book' || href === '/#book') {
        e.preventDefault();
        e.stopPropagation(); // pre-empt Lenis anchor-scroll + Next <Link> nav
        openModal();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey);
    if (typeof location !== 'undefined' && location.hash === '#book') openModal();

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Lock background scroll while open.
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.style.overflow = 'hidden';
    else root.style.overflow = '';
    return () => {
      root.style.overflow = '';
    };
  }, [open]);

  return (
    <div className={`book-modal${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="book-modal-backdrop" onClick={() => setOpen(false)} />
      <div className="book-modal-dialog" role="dialog" aria-modal="true" aria-label="Book your service">
        <button className="book-modal-close" aria-label="Close" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

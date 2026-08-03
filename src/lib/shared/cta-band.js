/* eslint-disable */
// Shared closing-CTA behaviour for components/shared/CtaBand.tsx.
//
// Extracted from the home page's mountApex, which used to own all of this, and
// from the near-duplicate copies that lived in lib/service/runtime.js and
// lib/membership/runtime.js. Sibling of mountChrome() in ./chrome.js — call it
// from a page's useEffect and compose the returned teardown with the others.
//
// Two things:
//   1. Play the background film only while the band is on screen. The <video>
//      deliberately carries no `autoplay` attribute, so nothing decodes until
//      the user actually scrolls to the section — the old service/membership
//      copies played on mount and never paused, decoding a ~600KB loop for the
//      whole session on 12 routes.
//   2. The cursor keyhole: track the pointer and part the tint overlay under it.
//
// Deliberately GSAP-free (only the home page loads GSAP). The section's reveal
// is left to whatever `.reveal` mechanism the host page already runs.
//
// Returns a teardown fn (listeners + observer + pending rAF) for clean unmount.

export function mountCtaBand() {
  const cleanups = [];

  const band = document.querySelector('.acta');
  if (!band) return () => {};

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;

  /* --- 1. play/pause in view ---------------------------------------------- */
  const v = band.querySelector('video');
  if (v) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            // Under reduced motion the film never starts; the poster stands in.
            if (!reduce) {
              const p = v.play();
              if (p && p.catch) p.catch(() => {});
            }
          } else {
            try {
              v.pause();
            } catch (err) {}
          }
        }),
      { threshold: 0.35 }
    );
    io.observe(v);
    cleanups.push(() => io.disconnect());
  }

  /* --- 2. cursor keyhole -------------------------------------------------
     Pointer-events, and only on a fine pointer: on touch, a synthesised move
     would latch the mask open at the tap position with no matching leave event.
     Coalesced into one rAF per frame — the mask re-rasterises the full band on
     every write, so an unthrottled handler is the heaviest paint on the page. */
  if (fine && !reduce) {
    let raf = 0;
    let px = 0;
    let py = 0;

    const apply = () => {
      raf = 0;
      band.style.setProperty('--cx', px.toFixed(2) + '%');
      band.style.setProperty('--cy', py.toFixed(2) + '%');
      band.classList.add('spot');
    };

    const move = (e) => {
      const b = band.getBoundingClientRect();
      px = ((e.clientX - b.left) / b.width) * 100;
      py = ((e.clientY - b.top) / b.height) * 100;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const leave = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      band.classList.remove('spot');
    };

    band.addEventListener('pointermove', move, { passive: true });
    band.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      band.removeEventListener('pointermove', move);
      band.removeEventListener('pointerleave', leave);
      if (raf) cancelAnimationFrame(raf);
    });
  }

  return () => {
    cleanups.forEach((c) => {
      try {
        c();
      } catch (e) {}
    });
  };
}

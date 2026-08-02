/* eslint-disable */
// Motion for the split-screen auth pages (/login, /signup).
//
// Same shape as lib/shared/chrome.js: call once from a useEffect, get a teardown
// back. Two pieces, both confined to the left showcase panel:
//   - GSAP entrance reveals (.reveal + the card) and the slow chip float
//   - a canvas particle field behind the copy
// Everything no-ops under prefers-reduced-motion (the reveals are just made
// visible instead).

import { gsap } from 'gsap';

export function mountAuth() {
  const cleanups = [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.querySelector('.apexauth');
  if (!root) return () => {};

  /* ---------- entrance reveals ---------- */
  if (reduce) {
    root.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  } else {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.show .reveal',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.15 }
      );
      gsap.fromTo('.auth-card', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.3 });
      gsap.utils.toArray('.show-chips .chip').forEach((el, i) => {
        gsap.to(el, { y: '+=8', duration: 2.6 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 + i * 0.15 });
      });
    }, root);
    cleanups.push(() => ctx.revert());
  }

  /* ---------- particle field ---------- */
  const canvas = root.querySelector('.show-particles');
  if (canvas && !reduce) {
    const ctx2d = canvas.getContext('2d');
    const host = canvas.parentElement;
    let dots = [];
    let raf = 0;
    let running = true;

    const size = () => {
      const r = host.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const make = () => {
      const r = host.getBoundingClientRect();
      const n = Math.min(44, Math.floor(r.width / 28));
      dots = [];
      for (let i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * r.width,
          y: Math.random() * r.height,
          r: Math.random() * 1.7 + 0.6,
          vx: (Math.random() - 0.5) * 0.26,
          vy: (Math.random() - 0.5) * 0.26,
          a: Math.random() * 0.5 + 0.2,
        });
      }
    };
    const tick = () => {
      if (!running) return;
      const r = host.getBoundingClientRect();
      ctx2d.clearRect(0, 0, r.width, r.height);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > r.width) d.vx *= -1;
        if (d.y < 0 || d.y > r.height) d.vy *= -1;
        ctx2d.beginPath();
        ctx2d.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx2d.fillStyle = 'rgba(111,180,214,' + d.a + ')';
        ctx2d.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      size();
      make();
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) tick();
      else if (raf) cancelAnimationFrame(raf);
    };

    size();
    make();
    tick();
    addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    cleanups.push(() => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
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

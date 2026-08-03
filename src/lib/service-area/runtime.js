/* eslint-disable */
// Apex Service Area page runtime.
//
// Ported from the <script> block of apex-service-area_extracted.html:
//   reveal-on-scroll, the coverage stat count-up, the FAQ accordion and the
//   button ripple. The ZIP checker and waitlist form were ported out of here
//   into React components once they started talking to the API.
//
// React adaptations (same spirit as the pricing/membership ports):
//   - The load-time IIFE becomes mountServiceArea(), called from the page's
//     useEffect once the DOM is committed. The ZIP checker is NOT here: it asks
//     the API and renders in React (components/service-area/ZipChecker.tsx).
//   - The source's nav-shrink/burger + footer reveal/watermark handlers are
//     dropped: the page renders the shared <SiteNav/>/<SiteFooter/>, driven by
//     mountChrome().
//   - Everything registers a disposer so listeners / observers / timeouts tear
//     down cleanly on unmount (StrictMode-safe).

export function mountServiceArea() {
  const cleanups = [];
  const on = (t, type, fn, opts) => {
    if (!t) return;
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  initVideos();
  initReveal();
  initStats();
  initFaq();
  initRipple();

  return () => {
    cleanups.forEach((c) => {
      try {
        c();
      } catch (e) {}
    });
  };

  // ======================================================================
  // background-video autoplay (with mobile / paused-tab retries)
  // ======================================================================
  // The autoPlay attribute alone is not enough: browsers block autoplay until
  // the element is provably muted+inline, and a tab that starts hidden never
  // gets to play at all. Force the flags, then retry on every signal that the
  // situation may have changed. Under reduced-motion, hold the first frame.
  //
  // Two videos: the hero plays from load, the coverage one is below the fold
  // and only runs while it is actually on screen — no point decoding ~3MB of
  // footage nobody is looking at. That one carries no autoPlay attribute, so
  // playback here is the only thing that starts it.
  function initVideos() {
    startVideo(document.querySelector('.sa-hero-vid'), false);
    startVideo(document.querySelector('.cov-vid'), true);
  }

  function startVideo(v, whenVisible) {
    if (!v) return;
    try {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
    } catch (e) {}
    if (reduce) {
      try {
        v.pause();
      } catch (e) {}
      return;
    }
    // For the on-screen-only video every retry below has to respect visibility,
    // or `canplay` would start it while it is still parked off-screen.
    let allowed = !whenVisible;
    const tryPlay = () => {
      if (!allowed) return;
      const p = v.play && v.play();
      if (p && p.catch) p.catch(() => {});
    };

    if (whenVisible) {
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            allowed = e.isIntersecting;
            if (allowed) tryPlay();
            else
              try {
                v.pause();
              } catch (err) {}
          }),
        { threshold: 0.25 }
      );
      io.observe(v);
      cleanups.push(() => io.disconnect());
    } else {
      tryPlay();
      ['pointerdown', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach((ev) => {
        on(window, ev, tryPlay, { once: true, passive: true });
      });
    }

    on(v, 'loadeddata', tryPlay);
    on(v, 'canplay', tryPlay);
    on(document, 'visibilitychange', () => {
      if (!document.hidden) tryPlay();
    });
  }

  // ======================================================================
  // reveal-on-scroll
  // ======================================================================
  function initReveal() {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    [].slice.call(document.querySelectorAll('.reveal')).forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
    cleanups.push(() => io.disconnect());
  }

  // ======================================================================
  // coverage stat count-up (decimal-aware, locale-formatted)
  // ======================================================================
  function initStats() {
    function cu(el, to, dec) {
      if (reduce) {
        el.textContent = dec ? to.toFixed(dec) : Math.round(to).toLocaleString();
        return;
      }
      let st = null;
      function f(t) {
        if (!st) st = t;
        const p = Math.min((t - st) / 1100, 1);
        const v = to * (1 - Math.pow(1 - p, 3));
        el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString();
        if (p < 1) requestAnimationFrame(f);
      }
      requestAnimationFrame(f);
    }
    const seen = new WeakSet();
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting && !seen.has(e.target)) {
            seen.add(e.target);
            const el = e.target.querySelector('[data-count]');
            if (el) cu(el, parseFloat(el.dataset.count), +(el.dataset.dec || 0));
          }
        }),
      { threshold: 0.4 }
    );
    [].slice.call(document.querySelectorAll('.cstat')).forEach((s) => io.observe(s));
    cleanups.push(() => io.disconnect());
  }

  // ======================================================================
  // FAQ accordion
  // ======================================================================
  function initFaq() {
    [].slice.call(document.querySelectorAll('.faq-item')).forEach((it) => {
      const q = it.querySelector('.faq-q');
      const a = it.querySelector('.faq-a');
      on(q, 'click', () => {
        const open = it.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach((o) => {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = '0';
        });
        if (!open) {
          it.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  // ======================================================================
  // button ripple
  // ======================================================================
  function initRipple() {
    on(document, 'click', (e) => {
      const b = e.target.closest('.ripple');
      if (!b) return;
      const r = b.getBoundingClientRect();
      const s = document.createElement('span');
      s.className = 'rip';
      const d = Math.max(r.width, r.height);
      s.style.width = s.style.height = d + 'px';
      s.style.left = e.clientX - r.left - d / 2 + 'px';
      s.style.top = e.clientY - r.top - d / 2 + 'px';
      b.appendChild(s);
      const to = setTimeout(() => s.remove(), 600);
      cleanups.push(() => clearTimeout(to));
    });
  }
}

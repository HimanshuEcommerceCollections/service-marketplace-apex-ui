/* eslint-disable */
// Apex pricing page runtime.
//
// Ported from the two <script> blocks of apex-pricing_extracted.html:
//   1. reveal-on-scroll, the stat count-up, the cost estimator (segmented +
//      multi-select add-ons, count-up totals), the FAQ accordion, and the
//      button ripple.
//   2. the hero background-video autoplay (with the source's mobile/paused-tab
//      retry handlers).
//
// Adaptations for React (same spirit as the home/membership/service ports):
//   - The load-time IIFEs are replaced by an exported mountPricing(config) that
//     the page's useEffect calls once the DOM is committed. `config` is the typed
//     estimatorConfig from data/pricing/content.ts, so the pricing numbers live
//     in the data layer, not here.
//   - The source's nav-shrink/burger + footer reveal/watermark handlers are
//     dropped: the page renders the shared <SiteNav/>/<SiteFooter/>, driven by
//     mountChrome().
//   - Everything registers a disposer so listeners / timeouts / observers tear
//     down cleanly on unmount (StrictMode-safe).
//
// Kept as .js on purpose: the vanilla logic is preserved close to verbatim and is
// outside the tsconfig `include`, so strict type-checking does not fight it.

export function mountPricing(config) {
  const cfg = config || {};
  const cleanups = [];
  const on = (t, type, fn, opts) => {
    if (!t) return;
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  initReveal();
  initStats();
  initCalculator();
  initFaq();
  initRipple();
  initHeroVideo();

  return () => {
    cleanups.forEach((c) => {
      try {
        c();
      } catch (e) {}
    });
  };

  // ======================================================================
  // 1a. reveal-on-scroll
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
  // 1b. trust-stat count-up (decimal + suffix aware)
  // ======================================================================
  function initStats() {
    function cu(el, to, dec) {
      if (reduce) {
        el.textContent = dec ? to.toFixed(dec) : Math.round(to).toLocaleString();
        return;
      }
      let st = null;
      const from = 0;
      function f(t) {
        if (!st) st = t;
        const p = Math.min((t - st) / 1100, 1);
        const v = from + (to - from) * (1 - Math.pow(1 - p, 3));
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
    [].slice.call(document.querySelectorAll('.stat')).forEach((s) => io.observe(s));
    cleanups.push(() => io.disconnect());
  }

  // ======================================================================
  // 1c. cost estimator — segmented controls + add-ons, live totals
  //     Numbers come from the typed estimatorConfig (data layer).
  // ======================================================================
  function initCalculator() {
    const BASE = cfg.base || {};
    const FREQ = cfg.freqDiscount || {};
    const TAX = typeof cfg.taxRate === 'number' ? cfg.taxRate : 0;
    const ADDON = {};
    (cfg.addons || []).forEach((a) => {
      ADDON[a.v] = a.price;
    });

    function money(n) {
      return Math.round(n).toLocaleString();
    }
    function cuId(id, to) {
      const el = document.getElementById(id);
      if (!el) return;
      if (reduce) {
        el.textContent = money(to);
        return;
      }
      let st = null;
      const from = parseFloat((el.textContent || '0').replace(/,/g, '')) || 0;
      function f(t) {
        if (!st) st = t;
        const p = Math.min((t - st) / 700, 1);
        el.textContent = money(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(f);
      }
      requestAnimationFrame(f);
    }

    const sel = { service: 'cleaning', size: 'm', freq: 'biweekly', addons: [] };

    function recalc() {
      const svc = BASE[sel.service] || {};
      const base = svc[sel.size] || 0;
      let add = 0;
      sel.addons.forEach((a) => {
        add += ADDON[a] || 0;
      });
      const est = base + add;
      const save = Math.round(est * (FREQ[sel.freq] || 0));
      const sub = est - save;
      const tax = sub * TAX;
      const total = sub + tax;
      cuId('cEst', est);
      cuId('cSave', save);
      cuId('cTax', tax);
      cuId('cTotal', total);
    }

    [].slice.call(document.querySelectorAll('.seg2')).forEach((g) => {
      on(g, 'click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (g.classList.contains('multi')) {
          b.classList.toggle('on');
          sel.addons = [].slice.call(g.querySelectorAll('.on')).map((x) => x.dataset.v);
        } else {
          [].slice.call(g.children).forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
          sel[g.dataset.group] = b.dataset.v;
        }
        recalc();
      });
    });

    // run the first count-up once the estimator scrolls into view
    const calc = document.querySelector('.calc');
    let started = false;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            recalc();
          }
        }),
      { threshold: 0.3 }
    );
    if (calc) io.observe(calc);
    cleanups.push(() => io.disconnect());
  }

  // ======================================================================
  // 1d. FAQ accordion
  // ======================================================================
  function initFaq() {
    [].slice.call(document.querySelectorAll('.faq-item')).forEach((it) => {
      const q = it.querySelector('.faq-q'),
        a = it.querySelector('.faq-a');
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
  // 1e. button ripple
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

  // ======================================================================
  // 2. hero background-video autoplay (with mobile / paused-tab retries)
  // ======================================================================
  function initHeroVideo() {
    const v = document.querySelector('.pr-hero-vid');
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
    function tryPlay() {
      const p = v.play && v.play();
      if (p && p.catch) p.catch(() => {});
    }
    tryPlay();
    on(v, 'loadeddata', tryPlay);
    on(v, 'canplay', tryPlay);
    ['pointerdown', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach((ev) => {
      on(window, ev, tryPlay, { once: true, passive: true });
    });
    on(document, 'visibilitychange', () => {
      if (!document.hidden) tryPlay();
    });
  }
}

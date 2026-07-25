/* eslint-disable */
// Apex "How It Works" page runtime.
//
// Ported from the inline <script> blocks of apex-how-it-works_extracted.html:
//   - reveal-on-scroll, the stat count-up, the FAQ accordion, and the button
//     ripple (shared with the pricing/membership ports), plus the two page-only
//     scroll drivers: the vertical process progress line + step activation
//     (initProcess) and the horizontal journey line fill (initJourney).
//
// Adaptations for React (same spirit as the pricing/membership ports):
//   - The load-time IIFEs become an exported mountHowItWorks() the page's
//     useEffect calls once the DOM is committed.
//   - The source nav/footer/testimonial handlers are dropped: the page renders
//     the shared <SiteNav/>/<SiteFooter/> (mountChrome) and <Testimonials/>
//     (mountTestimonials).
//   - Everything registers a disposer so listeners / observers tear down cleanly
//     on unmount (StrictMode-safe).
//
// Kept as .js on purpose: the vanilla logic is preserved close to verbatim and is
// outside the tsconfig `include`, so strict type-checking does not fight it.

export function mountHowItWorks() {
  const cleanups = [];
  const on = (t, type, fn, opts) => {
    if (!t) return;
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  initReveal();
  initStats();
  initFaq();
  initRipple();
  initProcess();
  initJourney();

  return () => {
    cleanups.forEach((c) => {
      try {
        c();
      } catch (e) {}
    });
  };

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
  // stat count-up (decimal aware)
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
  // FAQ accordion
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

  // ======================================================================
  // process — scroll progress line + node activation (vertical timeline)
  // ======================================================================
  function initProcess() {
    const proc = document.querySelector('.proc');
    const prog = document.getElementById('procProg');
    if (!proc || !prog) return;
    const steps = [].slice.call(proc.querySelectorAll('.pstep'));
    function upd() {
      const r = proc.getBoundingClientRect();
      const vh = innerHeight;
      let p = (vh * 0.55 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      const lineH = proc.offsetHeight - 40;
      const fillPx = lineH * p;
      prog.style.height = fillPx + 'px';
      const procTop = proc.getBoundingClientRect().top;
      steps.forEach((s) => {
        const node = s.querySelector('.pnode');
        if (!node) return;
        const nr = node.getBoundingClientRect();
        const off = nr.top + nr.height / 2 - procTop; // node center offset from proc top
        s.classList.toggle('active', fillPx + 20 >= off);
      });
    }
    on(window, 'scroll', upd, { passive: true });
    on(window, 'resize', upd);
    upd();
  }

  // ======================================================================
  // journey — connecting line fill grows with scroll (horizontal timeline)
  // ======================================================================
  function initJourney() {
    const jtl = document.querySelector('.jtl');
    const jfill = document.getElementById('jfill');
    if (!jtl || !jfill) return;
    function upd() {
      const r = jtl.getBoundingClientRect();
      const vh = innerHeight;
      let prog = (vh * 0.75 - r.top) / (r.height + vh * 0.4);
      prog = Math.max(0, Math.min(1, prog));
      jfill.style.width = prog * 100 + '%';
    }
    on(window, 'scroll', upd, { passive: true });
    on(window, 'resize', upd);
    upd();
  }
}

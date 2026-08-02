/* eslint-disable */
// Apex "Property Managers" (B2B) page runtime.
//
// Ported from the inline <script> block of property-managers.html:
//   - reveal-on-scroll, the stat count-up, the FAQ accordion and the button
//     ripple (shared with the pricing / how-it-works ports), plus the three
//     page-only scroll drivers: the turnover chain activation (initFlow), the
//     horizontal How-It-Works progress line (initTimeline) and the hero particle
//     field (initParticles).
//
// Adaptations for React (same spirit as the how-it-works port):
//   - The load-time IIFEs become an exported mountPropertyManagers() the page's
//     useEffect calls once the DOM is committed.
//   - GSAP/Lenis are dropped: this page uses the same IntersectionObserver +
//     scroll-listener approach as the other ported marketing pages, so the hero
//     copy reveals through the shared `.reveal` -> `.in` transition rather than a
//     line-mask timeline.
//   - The source nav / footer / form handlers are dropped: the page renders the
//     shared <SiteNav/>/<SiteFooter/> (mountChrome) and a React <QuoteForm/> that
//     posts to the API.
//   - Everything registers a disposer so listeners / observers / rAF loops tear
//     down cleanly on unmount (StrictMode-safe).
//
// Kept as .js on purpose: the vanilla logic is preserved close to verbatim and is
// outside the tsconfig `include`, so strict type-checking does not fight it.

export function mountPropertyManagers() {
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
  initFlow();
  initTimeline();
  initParticles();

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
  // stat count-up — only the numeric tiles carry [data-count]; the "Fast" /
  // "Single" word tiles have none and are simply skipped.
  // ======================================================================
  function initStats() {
    function cu(el, to) {
      if (reduce) {
        el.textContent = Math.round(to).toLocaleString();
        return;
      }
      let st = null;
      function f(t) {
        if (!st) st = t;
        const p = Math.min((t - st) / 1100, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString();
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
            if (el) cu(el, parseFloat(el.dataset.count));
          }
        }),
      { threshold: 0.4 }
    );
    [].slice.call(document.querySelectorAll('.stat')).forEach((s) => io.observe(s));
    cleanups.push(() => io.disconnect());
  }

  // ======================================================================
  // FAQ accordion (single open)
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
  // turnover chain — steps light up in sequence once the row scrolls in, and
  // each completed step fills the connector to its right.
  // ======================================================================
  function initFlow() {
    const flow = document.querySelector('.flow');
    if (!flow) return;
    const steps = [].slice.call(flow.querySelectorAll('.fstep'));
    if (!steps.length) return;

    function activate(i) {
      steps[i].classList.add('in');
      if (i > 0) steps[i - 1].classList.add('linked', 'done');
    }
    if (reduce) {
      steps.forEach((_, i) => activate(i));
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          steps.forEach((_, i) => {
            const to = setTimeout(() => activate(i), i * 260);
            cleanups.push(() => clearTimeout(to));
          });
        });
      },
      { threshold: 0.25 }
    );
    io.observe(flow);
    cleanups.push(() => io.disconnect());
  }

  // ======================================================================
  // how-it-works — the connecting line fills as each step activates. Horizontal
  // above 820px, vertical below (the CSS swaps which axis .tl-fill grows on).
  // ======================================================================
  function initTimeline() {
    const steps = [].slice.call(document.querySelectorAll('.steps .step'));
    const fill = document.getElementById('tlFill');
    if (!steps.length) return;
    if (reduce) {
      steps.forEach((s) => s.classList.add('in'));
      if (fill) setFill(1);
      return;
    }
    function setFill(p) {
      if (!fill) return;
      const vertical = matchMedia('(max-width:820px)').matches;
      const pct = p * 100 + '%';
      if (vertical) {
        fill.style.height = pct;
        fill.style.width = '100%';
      } else {
        fill.style.width = pct;
        fill.style.height = '100%';
      }
    }
    let reached = 0;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
          reached = Math.max(reached, steps.indexOf(e.target) + 1);
          setFill(reached / steps.length);
        }),
      { threshold: 0.5 }
    );
    steps.forEach((s) => io.observe(s));
    // Re-apply on resize so a rotate/resize across the 820px breakpoint keeps the
    // fill on the axis the CSS is now using.
    on(window, 'resize', () => setFill(reached / steps.length));
    cleanups.push(() => io.disconnect());
  }

  // ======================================================================
  // hero particle field
  // ======================================================================
  function initParticles() {
    const canvas = document.querySelector('.pm-particles');
    const hero = document.querySelector('.pm-hero');
    if (!canvas || !hero || reduce) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dots = [];
    let raf = null;
    let running = true;

    function size() {
      const r = hero.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make() {
      const r = hero.getBoundingClientRect();
      const count = Math.min(56, Math.floor(r.width / 26));
      dots = [];
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * r.width,
          y: Math.random() * r.height,
          r: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          a: Math.random() * 0.5 + 0.2,
        });
      }
    }
    function tick() {
      if (!running) return;
      const r = hero.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > r.width) d.vx *= -1;
        if (d.y < 0 || d.y > r.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(111,180,214,' + d.a + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    size();
    make();
    tick();
    on(window, 'resize', () => {
      size();
      make();
    });
    on(document, 'visibilitychange', () => {
      running = !document.hidden;
      if (running) tick();
      else if (raf) cancelAnimationFrame(raf);
    });
    cleanups.push(() => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    });
  }
}

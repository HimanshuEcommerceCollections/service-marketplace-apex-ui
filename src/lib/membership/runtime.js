/* eslint-disable */
// Apex membership-plans page runtime.
//
// Ported from the <script> blocks of apex-membership-plans_extracted.html:
//   1. reveal-on-scroll, the savings calculator (count-up + segmented controls),
//      and the FAQ accordion
//   2. the testimonial carousel (identical engine to the shared service pages)
//   3. the how-it-works timeline draw-in
//
// Adaptations for React (same spirit as the home/service ports):
//   - The IIFEs that ran on load are replaced by an exported mountMembership(testimonials)
//     the page's useEffect calls once the DOM is committed. `testimonials` feeds the
//     carousel (the source hard-coded the array inline).
//   - The source's nav-shrink/burger + footer reveal/watermark handlers are dropped:
//     the page renders the shared <SiteNav/>/<SiteFooter/>, driven by mountChrome().
//   - The dead #tsCard/.tslide auto-slider (script 1) is dropped — no such element
//     exists in the markup.
//   - Everything registers a disposer so listeners / intervals / timeouts /
//     IntersectionObservers tear down cleanly on unmount (StrictMode-safe).
//
// Kept as .js on purpose: the vanilla logic is preserved close to verbatim and is
// outside the tsconfig `include`, so strict type-checking does not fight it.

export function mountMembership(testimonials) {
  const TDATA = (testimonials || []).map((d) => ({ name: d.name, tag: d.tag, quote: d.quote }));
  const cleanups = [];
  const on = (t, type, fn, opts) => {
    if (!t) return;
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  initReveal();
  initCalculator();
  initFaq();
  initTestimonials();
  initTimeline();

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
  // 1b. savings calculator (count-up + segmented controls)
  // ======================================================================
  function initCalculator() {
    function animateCount(el, to, dur) {
      if (!el) return;
      if (reduce) {
        el.textContent = Math.round(to).toLocaleString();
        return;
      }
      let from = parseFloat((el.textContent || '0').replace(/,/g, '')) || 0,
        st = null;
      function step(t) {
        if (!st) st = t;
        const p = Math.min((t - st) / dur, 1);
        const v = from + (to - from) * (1 - Math.pow(1 - p, 3));
        el.textContent = Math.round(v).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const BASE = {
      cleaning: { s: 129, m: 169, l: 219 },
      lawn: { s: 39, m: 59, l: 89 },
      pool: { s: 119, m: 139, l: 169 },
      pw: { s: 99, m: 149, l: 199 },
    };
    const FREQ = {
      weekly: { d: 0.15, v: 52 },
      biweekly: { d: 0.12, v: 26 },
      monthly: { d: 0.08, v: 12 },
      quarterly: { d: 0.05, v: 4 },
    };
    const sel = { service: 'cleaning', freq: 'biweekly', size: 'm' };

    function recalc() {
      const base = BASE[sel.service][sel.size],
        f = FREQ[sel.freq];
      const per = Math.round(base * (1 - f.d)),
        annual = per * f.v,
        save = Math.round(base * f.v * f.d);
      animateCount(document.getElementById('perVisit'), per, 600);
      animateCount(document.getElementById('annual'), annual, 700);
      animateCount(document.getElementById('saveYr'), save, 800);
      const visits = document.getElementById('visits');
      if (visits) visits.textContent = f.v;
    }

    [].slice.call(document.querySelectorAll('.seg2')).forEach((g) => {
      on(g, 'click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        [].slice.call(g.children).forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        sel[g.dataset.group] = b.dataset.v;
        recalc();
      });
    });

    // run once the calculator scrolls into view (for the first count-up)
    const calc = document.getElementById('calc');
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
  // 1c. FAQ accordion
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
  // 2. testimonial carousel (same engine as the shared service pages)
  // ======================================================================
  function initTestimonials() {
    const DATA = TDATA;
    const strip = document.getElementById('tstrip');
    if (!strip) return;
    const cards = [].slice.call(strip.querySelectorAll('.tcard'));
    const dots = [].slice.call(document.querySelectorAll('#tdots .tdot'));
    const qtext = document.getElementById('qtext'),
      qwho = document.getElementById('qwho'),
      qrole = document.getElementById('qrole'),
      qstars = document.getElementById('qstars'),
      prog = document.getElementById('tprog');
    let cur = 3,
      DUR = 5000,
      timer = null;

    function paint(i) {
      cur = i;
      cards.forEach((c, n) => c.classList.toggle('on', n === i));
      dots.forEach((d, n) => d.classList.toggle('on', n === i));
      qtext.textContent = DATA[i].quote;
      qwho.textContent = DATA[i].name;
      qrole.textContent = DATA[i].tag;
      // retrigger text + star animation
      [qtext, qstars].forEach((el) => {
        el.classList.remove('qanim');
        void el.offsetWidth;
        el.classList.add('qanim');
      });
    }
    function go(i) {
      paint((i + cards.length) % cards.length);
      restart();
    }
    function restart() {
      if (reduce) return;
      prog.classList.remove('run');
      prog.style.width = '0';
      void prog.offsetWidth;
      prog.style.setProperty('--dur', DUR + 'ms');
      prog.classList.add('run');
      prog.style.width = '100%';
      clearTimeout(timer);
      timer = setTimeout(() => go(cur + 1), DUR);
    }
    cleanups.push(() => clearTimeout(timer));

    cards.forEach((c) => on(c, 'click', () => go(+c.dataset.i)));
    dots.forEach((d) => on(d, 'click', () => go(+d.dataset.i)));
    const pv = document.querySelector('.tprev'),
      nx = document.querySelector('.tnext');
    if (pv) on(pv, 'click', () => go(cur - 1));
    if (nx) on(nx, 'click', () => go(cur + 1));
    on(document, 'keydown', (e) => {
      if (e.key === 'ArrowLeft') go(cur - 1);
      if (e.key === 'ArrowRight') go(cur + 1);
    });
    const stage = strip.closest('.tsec');
    on(stage, 'mouseenter', () => {
      clearTimeout(timer);
      const w = getComputedStyle(prog).width;
      prog.classList.remove('run');
      prog.style.width = w;
    });
    on(stage, 'mouseleave', restart);

    // start when scrolled into view
    let started = false;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            paint(cur);
            restart();
          }
        }),
      { threshold: 0.3 }
    );
    io.observe(stage);
    cleanups.push(() => io.disconnect());
  }

  // ======================================================================
  // 3. how-it-works timeline draw-in
  // ======================================================================
  function initTimeline() {
    const tl = document.querySelector('.tline');
    if (!tl) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            tl.classList.add('drawn');
            io.disconnect();
          }
        }),
      { threshold: 0.3 }
    );
    io.observe(tl);
    cleanups.push(() => io.disconnect());
    // Note: each .tstep also carries `reveal`, so .tstep.in (which the timeline
    // node/number/text animations key off) is set by the reveal observer above.
  }

}

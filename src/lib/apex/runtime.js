/* eslint-disable */
// Apex home-page runtime.
//
// Ported (near-verbatim) from every <script> block in apex-hero-extracted.html:
// GSAP + ScrollTrigger scroll choreography, the Lenis smooth-scroll instance, the
// booking wizard, testimonial carousel, accordions, video rotators and the hero
// particle field.
//
// Two deliberate adaptations for React:
//   1. GSAP/ScrollTrigger/Lenis are loaded from npm via dynamic import (client-only)
//      instead of CDN globals.
//   2. Everything registers a disposer so the page tears down cleanly on unmount:
//      Lenis, timers, RAF loops and IntersectionObservers are tracked individually,
//      and every GSAP animation/ScrollTrigger is scoped to a gsap.context() that is
//      reverted on cleanup.
//
// Kept as .js on purpose: the original vanilla JS is preserved as-is (it is not part
// of the tsconfig `include`, so strict type-checking does not fight the verbatim DOM code).

import { testimonials as TDATA, portraits as IMG } from '../../data/apex/testimonials';

export async function mountApex() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;

  const [gsapMod, stMod, lenisMod] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('lenis'),
  ]);
  const gsap = gsapMod.default || gsapMod.gsap;
  const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
  const Lenis = lenisMod.default || lenisMod.Lenis;
  const hasGSAP = !!gsap && !!ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // --- teardown bookkeeping ---
  const cleanups = [];
  const on = (t, type, fn, opts) => {
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const every = (fn, ms) => {
    const id = setInterval(fn, ms);
    cleanups.push(() => clearInterval(id));
    return id;
  };

  // All GSAP work happens inside a context so a single revert() kills every
  // animation and ScrollTrigger created below.
  const ctx = gsap.context(() => {
    initMain();
    initTestimonials();
    initRecurringAccordion();
    initCoverage();
    initFaq();
    initBookWow();
    initRpVids();
    initHeroVids();
    initFooter();
  });
  cleanups.push(() => ctx.revert());

  // ScrollTrigger positions depend on layout that settles after fonts/media load.
  // On client-side (soft) navigation document.readyState is already 'complete', so a
  // single synchronous refresh would run before the freshly-mounted DOM has laid out,
  // leaving scroll-reveal sections stuck at opacity:0 until a hard refresh. Refresh
  // again after paint, after fonts, and on load so re-mounts recompute correctly.
  let alive = true;
  cleanups.push(() => { alive = false; });
  const refreshST = () => { if (!alive) return; try { ScrollTrigger.refresh(); } catch (e) {} };
  refreshST();
  requestAnimationFrame(() => requestAnimationFrame(refreshST));
  if (document.readyState !== 'complete') on(window, 'load', refreshST);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshST).catch(() => {});

  return () => {
    cleanups.forEach((c) => {
      try {
        c();
      } catch (e) {}
    });
  };

  // ======================================================================
  // MAIN (nav, Lenis, in-view video, GSAP choreography, magnetic, hero
  // parallax, particles, booking wizard)
  //
  // The closing CTA band is NOT here — it is the shared section
  // (components/shared/CtaBand.tsx), and its film + cursor keyhole are wired by
  // mountCtaBand(), which ApexHome calls alongside mountApex. Only the GSAP
  // reveal/copy-stagger for `.acta` stays below, since GSAP is home-only.
  // ======================================================================
  function initMain() {
    bookingInit();

    /* NAV */
    const nav = document.getElementById('nav');
    const setNav = () => nav && nav.classList.toggle('scrolled', scrollY > innerHeight * 0.6);
    setNav();

    /* LENIS */
    let lenis = null;
    if (!reduce && typeof Lenis !== 'undefined') {
      lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      lenis.on('scroll', () => {
        if (hasGSAP) ScrollTrigger.update();
        setNav();
      });
      let rid = requestAnimationFrame(function raf(t) {
        lenis.raf(t);
        rid = requestAnimationFrame(raf);
      });
      cleanups.push(() => cancelAnimationFrame(rid));
      cleanups.push(() => {
        try {
          lenis.destroy();
        } catch (e) {}
      });
    } else on(window, 'scroll', setNav, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      on(a, 'click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis ? lenis.scrollTo(el, { offset: -50, duration: 1.3 }) : el.scrollIntoView({ behavior: 'smooth' });
      })
    );

    /* VIDEO play/pause in view (perf) */
    document.querySelectorAll('.ch-media video,#heroMedia video,#heroHouse video,.bridge-vid').forEach((v) => {
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              if (!reduce) {
                v.play().catch(() => {});
              }
            } else v.pause();
          }),
        { threshold: 0.35 }
      );
      io.observe(v);
      cleanups.push(() => io.disconnect());
    });

    if (hasGSAP && !reduce) {
      gsap.registerPlugin(ScrollTrigger);

      // Reveal the hero copy the instant we take over: the .from() below sets
      // opacity:0 synchronously (immediateRender) in the same tick, so removing
      // the FOUC guard here produces no flash — the elements go straight from
      // "hidden by CSS" to "hidden by GSAP", then animate in.
      document.documentElement.classList.remove('hero-preanim');

      /* Intro — play ONCE per full page load. On a client-side navigation back
         to home the component re-mounts and mountApex re-runs; replaying this
         .from() would set the copy to opacity:0 again, and if the tween is torn
         down by the mount/dispose race before finishing it strands the text
         hidden. Gating on a window flag means the copy is simply left visible on
         return (the scroll-driven animations below still re-init every mount). */
      if (!window.__apexHeroIntroPlayed) {
        window.__apexHeroIntroPlayed = true;
        gsap
          .timeline({ delay: 0.25, defaults: { ease: 'power3.out' } })
          .from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.7 })
          .from('h1 [data-line]', { yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.11 }, '-=.35')
          .from('.hero p.lede', { y: 22, opacity: 0, duration: 0.8 }, '-=.5')
          .from('.hero-actions', { y: 22, opacity: 0, duration: 0.8 }, '-=.6')
          .from('.scroll-cue', { opacity: 0, duration: 0.8 }, '-=.4');
      }

      /* Hero exit — no pin: hero scrolls away, Featured services appears immediately */
      gsap
        .timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
        .to('#heroMedia', { scale: 1.1, ease: 'none' }, 0)
        .to('#ambient', { yPercent: 18, xPercent: 12, ease: 'none' }, 0)
        .to('#heroContent', { yPercent: -8, ease: 'none' }, 0)
        .to('.scroll-cue', { opacity: 0, ease: 'none' }, 0);

      /* Bridge */
      gsap.to('#bridgeImg', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '#bridge', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('[data-bridge]', { y: 34, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '#bridge', start: 'top 62%' } });

      /* Chapters: media parallax + content reveal */
      gsap.utils.toArray('.chapter').forEach((ch) => {
        const media = ch.querySelector('.ch-media');
        gsap.fromTo(
          media,
          { scale: 1.16, yPercent: -4 },
          { scale: 1.02, yPercent: 4, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: 0.4 } }
        );
        gsap.to(ch.querySelectorAll('.ch-reveal'), { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: ch, start: 'top 55%' } });
      });

      /* How It Works timeline */
      gsap.fromTo('#tlFill', { height: '0%' }, { height: '100%', ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 55%', end: 'bottom 68%', scrub: 0.5 } });
      gsap.utils.toArray('.step').forEach((step) => {
        ScrollTrigger.create({ trigger: step, start: 'top 62%', end: 'bottom 42%', toggleClass: { targets: step, className: 'in' } });
        const frame = step.querySelector('.s-frame'),
          img = frame.querySelector('img'),
          rises = step.querySelectorAll('.s-rise');
        gsap
          .timeline({ scrollTrigger: { trigger: step, start: 'top 76%' } })
          .fromTo(frame, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.0, ease: 'power3.out' })
          .fromTo(img, { scale: 1.08 }, { scale: 1.0, duration: 1.25, ease: 'power3.out' }, 0)
          .fromTo(rises, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0.25);
        const cnt = step.querySelector('.count');
        if (cnt) {
          const to = +cnt.dataset.to;
          ScrollTrigger.create({
            trigger: step,
            start: 'top 66%',
            once: true,
            onEnter: () => {
              const o = { v: 0 };
              gsap.to(o, { v: to, duration: 1.3, ease: 'power2.out', onUpdate: () => (cnt.textContent = Math.round(o.v)) });
            },
          });
        }
      });

      gsap.utils.toArray('.sample-note.reveal,.acta.reveal').forEach((el) => gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
      gsap.from('.acta h2,.acta p,.acta .btn', { y: 26, opacity: 0, duration: 0.85, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: '.acta', start: 'top 78%' } });
    } else {
      // No GSAP or reduced motion: drop the FOUC guard so the hero copy shows.
      window.__apexHeroIntroPlayed = true;
      document.documentElement.classList.remove('hero-preanim');
      document.querySelectorAll('.reveal,.ch-reveal,.s-rise').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
      document.querySelectorAll('.step').forEach((s) => s.classList.add('in'));
      document.querySelectorAll('.s-frame').forEach((f) => {
        f.style.clipPath = 'none';
        const i = f.querySelector('img');
        if (i) i.style.transform = 'none';
      });
    }

    /* Magnetic */
    if (!reduce && fine && hasGSAP) {
      document.querySelectorAll('.magnetic').forEach((el) => {
        const s = 0.34,
          inner = el.querySelector('.btn-inner') || el;
        on(el, 'mousemove', (e) => {
          const b = el.getBoundingClientRect();
          const x = (e.clientX - b.left - b.width / 2) * s,
            y = (e.clientY - b.top - b.height / 2) * s;
          gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' });
          gsap.to(inner, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: 'power3.out' });
        });
        on(el, 'mouseleave', () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.5)' });
          gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.5)' });
        });
      });
    }

    /* Hero parallax */
    if (!reduce && fine && hasGSAP) {
      const media = document.getElementById('heroMedia'),
        amb = document.getElementById('ambient'),
        content = document.getElementById('heroContent'),
        house = document.getElementById('heroHouse');
      on(window, 'mousemove', (e) => {
        const nx = e.clientX / innerWidth - 0.5,
          ny = e.clientY / innerHeight - 0.5;
        gsap.to(media, { x: nx * -24, y: ny * -16, duration: 0.9, ease: 'power2.out' });
        gsap.to(amb, { x: nx * 40, y: ny * 30, duration: 1.1, ease: 'power2.out' });
        gsap.to(content, { x: nx * 10, y: ny * 8, duration: 1, ease: 'power2.out' });
        gsap.to(house, { x: nx * -40, y: ny * -24, duration: 1, ease: 'power2.out' });
      });
    }

    /* Particles */
    if (!reduce) {
      const c = document.getElementById('particles'),
        pctx = c.getContext('2d');
      let w,
        h,
        parts,
        raf;
      const DPR = Math.min(devicePixelRatio || 1, 2);
      const size = () => {
        w = c.width = innerWidth * DPR;
        h = c.height = innerHeight * DPR;
        c.style.width = innerWidth + 'px';
        c.style.height = innerHeight + 'px';
      };
      const make = () => {
        const n = Math.round(Math.min(56, innerWidth / 26));
        parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 2 + 0.6) * DPR, vx: (Math.random() - 0.5) * 0.18 * DPR, vy: (-Math.random() * 0.3 - 0.05) * DPR, a: Math.random() * 0.4 + 0.15 }));
      };
      function draw() {
        pctx.clearRect(0, 0, w, h);
        for (const p of parts) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          pctx.beginPath();
          pctx.arc(p.x, p.y, p.r, 0, 6.283);
          pctx.fillStyle = 'rgba(160,214,236,' + p.a + ')';
          pctx.shadowBlur = 8 * DPR;
          pctx.shadowColor = 'rgba(111,180,214,.6)';
          pctx.fill();
        }
        raf = requestAnimationFrame(draw);
      }
      size();
      make();
      draw();
      cleanups.push(() => cancelAnimationFrame(raf));
      let rt;
      on(window, 'resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
          size();
          make();
        }, 200);
      });
      cleanups.push(() => clearTimeout(rt));
      if (hasGSAP)
        ScrollTrigger.create({
          trigger: '#hero',
          start: 'bottom top',
          onEnter: () => {
            cancelAnimationFrame(raf);
            pctx.clearRect(0, 0, w, h);
          },
          onLeaveBack: () => {
            draw();
          },
        });
    }

    function bookingInit() {
      const root = document.getElementById('book');
      if (!root) return;
      const I = {
        clean: '<path d="M4 20h16M7 20V9l5-4 5 4v11M10 20v-5h4v5"/>',
        lawn: '<path d="M3 20h18M5 20c0-4 1.5-7 3-9M9 20c0-5 .5-8 2-11M13 20c0-5 1-8 3-10M17 20c0-3 .8-5 2-7"/>',
        pool: '<path d="M3 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M3 19c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M8 12V5M14 12V5M8 8h6"/>',
        pest: '<path d="M12 6v13M9 9l-3-2M15 9l3-2M8 13l-3 0M16 13l3 0M9 17l-3 2M15 17l3 2M12 6a2.5 2.5 0 1 0 0-.01"/>',
        junk: '<path d="M3 13h13v5H3zM16 15h3l2 3v0h-5M6 18a1.6 1.6 0 1 0 0 .01M18 18a1.6 1.6 0 1 0 0 .01M5 13V8h8v5"/>',
        smart: '<path d="M4 20h16M7 20V10h10v10M9.5 15h5M12 6.5V4M8 5l1.4 1.4M16 5l-1.4 1.4"/>',
        handy: '<path d="M14 7l3-3 3 3-3 3-2-2-6 6M4 20l6-6M4 20l1-4 3 3z"/>',
        wash: '<path d="M6 20V8a3 3 0 0 1 3-3h1V3M10 5h6M18 8l2-3M17 9l3-2M18 11l3-1M9 8h1M9 11h1M9 14h1"/>',
        paint: '<path d="M4 4h13v6H4zM8 10v3a2 2 0 0 0 2 2h1v5"/>',
        security: '<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9.5 12l1.8 1.8L15 10"/>',
        tree: '<path d="M12 3a5 5 0 0 1 4 8 4 4 0 0 1-1 6H9a4 4 0 0 1-1-6 5 5 0 0 1 4-8zM12 17v4M10 21h4"/>',
      };
      const svcDefs = [
        { id: 'cleaning', name: 'Cleaning', icon: 'clean', tier: 'matrix' },
        { id: 'lawn', name: 'Lawn Care', icon: 'lawn', tier: 'tier', base: { S: 49, M: 59, L: 79 }, recurring: true },
        { id: 'pool', name: 'Pool', icon: 'pool', tier: 'tier', base: { S: 99, M: 119, L: 149 }, recurring: true },
        { id: 'pest', name: 'Pest Control', icon: 'pest', tier: 'tier', base: { S: 79, M: 89, L: 109 }, recurring: true },
        { id: 'junk', name: 'Junk Removal', icon: 'junk', tier: 'load' },
        { id: 'smart', name: 'Smart Home', icon: 'smart', tier: 'devices' },
        { id: 'wash', name: 'Power Washing', icon: 'wash', tier: 'tier', base: { S: 199, M: 279, L: 379 }, from: true },
        { id: 'handyman', name: 'Handyman', icon: 'handy', tier: 'hours' },
        { id: 'painting', name: 'Painting', icon: 'paint', tier: 'quote' },
        { id: 'security', name: 'Home Security', icon: 'security', tier: 'quote' },
        { id: 'tree', name: 'Tree & Stump', icon: 'tree', tier: 'quote' },
      ];
      const hint = { cleaning: 'from $129', lawn: '$59/visit', pool: '$119/visit', pest: '$89/visit', junk: 'from $99', smart: 'from $199', wash: 'from $199', handyman: 'from $95/hr', painting: 'Custom estimate', security: 'Free consult', tree: 'Custom estimate' };
      const rating = { cleaning: ['4.9', '1.2k'], lawn: ['4.8', '860'], pool: ['4.9', '540'], pest: ['4.7', '430'], junk: ['4.8', '610'], smart: ['4.9', '390'], wash: ['4.8', '720'], handyman: ['4.9', '980'], painting: ['5.0', '510'], security: ['4.8', '280'], tree: ['4.7', '190'] };
      const ZIPS = new Set(['27601', '27603', '27604', '27605', '27606', '27607', '27608', '27609', '27610', '27612', '27613', '27614', '27615', '27617', '27519', '27523', '27529', '27539', '27540', '27560', '27587', '27591', '27502', '27511', '27513', '27518', '27526', '27545', '27571', '27597']);
      const labels = ['Service', 'Customize', 'Schedule', 'Details', 'Review', 'Confirmed'];
      const state = { step: 0, service: null, config: {}, date: null, time: null, details: {}, waitlist: false, ref: '' };
      const freqL = { once: 'One-time', weekly: 'Weekly', biweekly: 'Biweekly', monthly: 'Monthly' };
      const $ = (s) => root.querySelector(s);

      $('#stepper').innerHTML = labels.map((l, i) => `<div class="stp"><span class="b">${i + 1}</span>${i < labels.length - 1 ? '<span class="ln"></span>' : ''}</div>`).join('');
      $('#panels').innerHTML = `
      <div class="panel" data-p="0"><div class="panel-h f">Choose your service</div><div class="panel-s f">Select what your home needs today.</div><div class="svc-grid f" id="svcGrid"></div></div>
      <div class="panel" data-p="1"><div class="panel-h f">Customize your service</div><div class="panel-s f" id="custSub">Tailor the details.</div><div class="f" id="custBody"></div></div>
      <div class="panel" data-p="2"><div class="panel-h f">Select date &amp; time</div><div class="panel-s f">Pick a day and window that works for you.</div><div class="f"><div class="cal" id="cal"></div><div class="slots" id="slots"></div></div></div>
      <div class="panel" data-p="3"><div class="panel-h f">Your details</div><div class="panel-s f">Where should the Apex team arrive?</div><div class="f" id="detBody"></div></div>
      <div class="panel" data-p="4"><div class="panel-h f">Review your booking</div><div class="panel-s f">One last look before we confirm.</div><div class="f" id="revBody"></div></div>
      <div class="panel" data-p="5"><div class="confirm-stage">
        <div class="loader" id="loader"><svg class="ring" viewBox="0 0 80 80"><circle class="bg" cx="40" cy="40" r="34"/><circle class="fg" cx="40" cy="40" r="34"/></svg><div class="lt">Confirming your booking…</div></div>
        <div class="success" id="success"><svg class="succ-check" viewBox="0 0 80 80"><circle cx="40" cy="40" r="38"/><path d="M25 41l10 10 20-22"/></svg>
          <h3 id="succH">You're booked.</h3><p class="ptxt" id="succP"></p>
          <div class="ref-box"><div class="rl">Booking reference</div><div class="rv" id="refOut"></div></div>
          <div class="succ-meta" id="succMeta"></div></div>
        <canvas id="confettiC"></canvas></div></div>`;

      // service grid
      $('#svcGrid').innerHTML = svcDefs
        .map(
          (s) =>
            `<div class="svc" data-id="${s.id}"><span class="tick"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></span><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${I[s.icon]}</svg><span class="nm">${s.name}</span><span class="pr">${hint[s.id]}</span><span class="svc-rt"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z\"/></svg> ${rating[s.id][0]} <em>(${rating[s.id][1]})</em></span></div>`
        )
        .join('');
      $('#svcGrid')
        .querySelectorAll('.svc')
        .forEach((el) =>
          el.addEventListener('click', () => {
            $('#svcGrid')
              .querySelectorAll('.svc')
              .forEach((x) => x.classList.remove('sel'));
            el.classList.add('sel');
            state.service = svcDefs.find((d) => d.id === el.dataset.id);
            state.config = defCfg(state.service);
            buildCustomize();
            update();
            checkStep();
          })
        );

      function defCfg(s) {
        if (s.tier === 'matrix') return { beds: 3, baths: 2, type: 'standard', freq: 'once', addons: [] };
        if (s.tier === 'tier') return s.recurring ? { size: 'M', freq: 'biweekly' } : { size: 'M' };
        if (s.tier === 'load') return { load: 'h' };
        if (s.tier === 'devices') return { devices: 3 };
        if (s.tier === 'hours') return { hours: 2 };
        return { scope: '' };
      }

      function buildCustomize() {
        const s = state.service,
          c = state.config,
          body = $('#custBody');
        if (!s) {
          body.innerHTML = '';
          return;
        }
        $('#custSub').textContent = 'Configure your ' + s.name.toLowerCase() + '.';
        const stp = (k, l) => `<div class="ctl"><label>${l}</label><div class="stepperc" data-k="${k}"><button data-d="-1">−</button><span class="v">${c[k]}</span><button data-d="1">+</button></div></div>`;
        const ch = (k, l, opts, multi) =>
          `<div class="ctl"><label>${l}</label><div class="choices ${multi ? 'multi' : ''}" data-k="${k}" data-multi="${multi ? 1 : 0}">${opts
            .map((o) => {
              const on = multi ? (c[k] || []).includes(o[0]) : c[k] === o[0];
              return `<button class="choice ${on ? 'on' : ''}" data-v="${o[0]}">${o[1]}${o[2] ? `<span class="x">${o[2]}</span>` : ''}</button>`;
            })
            .join('')}</div></div>`;
        let h = '';
        if (s.tier === 'matrix') {
          h +=
            stp('beds', 'Bedrooms') +
            stp('baths', 'Bathrooms') +
            ch('type', 'Clean type', [['standard', 'Standard'], ['deep', 'Deep clean']], 0) +
            ch('freq', 'Frequency', [['once', 'One-time'], ['weekly', 'Weekly'], ['biweekly', 'Biweekly'], ['monthly', 'Monthly']], 0) +
            ch('addons', 'Add-ons', [['fridge', 'Inside fridge', '+$25'], ['oven', 'Inside oven', '+$25'], ['windows', 'Interior windows', '+$40']], 1);
        } else if (s.tier === 'tier') {
          h += ch('size', 'Property size', [['S', 'Small'], ['M', 'Medium'], ['L', 'Large']], 0);
          if (s.recurring) h += ch('freq', 'Frequency', [['once', 'One-time'], ['weekly', 'Weekly'], ['biweekly', 'Biweekly'], ['monthly', 'Monthly']], 0);
        } else if (s.tier === 'load') {
          h += ch('load', 'Load size', [['q', '¼ load'], ['h', '½ load'], ['t', '¾ load'], ['f', 'Full load']], 0);
        } else if (s.tier === 'devices') {
          h += stp('devices', 'Number of devices') + '<p class="panel-s">Install 3 or more devices and save 15%.</p>';
        } else if (s.tier === 'hours') {
          h += stp('hours', 'Estimated hours');
        } else {
          h +=
            '<div class="ctl"><label>Describe the job</label><div class="inp"><textarea id="scopeTa" rows="4" placeholder="Tell us what you need…">' +
            (c.scope || '') +
            '</textarea></div><p class="panel-s">This service is quoted after a quick consult — no upfront price.</p></div>';
        }
        body.innerHTML = h;
        const lim = { beds: [1, 6], baths: [1, 5], devices: [1, 12], hours: [1, 8] };
        body.querySelectorAll('.stepperc').forEach((sc) => {
          const k = sc.dataset.k;
          sc.querySelectorAll('button').forEach((b) =>
            b.addEventListener('click', () => {
              const L = lim[k];
              let v = Math.max(L[0], Math.min(L[1], (c[k] || L[0]) + +b.dataset.d));
              c[k] = v;
              sc.querySelector('.v').textContent = v;
              update();
            })
          );
        });
        body.querySelectorAll('.choices').forEach((cw) => {
          const k = cw.dataset.k,
            multi = cw.dataset.multi === '1';
          cw.querySelectorAll('.choice').forEach((b) =>
            b.addEventListener('click', () => {
              const v = b.dataset.v;
              if (multi) {
                c[k] = c[k] || [];
                if (c[k].includes(v)) {
                  c[k] = c[k].filter((x) => x !== v);
                  b.classList.remove('on');
                } else {
                  c[k].push(v);
                  b.classList.add('on');
                }
              } else {
                c[k] = v;
                cw.querySelectorAll('.choice').forEach((x) => x.classList.remove('on'));
                b.classList.add('on');
              }
              update();
            })
          );
        });
        const ta = body.querySelector('#scopeTa');
        if (ta) ta.addEventListener('input', () => (c.scope = ta.value));
      }

      // details
      $('#detBody').innerHTML = `<div class="inp"><label>Full name</label><input id="d_name" placeholder="Jordan Rivera"></div>
      <div class="row2" style="grid-template-columns:1fr 1fr"><div class="inp"><label>Email</label><input id="d_email" type="email" placeholder="you@email.com"></div><div class="inp"><label>Phone</label><input id="d_phone" placeholder="(919) 555-0142"></div></div>
      <div class="inp"><label>Street address</label><input id="d_street" placeholder="120 Fayetteville St"></div>
      <div class="row2" style="grid-template-columns:2fr 1fr"><div class="inp"><label>City</label><input id="d_city" placeholder="Raleigh"></div><div class="inp"><label>ZIP code</label><input id="d_zip" inputmode="numeric" maxlength="5" placeholder="27601"><div class="zipnote" id="zipnote"></div></div></div>`;
      $('#d_zip').addEventListener('input', () => {
        const z = $('#d_zip').value.trim(),
          n = $('#zipnote');
        n.className = 'zipnote';
        n.textContent = '';
        if (z.length === 5) {
          if (ZIPS.has(z)) {
            state.waitlist = false;
            n.classList.add('ok');
            n.textContent = '✓ In our Wake County service area';
          } else {
            state.waitlist = true;
            n.classList.add('wl');
            n.textContent = "Outside our area for now — we'll add you to the waitlist.";
          }
        }
      });

      // calendar
      let calM = new Date();
      calM.setDate(1);
      function renderCal() {
        const y = calM.getFullYear(),
          m = calM.getMonth(),
          first = new Date(y, m, 1).getDay(),
          dim = new Date(y, m + 1, 0).getDate();
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        let d = '';
        for (let i = 0; i < first; i++) d += '<button class="day empty"></button>';
        for (let n = 1; n <= dim; n++) {
          const dd = new Date(y, m, n),
            past = dd < t,
            sel = state.date && state.date.getTime() === dd.getTime();
          d += `<button class="day ${past ? 'past' : ''} ${sel ? 'sel' : ''}" data-n="${n}" ${past ? 'disabled' : ''}>${n}</button>`;
        }
        $('#cal').innerHTML = `<div class="cal-head"><button id="cp">‹</button><span class="m">${calM.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span><button id="cn">›</button></div><div class="cal-dow">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x) => `<span>${x}</span>`).join('')}</div><div class="cal-days">${d}</div>`;
        $('#cp').addEventListener('click', () => {
          calM.setMonth(m - 1);
          renderCal();
          calAnim();
        });
        $('#cn').addEventListener('click', () => {
          calM.setMonth(m + 1);
          renderCal();
          calAnim();
        });
        $('#cal')
          .querySelectorAll('.day:not(.empty):not(.past)')
          .forEach((b) =>
            b.addEventListener('click', () => {
              state.date = new Date(y, m, +b.dataset.n);
              renderCal();
              update();
              checkStep();
            })
          );
      }
      function calAnim() {
        if (hasGSAP && !reduce) gsap.from(root.querySelectorAll('.cal-days .day:not(.empty)'), { opacity: 0, y: 8, duration: 0.4, stagger: 0.006, ease: 'power2.out' });
      }
      const SLOTS = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];
      $('#slots').innerHTML = SLOTS.map((s) => `<button class="slot" data-t="${s}">${s}</button>`).join('');
      $('#slots')
        .querySelectorAll('.slot')
        .forEach((b) =>
          b.addEventListener('click', () => {
            $('#slots')
              .querySelectorAll('.slot')
              .forEach((x) => x.classList.remove('on'));
            b.classList.add('on');
            state.time = b.dataset.t;
            update();
            checkStep();
          })
        );

      function price() {
        const s = state.service,
          c = state.config;
        if (!s) return { mode: 'none' };
        if (s.tier === 'quote') return { mode: 'quote' };
        const FD = { once: 0, weekly: 0.15, biweekly: 0.12, monthly: 0.08 };
        let items = [],
          total = 0;
        if (s.tier === 'matrix') {
          let base = 79 + c.beds * 22 + c.baths * 19;
          items.push(['Base · ' + c.beds + ' bd / ' + c.baths + ' ba', base]);
          let sub = base;
          if (c.type === 'deep') {
            const dd = Math.round(base * 0.35);
            items.push(['Deep clean', dd]);
            sub += dd;
          }
          const ap = { fridge: 25, oven: 25, windows: 40 },
            an = { fridge: 'Inside fridge', oven: 'Inside oven', windows: 'Interior windows' };
          (c.addons || []).forEach((a) => {
            items.push([an[a], ap[a]]);
            sub += ap[a];
          });
          total = sub;
          const fd = FD[c.freq];
          if (fd) {
            const dc = Math.round(sub * fd);
            items.push([freqL[c.freq] + ' plan · −' + fd * 100 + '%', -dc]);
            total = sub - dc;
          }
          return { mode: 'priced', items, total, unit: c.freq !== 'once' ? '/visit' : '' };
        }
        if (s.tier === 'tier') {
          let base = s.base[c.size];
          items.push(['Base · ' + { S: 'Small', M: 'Medium', L: 'Large' }[c.size] + ' property', base]);
          total = base;
          if (s.recurring) {
            const fd = FD[c.freq];
            if (fd) {
              const dc = Math.round(base * fd);
              items.push([freqL[c.freq] + ' plan · −' + fd * 100 + '%', -dc]);
              total = base - dc;
            }
          }
          return { mode: s.from ? 'from' : 'priced', items, total, unit: s.recurring && c.freq !== 'once' ? '/visit' : '' };
        }
        if (s.tier === 'load') {
          const m = { q: ['¼ load', 99], h: ['½ load', 179], t: ['¾ load', 259], f: ['Full load', 329] }[c.load];
          items.push([m[0], m[1]]);
          return { mode: 'priced', items, total: m[1] };
        }
        if (s.tier === 'devices') {
          const base = 149,
            dv = c.devices * 49;
          items.push(['Base install', base]);
          items.push([c.devices + ' device' + (c.devices > 1 ? 's' : ''), dv]);
          let sub = base + dv;
          total = sub;
          if (c.devices >= 3) {
            const dc = Math.round(sub * 0.15);
            items.push(['3+ devices · −15%', -dc]);
            total = sub - dc;
          }
          return { mode: 'priced', items, total };
        }
        if (s.tier === 'hours') {
          const tt = 95 * c.hours;
          items.push(['$95/hr × ' + c.hours + 'h', tt]);
          return { mode: 'from', items, total: tt };
        }
        return { mode: 'none' };
      }

      function cfg() {
        const s = state.service,
          c = state.config;
        if (!s) return '';
        if (s.tier === 'matrix') return c.beds + ' bed · ' + c.baths + ' bath · ' + (c.type === 'deep' ? 'Deep' : 'Standard') + ' · ' + freqL[c.freq];
        if (s.tier === 'tier') return { S: 'Small', M: 'Medium', L: 'Large' }[c.size] + (s.recurring ? ' · ' + freqL[c.freq] : '');
        if (s.tier === 'load') return { q: '¼ load', h: '½ load', t: '¾ load', f: 'Full load' }[c.load];
        if (s.tier === 'devices') return c.devices + ' devices';
        if (s.tier === 'hours') return c.hours + ' hours';
        return 'Custom estimate';
      }

      let lastTotal = 0;
      function update() {
        const s = state.service,
          pr = price();
        $('#pvSvc').innerHTML = s
          ? `<div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${I[s.icon]}</svg></div><div><div class="nm">${s.name}</div><div class="cf">${cfg() || '—'}</div></div>`
          : `<div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></div><div><div class="nm">No service yet</div><div class="cf">Pick a service to begin</div></div>`;
        const dt = state.date ? state.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
        $('#pvArr').innerHTML = `<div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg></div><div><div class="dt">${state.date ? dt : 'Not scheduled'}</div><div class="sub">${state.time || 'Choose a date & time'}</div></div>`;
        const pp = $('#pvPrice');
        if (pr.mode === 'quote') {
          pp.innerHTML = '<div class="pv-quote">Custom estimate</div><div class="sub" style="color:var(--slate4);font-size:12.5px;margin-top:6px">Confirmed after a quick consult</div>';
          lastTotal = 0;
        } else if (pr.mode === 'none') {
          pp.innerHTML = '<div class="row"><span>Configure your service</span><span class="a">—</span></div>';
          lastTotal = 0;
        } else {
          pp.innerHTML =
            pr.items.map((it) => `<div class="row"><span>${it[0]}</span><span class="a">${it[1] < 0 ? '−$' + Math.abs(it[1]) : '$' + it[1]}</span></div>`).join('') +
            `<div class="tot"><span class="lb">${pr.mode === 'from' ? 'Starting at' : 'Estimated total'}</span><span class="amt"><span id="amtNum">$${lastTotal}</span>${pr.unit ? '<small>' + pr.unit + '</small>' : ''}</span></div>`;
          countTo($('#amtNum'), lastTotal, pr.total);
          lastTotal = pr.total;
        }
      }
      function countTo(el, from, to) {
        if (!el) return;
        if (reduce) {
          el.textContent = '$' + to;
          return;
        }
        const t0 = performance.now();
        (function fr(t) {
          const p = Math.min(1, (t - t0) / 600),
            e = 1 - Math.pow(1 - p, 3);
          el.textContent = '$' + Math.round(from + (to - from) * e);
          if (p < 1) requestAnimationFrame(fr);
        })(t0);
      }

      function buildReview() {
        const s = state.service,
          pr = price(),
          d = readDetails();
        const dt = state.date ? state.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '—';
        const rows = [
          ['Service', s ? s.name : '—'],
          ['Details', cfg() || '—'],
          ['When', dt + (state.time ? ' · ' + state.time : '')],
          ['Name', d.name || '—'],
          ['Address', ((d.street ? d.street + ', ' : '') + (d.city || '') + (d.zip ? ' ' + d.zip : '')).trim() || '—'],
        ];
        let h = `<div class="rev">${rows.map((r) => `<div class="rev-row"><span class="k">${r[0]}</span><span class="v">${r[1]}</span></div>`).join('')}</div>`;
        if (state.waitlist) h += '<div class="rev-total" style="background:var(--clay-tint)"><span style="color:#8a4e28">Waitlist request</span><span class="v" style="color:#8a4e28;font-size:15px">We\'ll be in touch</span></div>';
        else if (pr.mode === 'quote') h += '<div class="rev-total" style="background:var(--clay-tint)"><span style="color:#8a4e28">Custom estimate</span><span class="v" style="color:#8a4e28;font-size:15px">Confirmed by your pro</span></div>';
        else if (pr.total) h += `<div class="rev-total"><span>${pr.mode === 'from' ? 'Starting at' : 'Estimated total'}</span><span class="v">$${pr.total}${pr.unit || ''}</span></div>`;
        $('#revBody').innerHTML = h;
      }

      const btnBack = $('#btnBack'),
        btnNext = $('#btnNext'),
        nextLbl = btnNext.querySelector('.btn-inner');
      function readDetails() {
        const g = (id) => {
          const el = $('#' + id);
          return el ? el.value.trim() : '';
        };
        return (state.details = { name: g('d_name'), email: g('d_email'), phone: g('d_phone'), street: g('d_street'), city: g('d_city'), zip: g('d_zip') });
      }
      function checkStep() {
        let ok = true;
        const st = state.step;
        if (st === 0 || st === 1) ok = !!state.service;
        else if (st === 2) ok = !!(state.date && state.time);
        else if (st === 3) {
          const d = readDetails();
          ok = !!(d.name && d.email && d.zip.length === 5);
        }
        btnNext.disabled = !ok;
      }
      root.addEventListener('input', (e) => {
        if (e.target.closest('#detBody')) {
          readDetails();
          checkStep();
        }
      });

      function show(step) {
        state.step = step;
        root.querySelectorAll('.panel').forEach((p) => p.classList.toggle('active', +p.dataset.p === step));
        root.querySelectorAll('.stp').forEach((el, i) => {
          el.classList.toggle('active', i === step);
          el.classList.toggle('done', i < step);
        });
        $('#wizFill').style.width = (step / (labels.length - 1)) * 100 + '%';
        btnBack.style.display = step === 0 || step === 5 ? 'none' : 'inline-flex';
        btnNext.style.display = step === 5 ? 'none' : 'inline-flex';
        nextLbl.textContent = step === 4 ? (state.waitlist ? 'Join waitlist' : 'Confirm booking') : 'Continue';
        if (step === 4) buildReview();
        const active = root.querySelector('.panel.active');
        if (hasGSAP && !reduce) {
          gsap.fromTo(active.querySelectorAll('.f'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' });
          if (step === 2) calAnim();
        } else active.querySelectorAll('.f').forEach((f) => {
          f.style.opacity = 1;
          f.style.transform = 'none';
        });
        checkStep();
        update();
      }
      btnNext.addEventListener('click', (e) => {
        if (btnNext.disabled) return;
        const rip = document.createElement('span');
        rip.className = 'rip';
        const b = btnNext.getBoundingClientRect(),
          sz = Math.max(b.width, b.height);
        rip.style.width = rip.style.height = sz + 'px';
        rip.style.left = e.clientX - b.left + 'px';
        rip.style.top = e.clientY - b.top + 'px';
        btnNext.appendChild(rip);
        if (hasGSAP) gsap.fromTo(rip, { scale: 0, opacity: 0.55 }, { scale: 2.4, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => rip.remove() });
        else setTimeout(() => rip.remove(), 600);
        if (state.step === 4) {
          confirmBooking();
          return;
        }
        if (state.step < 4) show(state.step + 1);
      });
      btnBack.addEventListener('click', () => {
        if (state.step > 0) show(state.step - 1);
      });

      function confirmBooking() {
        show(5);
        const loader = $('#loader'),
          success = $('#success'),
          fg = root.querySelector('.ring .fg'),
          badge = $('#pvBadge');
        requestAnimationFrame(() => {
          fg.style.strokeDashoffset = '0';
        });
        setTimeout(() => {
          if (hasGSAP && !reduce) gsap.to(loader, { opacity: 0, y: -10, duration: 0.4, onComplete: () => (loader.style.display = 'none') });
          else loader.style.display = 'none';
          success.style.opacity = 1;
          root.querySelector('.succ-check path').style.strokeDashoffset = '0';
          const wl = state.waitlist;
          state.ref = (wl ? 'APX-WL-' : 'APX-2026-') + String(Math.floor(1000 + Math.random() * 9000));
          $('#succH').textContent = wl ? "You're on the list." : "You're booked.";
          $('#succP').textContent = wl
            ? "You're just outside our current service area — we'll reach out the moment Apex covers your ZIP."
            : 'A coordinator will confirm your appointment shortly. A copy is on its way to your email.';
          const pr = price(),
            dt = state.date ? state.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '';
          $('#succMeta').textContent = (state.service ? state.service.name : '') + (dt ? ' · ' + dt : '') + (state.time ? ' · ' + state.time : '') + (!wl && pr.total ? ' · $' + pr.total + (pr.unit || '') : '');
          typeRef(state.ref);
          badge.classList.add('show');
          if (hasGSAP && !reduce) {
            gsap.fromTo(badge, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
            gsap.to(badge, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, delay: 0.6, ease: 'power1.inOut' });
          }
          confetti();
        }, 1250);
      }
      function typeRef(ref) {
        const el = $('#refOut');
        if (reduce) {
          el.textContent = ref;
          return;
        }
        el.textContent = '';
        let i = 0;
        (function tick() {
          el.textContent = ref.slice(0, i);
          const c = document.createElement('span');
          c.className = 'car';
          el.appendChild(c);
          i++;
          if (i <= ref.length) setTimeout(tick, 60);
          else setTimeout(() => c.remove(), 1100);
        })();
      }
      function confetti() {
        const cv = $('#confettiC');
        if (!cv || reduce) return;
        const r = cv.parentElement.getBoundingClientRect();
        cv.width = r.width;
        cv.height = r.height;
        const ctx = cv.getContext('2d'),
          cols = ['#2563EB', '#6FB4D6', '#C97B4A', '#2F7A5B', '#ffffff'];
        const P = Array.from({ length: 90 }, () => ({ x: cv.width / 2, y: cv.height * 0.3, vx: (Math.random() - 0.5) * 7, vy: Math.random() * -7 - 2, g: 0.17, r: Math.random() * 4 + 2, c: cols[Math.floor(Math.random() * cols.length)], a: 1, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.32 }));
        let f = 0;
        (function d() {
          ctx.clearRect(0, 0, cv.width, cv.height);
          P.forEach((p) => {
            p.vy += p.g;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            p.a -= 0.006;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.a);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2.6);
            ctx.restore();
          });
          if (++f < 160) requestAnimationFrame(d);
          else ctx.clearRect(0, 0, cv.width, cv.height);
        })();
      }

      // NOTE: booking is now opened as a modal (#book lives in a hidden overlay),
      // so the original scroll-into-view reveals of .wizard/.preview were removed —
      // a ScrollTrigger on a hidden element never fires and would strand the
      // content at opacity:0. The modal provides its own open animation.
      if (hasGSAP && !reduce) {
        if (fine) {
          const prev = $('#preview');
          root.addEventListener('mousemove', (e) => {
            const b = root.getBoundingClientRect();
            gsap.to(prev, { x: ((e.clientX - b.left) / b.width - 0.5) * 10, y: ((e.clientY - b.top) / b.height - 0.5) * 8, duration: 0.9, ease: 'power2.out' });
          });
        }
      }

      buildCustomize();
      renderCal();
      update();
      show(0);
    }

    const v = document.getElementById('heroVideo');
    if (v) v.play().catch(() => {});
  }

  // ======================================================================
  // TESTIMONIALS
  // ======================================================================
  function initTestimonials() {
    const root = document.getElementById('testimonials');
    if (!root) return;
    const G = hasGSAP;
    const DATA = TDATA;
    const STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z"/></svg>';
    const starsEl = document.getElementById('txStars');
    starsEl.innerHTML = STAR.repeat(5);
    const track = document.getElementById('txTrack');
    track.innerHTML = DATA.map((d, i) => `<div class="tx-card${i === 0 ? ' active' : ''}" data-i="${i}"><img src="${IMG[d.id]}" alt="${d.n}"><div class="tx-cap"><div class="n">${d.n}</div><div class="r">${d.r}</div></div></div>`).join('');
    const cards = [...track.querySelectorAll('.tx-card')];
    const qEl = document.getElementById('txQuote'),
      wEl = document.getElementById('txWho'),
      rEl = document.getElementById('txRole');
    let idx = -1,
      timer = null;

    function fill(i) {
      const d = DATA[i];
      qEl.textContent = '“' + d.q + '”';
      wEl.textContent = d.n;
      rEl.textContent = d.r;
    }
    function textAnim() {
      if (!G || reduce) return;
      gsap.fromTo([qEl, wEl, rEl], { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.09, ease: 'power3.out' });
      gsap.fromTo(starsEl.children, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(2)' });
    }
    function set(i) {
      i = (i + DATA.length) % DATA.length;
      if (i === idx) return;
      cards.forEach((c, k) => c.classList.toggle('active', k === i));
      idx = i;
      if (reduce) {
        fill(i);
        return;
      }
      fill(i);
      textAnim();
    }
    function play() {
      stop();
      if (reduce) return;
      timer = setInterval(() => set(idx + 1), 4400);
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    cleanups.push(stop);

    cards.forEach((c) =>
      c.addEventListener('click', () => {
        set(+c.dataset.i);
        play();
      })
    );
    document.getElementById('txPrev').addEventListener('click', () => {
      set(idx - 1);
      play();
    });
    document.getElementById('txNext').addEventListener('click', () => {
      set(idx + 1);
      play();
    });
    if (matchMedia('(pointer:fine)').matches) {
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', play);
    }

    idx = 0;
    fill(0);
    if (G && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('#testimonials .tx-card', { y: 24, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '#testimonials .tx-track', start: 'top 86%' } });
      ScrollTrigger.create({
        trigger: root,
        start: 'top 68%',
        once: true,
        onEnter: () => {
          textAnim();
          play();
        },
      });
    } else {
      play();
    }
  }

  // ======================================================================
  // RECURRING PLANS — accordion
  // ======================================================================
  function initRecurringAccordion() {
    const root = document.getElementById('recurring');
    if (!root) return;
    const G = hasGSAP;
    const items = [...root.querySelectorAll('.rp-item')];
    items.forEach((it) => {
      it.querySelector('.rp-head').addEventListener('click', () => {
        const open = it.classList.contains('open');
        items.forEach((o) => o.classList.remove('open'));
        if (!open) it.classList.add('open');
      });
    });
    const v = root.querySelector('video');
    if (v) {
      v.muted = true;
      v.play && v.play().catch(() => {});
    }
    if (G && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(root.querySelectorAll('.rp-left .rv'), { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: root, start: 'top 74%' } });
      gsap.fromTo('#recurring .rp-right', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 78%' } });
    } else {
      root.querySelectorAll('.rv').forEach((e) => {
        e.style.opacity = 1;
        e.style.transform = 'none';
      });
    }
  }

  // ======================================================================
  // SERVICE COVERAGE
  // ======================================================================
  function initCoverage() {
    const root = document.getElementById('coverage');
    if (!root) return;
    const G = hasGSAP;
    const TOWNS = [
      ['Cary', '15 MIN'],
      ['Apex', '18 MIN'],
      ['Morrisville', '20 MIN'],
      ['Raleigh', '22 MIN'],
      ['Holly Springs', '25 MIN'],
      ['Garner', '28 MIN'],
      ['Wake Forest', '30 MIN'],
      ['Fuquay-Varina', '35 MIN'],
      ['Knightdale', '38 MIN'],
    ];
    // The town rows are normally server-rendered by the Coverage component (live
    // Service Areas). Only inject the static fallback if React rendered nothing.
    const covList = document.getElementById('covList');
    if (covList && !covList.children.length) {
      covList.innerHTML = TOWNS.map((t) => `<div class="cov-row"><span class="t">${t[0]}</span><span class="m">${t[1]}</span></div>`).join('');
    }
    const v = root.querySelector('video');
    if (v) {
      v.muted = true;
      v.play && v.play().catch(() => {});
    }

    function count(el) {
      const to = +el.dataset.count,
        suf = el.dataset.suffix || '';
      const o = { n: 0 };
      if (!G || reduce) {
        el.textContent = to + suf;
        return;
      }
      gsap.to(o, { n: to, duration: 1.4, ease: 'power2.out', onUpdate: () => {
        el.textContent = Math.round(o.n) + suf;
      } });
    }

    if (G && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(root.querySelectorAll('.cov-left .cv'), { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: root, start: 'top 74%' } });
      gsap.to('#coverage .cov-mid', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#coverage .cov-mid', start: 'top 82%' } });
      gsap.from('#covList .cov-row', { y: 14, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '#covList', start: 'top 84%' } });
      gsap.fromTo('#coverage .cov-map', { y: 24, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#coverage .cov-map', start: 'top 82%' } });
      gsap.to('#coverage .cov-pill', { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '#coverage .cov-pill', start: 'top 92%' } });
      ScrollTrigger.create({ trigger: '#coverage .cov-stats', start: 'top 82%', once: true, onEnter: () => root.querySelectorAll('.cov-stat .n [data-count],.cov-stat .n[data-count]').forEach(count) });
      gsap.to('#coverage .cov-map video', { scale: 1.12, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    } else {
      root.querySelectorAll('.cv').forEach((e) => {
        e.style.opacity = 1;
        e.style.transform = 'none';
      });
      root.querySelectorAll('[data-count]').forEach(count);
    }
  }

  // ======================================================================
  // FAQ
  // ======================================================================
  function initFaq() {
    const root = document.getElementById('faq');
    if (!root) return;
    const G = hasGSAP;
    const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    const FAQ = [
      ['How quickly can I get a pro?', 'Most requests are confirmed within a few hours. A coordinator reviews your booking and schedules the first available window — often same-week across Wake County, and next-day for many recurring services.'],
      ['Are your professionals background-checked?', 'Yes. Every Apex pro is vetted before they join, and licensed trades — pest control, home security and more — carry the required NC credentials. One accountable team stands behind every visit.'],
      ["What if I'm not satisfied?", 'Tell us and we will make it right. If anything is not up to standard, we return to re-do the work — your booking is not finished until you are happy with it.'],
      ['Can I choose the same pro every time?', 'On recurring plans (cleaning, lawn, pool and pest) we keep the same trusted crew on your home wherever possible, so they learn your space and your preferences over time.'],
      ['How does plan pricing work?', 'Pick a frequency — weekly, biweekly or monthly — and your per-visit price drops with a set discount, up to 22% on weekly. You always see the exact price before you book: no lead auctions, no surprise fees.'],
    ];
    document.getElementById('faqList').innerHTML = FAQ.map(
      (f) => `<div class="faq-item fv">
     <button class="faq-q" type="button"><span>${f[0]}</span><span class="faq-ic">${CHEV}</span></button>
     <div class="faq-a"><div class="faq-a-in"><p>${f[1]}</p></div></div></div>`
    ).join('');
    root.querySelectorAll('.faq-item').forEach((it) => {
      it.querySelector('.faq-q').addEventListener('click', () => it.classList.toggle('open'));
    });
    if (G && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(root.querySelectorAll('.faq-head .fv'), { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: root, start: 'top 78%' } });
      gsap.to('#faqList .faq-item', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: '#faqList', start: 'top 84%' } });
    } else {
      root.querySelectorAll('.fv').forEach((e) => {
        e.style.opacity = 1;
        e.style.transform = 'none';
      });
    }
  }

  // ======================================================================
  // BOOKING — reveal flourish (originally deferred to window.load)
  // ======================================================================
  function initBookWow() {
    // Booking is now a modal (#book lives in a hidden overlay). The original
    // scroll-into-view flourish (hiding .svc cards / .book-head, then revealing
    // on scroll) is disabled: those ScrollTriggers never fire inside a hidden
    // overlay and would leave the content stranded at opacity:0. The cards and
    // heading are visible by default; the modal supplies its own open animation.
  }

  // ======================================================================
  // RECURRING video rotator
  // ======================================================================
  function initRpVids() {
    const box = document.getElementById('rpVids');
    if (!box) return;
    const vids = [...box.querySelectorAll('.rpv')];
    if (vids.length < 2) return;
    let i = 0;
    vids.forEach((v, k) => {
      v.muted = true;
      if (k === 0) v.play && v.play().catch(() => {});
    });
    if (reduce) return;
    every(() => {
      const cur = vids[i],
        nx = vids[(i + 1) % vids.length];
      try {
        nx.currentTime = 0;
      } catch (e) {}
      nx.play && nx.play().catch(() => {});
      nx.classList.add('on');
      cur.classList.remove('on');
      setTimeout(() => {
        try {
          cur.pause();
        } catch (e) {}
      }, 1300);
      i = (i + 1) % vids.length;
    }, 5200);
  }

  // ======================================================================
  // HERO video rotator
  // ======================================================================
  function initHeroVids() {
    const box = document.getElementById('heroVids');
    if (!box) return;
    const vids = [...box.querySelectorAll('.hv')];
    if (vids.length < 2) return;
    let i = 0;
    vids.forEach((v, k) => {
      v.muted = true;
      if (k !== 0) {
        try {
          v.pause();
        } catch (e) {}
      } else {
        v.play && v.play().catch(() => {});
      }
    });
    if (reduce) return;
    every(() => {
      const cur = vids[i],
        nx = vids[(i + 1) % vids.length];
      try {
        nx.currentTime = 0;
      } catch (e) {}
      nx.play && nx.play().catch(() => {});
      nx.classList.add('on');
      cur.classList.remove('on');
      setTimeout(() => {
        try {
          cur.pause();
        } catch (e) {}
      }, 1400);
      i = (i + 1) % vids.length;
    }, 7000);
  }

  // ======================================================================
  // FOOTER reveal
  // ======================================================================
  function initFooter() {
    const ft = document.querySelector('.site-foot');
    if (!ft) return;
    if (hasGSAP && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('.site-foot .fv2').forEach((el) => {
        // Neutralize any leaked chrome.css `.fv2` CSS transition (it persists onto
        // home after client-nav from a chrome.css route) so it can't fight this tween.
        el.style.transition = 'none';
        gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
      });
    } else {
      ft.querySelectorAll('.fv2').forEach((e) => {
        e.style.opacity = 1;
        e.style.transform = 'none';
      });
    }
  }
}

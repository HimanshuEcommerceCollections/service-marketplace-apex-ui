/* eslint-disable */
// Apex home-page runtime.
//
// Ported (near-verbatim) from every <script> block in apex-hero-extracted.html:
// GSAP + ScrollTrigger scroll choreography, the Lenis smooth-scroll instance, the
// testimonial carousel, accordions, video rotators and the hero particle field.
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
  // Touch/small-screen: skip the scroll-scrubbed transforms and the particle
  // field. Phones scroll with the native (non-Lenis) scroller, so scrubbed
  // tweens snap 1:1 to each scroll event with no easing — combined with the
  // full-screen video + blur compositing they made the first screens feel
  // janky. One-shot reveals (non-scrub) stay on.
  const mobile = !fine || matchMedia('(max-width: 900px)').matches;

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
  // Mobile URL-bar show/hide fires resize mid-gesture; without this ScrollTrigger
  // refreshes every vh-sized section during the first swipe (visible hitch).
  ScrollTrigger.config({ ignoreMobileResize: true });

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
  // parallax, particles)
  //
  // The closing CTA band is NOT here — it is the shared section
  // (components/shared/CtaBand.tsx), and its film + cursor keyhole are wired by
  // mountCtaBand(), which ApexHome calls alongside mountApex. Only the GSAP
  // reveal/copy-stagger for `.acta` stays below, since GSAP is home-only.
  // ======================================================================
  function initMain() {
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

      /* Hero exit — no pin: hero scrolls away, Featured services appears immediately.
         Skipped on mobile: scrubbing a playing full-screen video + the blurred
         blend-mode ambient layer drops frames on phone GPUs. */
      if (!mobile) {
        gsap
          .timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
          .to('#heroMedia', { scale: 1.1, ease: 'none' }, 0)
          .to('#ambient', { yPercent: 18, xPercent: 12, ease: 'none' }, 0)
          .to('#heroContent', { yPercent: -8, ease: 'none' }, 0)
          .to('.scroll-cue', { opacity: 0, ease: 'none' }, 0);
      }

      /* Bridge */
      if (!mobile) {
        gsap.to('#bridgeImg', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '#bridge', start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      gsap.from('[data-bridge]', { y: 34, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '#bridge', start: 'top 62%' } });

      /* Chapters: media parallax (desktop only — the CSS Ken Burns zoom keeps
         the imagery alive on mobile without per-scroll-event work) + content reveal */
      gsap.utils.toArray('.chapter').forEach((ch) => {
        if (!mobile) {
          const media = ch.querySelector('.ch-media');
          gsap.fromTo(
            media,
            { scale: 1.16, yPercent: -4 },
            { scale: 1.02, yPercent: 4, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: 0.4 } }
          );
        }
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

    /* Particles — desktop only: a full-screen DPR-2 canvas redrawn every frame
       with shadowBlur competes with video decode + scroll on phone GPUs. */
    if (!reduce && !mobile) {
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

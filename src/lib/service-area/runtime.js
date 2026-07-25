/* eslint-disable */
// Apex Service Area page runtime.
//
// Ported from the <script> block of apex-service-area_extracted.html:
//   reveal-on-scroll, the coverage stat count-up, map-pin -> city scroll,
//   the ZIP-availability checker, the waitlist form (validation + success),
//   the FAQ accordion, and the button ripple.
//
// React adaptations (same spirit as the pricing/membership ports):
//   - The load-time IIFE becomes mountServiceArea(servedZips), called from the
//     page's useEffect once the DOM is committed. The served-ZIP set comes from
//     the data layer (data/service-area/content.ts), not from here.
//   - The source's nav-shrink/burger + footer reveal/watermark handlers are
//     dropped: the page renders the shared <SiteNav/>/<SiteFooter/>, driven by
//     mountChrome().
//   - Everything registers a disposer so listeners / observers / timeouts tear
//     down cleanly on unmount (StrictMode-safe).

export function mountServiceArea(servedZips) {
  const cleanups = [];
  const on = (t, type, fn, opts) => {
    if (!t) return;
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  const SERVED = {};
  (servedZips || []).forEach((z) => {
    SERVED[z] = 1;
  });

  initReveal();
  initStats();
  initPins();
  initZip();
  initWaitlist();
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
  // map pins -> scroll to the matching city card
  // ======================================================================
  function initPins() {
    [].slice.call(document.querySelectorAll('.pin')).forEach((p) => {
      on(p, 'click', () => {
        const c = document.getElementById('city-' + p.dataset.city);
        if (c) c.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      });
    });
  }

  // ======================================================================
  // ZIP-availability checker
  // ======================================================================
  function initZip() {
    const zi = document.getElementById('zipInput');
    const zr = document.getElementById('zipResult');
    if (!zi || !zr) return;

    function checkZip() {
      const v = (zi.value || '').trim();
      const wrap = zi.closest('.ff');
      wrap.classList.remove('err');
      const msg = wrap.querySelector('.msg');
      if (msg) msg.textContent = '';
      if (!/^\d{5}$/.test(v)) {
        wrap.classList.add('err');
        if (msg) msg.textContent = 'Enter a valid 5-digit ZIP code';
        zr.innerHTML = '';
        return;
      }
      if (SERVED[v]) {
        zr.innerHTML =
          '<div class="zip-state ok show"><div class="zh"><span class="zbadge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>Great news! Apex serves your area.</div><p>Book online in about 90 seconds — same trusted local team, transparent pricing.</p><div class="zbtns"><a class="btn btn-primary ripple" href="/book">Book now</a><a class="btn btn-line ripple" href="#services">View services</a></div></div>';
      } else {
        zr.innerHTML =
          '<div class="zip-state no show"><div class="zh"><span class="zbadge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></span>We’re not in your area yet.</div><p>We’re expanding across the Triangle fast. Join the waitlist and we’ll notify you the moment we reach ' +
          v +
          '.</p><div class="zbtns"><a class="btn btn-primary ripple" href="#waitlist" id="toWait">Join the waitlist</a></div></div>';
        const tw = document.getElementById('toWait');
        on(tw, 'click', () => {
          const wz = document.getElementById('wZip');
          if (wz) {
            wz.value = v;
            wz.dispatchEvent(new Event('input'));
          }
        });
      }
    }

    on(document.getElementById('zipCheck'), 'click', checkZip);
    on(zi, 'keydown', (e) => {
      if (e.key === 'Enter') checkZip();
    });
    on(zi, 'input', () => {
      zi.value = zi.value.replace(/\D/g, '').slice(0, 5);
    });
  }

  // ======================================================================
  // waitlist form — per-field validation + success state
  // ======================================================================
  function initWaitlist() {
    const wf = {
      wName: (v) => v.length > 1,
      wEmail: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
      wPhone: (v) => v.replace(/\D/g, '').length >= 10,
      wZip: (v) => /^\d{5}$/.test(v),
    };
    Object.keys(wf).forEach((id) => {
      const e = document.getElementById(id);
      if (!e) return;
      on(e, 'input', () => {
        const wrap = e.closest('.ff');
        const ok = wf[id](e.value.trim());
        wrap.classList.toggle('ok', ok && e.value.length > 0);
        wrap.classList.toggle('err', !ok && e.value.length > 0);
      });
    });

    const btn = document.getElementById('waitBtn');
    if (!btn) return;
    on(btn, 'click', function () {
      let allok = true;
      Object.keys(wf).forEach((id) => {
        const e = document.getElementById(id);
        if (!e) return;
        const ok = wf[id](e.value.trim());
        const wrap = e.closest('.ff');
        wrap.classList.toggle('ok', ok);
        wrap.classList.toggle('err', !ok);
        if (!ok) allok = false;
      });
      if (!allok) return;
      btn.disabled = true;
      btn.textContent = 'Joining…';
      const to = setTimeout(() => {
        const s = document.getElementById('waitSuccess');
        if (s) {
          s.classList.add('show');
          s.innerHTML =
            '<span class="wb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><div><b>You’re on the list!</b><span>We’ll notify you when Apex expands into your neighborhood.</span></div>';
        }
        btn.style.display = 'none';
      }, 700);
      cleanups.push(() => clearTimeout(to));
    });
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

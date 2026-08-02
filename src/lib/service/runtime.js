/* eslint-disable */
// Apex shared service-page runtime (cleaning, lawn care, and future services).
//
// Ported (near-verbatim) from the four <script> blocks in the extracted service
// pages (they share one template):
//   1. shared behaviour (reveal-on-scroll, count-up) + the configurator engine
//   2. the testimonial carousel
//   3. the .anav navbar + footer reveal + watermark parallax (inert now — the
//      pages use the shared <SiteNav/>/<SiteFooter/>; guarded no-ops)
//   4. the final-CTA video + cursor spotlight
//
// Deliberate adaptations for React (same spirit as the home page port):
//   1. The bootstrap that read `document.body.dataset.service` on DOMContentLoaded
//      is replaced by an exported mountService(slug, testimonials) that the page's
//      useEffect calls once the DOM is committed. `slug` selects the configurator
//      spec; `testimonials` feeds the carousel (each page passes its own).
//   2. Everything registers a disposer so the page tears down cleanly on unmount:
//      listeners, intervals, timeouts and IntersectionObservers are tracked, and
//      the DOM the configurator injects into #cfgFields / #cfgOut is cleared.
//
// Kept as .js on purpose: the original vanilla JS is preserved as-is (it is not in
// the tsconfig `include`, so strict type-checking does not fight the verbatim code).
//
// The full multi-service SPEC is kept intact (it is the shared configurator engine);
// the `slug` argument selects which spec is active on a given page.

export function mountService(slug, testimonials) {
  const TDATA = testimonials || [];
  const cleanups = [];
  const on = (t, type, fn, opts) => {
    if (!t) return;
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const every = (fn, ms) => {
    const id = setInterval(fn, ms);
    cleanups.push(() => clearInterval(id));
    return id;
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const BOOK = (s) => `/book?service=${s}`;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  initBehaviour();
  initConfig(slug);
  initTestimonials();
  initNavFooter();
  initFinalCta();

  return () => {
    cleanups.forEach((c) => {
      try {
        c();
      } catch (e) {}
    });
  };

  // ======================================================================
  // 1a. Shared behaviour — nav (legacy #nav, harmless if absent), reveal, count-up
  // ======================================================================
  function initBehaviour() {
    /* nav scroll-state is owned by the shared chrome runtime (mountChrome); the
       original page's #nav/.anav handlers are no longer used here. */

    /* ---- reveal ---- */
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
    $$('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 60 + 'ms';
      io.observe(el);
    });
    cleanups.push(() => io.disconnect());

    /* ---- count up ---- */
    $$('[data-count]').forEach((el) => {
      const to = parseFloat(el.dataset.count),
        suf = el.dataset.suf || '';
      const o = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              let s = 0,
                st = performance.now(),
                d = 1200;
              const tick = (t) => {
                let p = Math.min(1, (t - st) / d);
                el.textContent = (to % 1 ? (to * p).toFixed(1) : Math.round(to * p)) + suf;
                if (p < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
              o.unobserve(e.target);
            }
          }),
        { threshold: 0.5 }
      );
      o.observe(el);
      cleanups.push(() => o.disconnect());
    });
  }

  // ======================================================================
  // 1b. Configurator engine (shared spec for every service)
  // ======================================================================
  function initConfig(activeSlug) {
    const CHK =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

    const SPEC = {
      cleaning: {
        // Live-priced: the shown amount comes from the server recompute
        // (POST /services/cleaning/config/price). `sel` maps this UI's state to
        // the server config's group/option keys; compute() is the offline fallback.
        live: true,
        sel: (s) => ({
          'cleaning-type': { standard: 'standard', deep: 'deep', move: 'move-in-out' }[s.type],
          bedrooms: String(s.beds),
          bathrooms: String(s.baths),
          frequency: { once: 'one-time', weekly: 'weekly', biweekly: 'biweekly', monthly: 'monthly' }[s.freq],
        }),
        fields: [
          // ranges match the server config (bedrooms 1-5, bathrooms 1-4)
          { t: 'stepper', k: 'beds', label: 'Bedrooms', min: 1, max: 5, def: 2 },
          { t: 'stepper', k: 'baths', label: 'Bathrooms', min: 1, max: 4, def: 2 },
          { t: 'seg', k: 'type', label: 'Cleaning type', def: 'standard', opts: [
            { v: 'standard', label: 'Standard' }, { v: 'deep', label: 'Deep clean' }, { v: 'move', label: 'Move in / out' }] },
          { t: 'seg', k: 'freq', label: 'Frequency', def: 'once', opts: [
            { v: 'once', label: 'One-time' }, { v: 'weekly', label: 'Weekly' }, { v: 'biweekly', label: 'Biweekly' }, { v: 'monthly', label: 'Monthly' }] },
        ],
        compute(s) {
          let base = 79 + s.beds * 18 + s.baths * 22;
          base *= s.type === 'deep' ? 1.6 : s.type === 'move' ? 1.9 : 1;
          const disc = { once: 0, weekly: 0.22, biweekly: 0.15, monthly: 0.08 }[s.freq];
          const price = base * (1 - disc);
          const fl = { once: 'One-time', weekly: 'Weekly', biweekly: 'Biweekly', monthly: 'Monthly' };
          const tl = { standard: 'Standard', deep: 'Deep clean', move: 'Move in / out' };
          return {
            state: 'PRICED', amount: price, unit: s.freq === 'once' ? '' : '/visit',
            sub: s.freq === 'once' ? 'One-time visit' : `Billed per ${fl[s.freq].toLowerCase()} visit`,
            save: disc ? `Save ${Math.round(disc * 100)}% vs one-time` : '',
            summary: [['Home', `${s.beds} bed · ${s.baths} bath`], ['Type', tl[s.type]], ['Frequency', fl[s.freq]]],
          };
        },
      },
      'lawn-care': {
        fields: [
          { t: 'seg', k: 'lot', label: 'Lot size', hint: 'Approximate yard size', def: 'm', opts: [
            { v: 's', label: 'Small · <5k sq ft' }, { v: 'm', label: 'Medium · 5–10k' }, { v: 'l', label: 'Large · 10–20k' }, { v: 'xl', label: 'XL · 20k+' }] },
          { t: 'seg', k: 'svc', label: 'Service', def: 'mow', opts: [{ v: 'mow', label: 'Mow & edge' }, { v: 'full', label: 'Full care +' }] },
          { t: 'seg', k: 'freq', label: 'Frequency', def: 'weekly', opts: [{ v: 'once', label: 'One-time' }, { v: 'weekly', label: 'Weekly' }, { v: 'biweekly', label: 'Biweekly' }] },
        ],
        compute(s) {
          if (s.lot === 'xl') return { state: 'QUOTE', sub: 'Large lots are quoted after a quick look',
            summary: [['Lot', '20k+ sq ft'], ['Service', s.svc === 'full' ? 'Full care' : 'Mow & edge']] };
          const base = { s: 39, m: 59, l: 89 }[s.lot] + (s.svc === 'full' ? 15 : 0);
          const disc = { once: 0, weekly: 0.1, biweekly: 0.05 }[s.freq];
          return { state: 'FROM', amount: base * (1 - disc), unit: '/visit',
            sub: 'Starting price — final quote confirmed on first visit',
            save: disc ? `Save ${Math.round(disc * 100)}% recurring` : '',
            summary: [['Lot', { s: 'Small', m: 'Medium', l: 'Large' }[s.lot]], ['Service', s.svc === 'full' ? 'Full care' : 'Mow & edge'], ['Frequency', s.freq]] };
        },
      },
      'power-washing': {
        fields: [
          { t: 'check', k: 'areas', label: 'What needs washing?', hint: 'Select all that apply', opts: [
            { v: 'drive', label: 'Driveway', price: 99 }, { v: 'siding', label: 'House siding', price: 149 },
            { v: 'deck', label: 'Deck / patio', price: 119 }, { v: 'fence', label: 'Fence', price: 89 },
            { v: 'roof', label: 'Roof / gutters', price: 199 }, { v: 'walk', label: 'Walkways', price: 79 }] },
        ],
        compute(s) {
          const map = { drive: 99, siding: 149, deck: 119, fence: 89, roof: 199, walk: 79 };
          const sel = s.areas || [];
          let sum = sel.reduce((a, v) => a + map[v], 0);
          if (!sel.length) return { state: 'FROM', amount: 79, unit: '', sub: 'Select areas to estimate — starts at $79', summary: [] };
          return { state: 'FROM', amount: sum, unit: '', sub: 'Starting estimate — confirmed on site',
            summary: sel.map((v) => [{ drive: 'Driveway', siding: 'Siding', deck: 'Deck/patio', fence: 'Fence', roof: 'Roof/gutters', walk: 'Walkways' }[v], money(map[v])]) };
        },
      },
      painting: {
        fields: [
          { t: 'seg', k: 'scope', label: 'Project scope', def: 'room', opts: [
            { v: 'room', label: 'Single room' }, { v: 'multi', label: 'Multiple rooms' }, { v: 'interior', label: 'Whole interior' }, { v: 'exterior', label: 'Exterior' }] },
          { t: 'seg', k: 'surface', label: 'Surfaces', def: 'walls', opts: [{ v: 'walls', label: 'Walls' }, { v: 'trim', label: 'Walls + trim' }, { v: 'ceil', label: 'Walls + ceilings' }] },
        ],
        compute(s) {
          if (s.scope === 'room') {
            let a = 349 + (s.surface === 'trim' ? 120 : s.surface === 'ceil' ? 160 : 0);
            return { state: 'FROM', amount: a, unit: '', sub: 'Starting price for one standard room',
              summary: [['Scope', 'Single room'], ['Surfaces', { walls: 'Walls', trim: 'Walls + trim', ceil: 'Walls + ceilings' }[s.surface]]] };
          }
          return { state: 'QUOTE', sub: 'Larger projects get a free on-site estimate',
            summary: [['Scope', { multi: 'Multiple rooms', interior: 'Whole interior', exterior: 'Exterior' }[s.scope]], ['Surfaces', { walls: 'Walls', trim: 'Walls + trim', ceil: 'Walls + ceilings' }[s.surface]]] };
        },
      },
      'junk-removal': {
        fields: [
          { t: 'load', k: 'load', label: 'How much to haul?', def: 'q', opts: [
            { v: 'q', label: '¼ truck', sub: 'A few items', price: 99, fill: 25 },
            { v: 'h', label: '½ truck', sub: 'Room-worth', price: 179, fill: 50 },
            { v: 't', label: '¾ truck', sub: 'Large clear-out', price: 259, fill: 75 },
            { v: 'f', label: 'Full truck', sub: 'Whole garage', price: 329, fill: 100 }] },
        ],
        compute(s) {
          const m = { q: ['¼ truck', 99], h: ['½ truck', 179], t: ['¾ truck', 259], f: ['Full truck', 329] }[s.load];
          return { state: 'PRICED', amount: m[1], unit: '', sub: 'All-in — labour, loading & disposal included',
            summary: [['Load size', m[0]], ['Includes', 'Lift, load & sweep-up']] };
        },
      },
      pool: {
        fields: [
          { t: 'seg', k: 'freq', label: 'Service frequency', def: 'weekly', opts: [
            { v: 'once', label: 'One-time' }, { v: 'weekly', label: 'Weekly' }, { v: 'biweekly', label: 'Biweekly' }, { v: 'monthly', label: 'Monthly' }] },
          { t: 'seg', k: 'type', label: 'Service type', def: 'standard', opts: [{ v: 'standard', label: 'Standard clean' }, { v: 'green', label: 'Green-to-clean +' }] },
        ],
        compute(s) {
          const base = { once: 149, weekly: 119, biweekly: 129, monthly: 139 }[s.freq] + (s.type === 'green' ? 80 : 0);
          const disc = { once: 0, weekly: 0.15, biweekly: 0.1, monthly: 0.05 }[s.freq];
          return { state: 'PRICED', amount: base, unit: s.freq === 'once' ? '' : '/visit',
            sub: s.freq === 'once' ? 'Single visit' : 'Balancing, skim & equipment check each visit',
            save: disc ? `Save ${Math.round(disc * 100)}% vs one-time` : '',
            summary: [['Frequency', s.freq], ['Type', s.type === 'green' ? 'Green-to-clean' : 'Standard clean']] };
        },
      },
      'pest-control': {
        fields: [
          { t: 'seg', k: 'prop', label: 'Property', def: 'house', opts: [{ v: 'apt', label: 'Apartment' }, { v: 'house', label: 'House' }, { v: 'large', label: 'Large home' }] },
          { t: 'seg', k: 'svc', label: 'Service', def: 'general', opts: [{ v: 'general', label: 'General pest' }, { v: 'mosquito', label: 'Mosquito +' }, { v: 'termite', label: 'Termite' }] },
        ],
        compute(s) {
          if (s.svc === 'termite') return { state: 'QUOTE', sub: 'Termite treatment is quoted after a free inspection',
            summary: [['Property', { apt: 'Apartment', house: 'House', large: 'Large home' }[s.prop]], ['Service', 'Termite']] };
          const base = { apt: 69, house: 89, large: 119 }[s.prop] + (s.svc === 'mosquito' ? 30 : 0);
          return { state: 'FROM', amount: base, unit: '/visit', sub: 'Starting price — recurring plans lower per-visit cost',
            summary: [['Property', { apt: 'Apartment', house: 'House', large: 'Large home' }[s.prop]], ['Service', s.svc === 'mosquito' ? 'General + mosquito' : 'General pest']] };
        },
      },
      'home-security': {
        fields: [
          { t: 'seg', k: 'size', label: 'Home size', def: 'm', opts: [{ v: 's', label: '1–2 bed' }, { v: 'm', label: '3–4 bed' }, { v: 'l', label: '5+ bed' }] },
          { t: 'check', k: 'want', label: 'Interested in', hint: 'Optional — helps us prep your consult', opts: [
            { v: 'cam', label: 'Cameras' }, { v: 'sensor', label: 'Door / window sensors' }, { v: 'lock', label: 'Smart locks' }, { v: 'monitor', label: '24/7 monitoring' }] },
        ],
        compute(s) {
          return { state: 'CONSULT', sub: 'A specialist designs your system and prices it in a free visit — no obligation.',
            summary: [['Home size', { s: '1–2 bed', m: '3–4 bed', l: '5+ bed' }[s.size]], ['Interested', s.want && s.want.length ? s.want.length + ' options' : 'To discuss']] };
        },
      },
      'smart-home': {
        fields: [
          { t: 'check', k: 'dev', label: 'Choose your devices', hint: 'Pick 3 or more and save 15% on install', opts: [
            { v: 'thermo', label: 'Smart thermostat', price: 129 }, { v: 'doorbell', label: 'Video doorbell', price: 149 },
            { v: 'cam', label: 'Cameras (2-pack)', price: 199 }, { v: 'lock', label: 'Smart locks', price: 139 },
            { v: 'light', label: 'Lighting kit', price: 119 }, { v: 'hub', label: 'Central hub', price: 99 }] },
        ],
        compute(s) {
          const map = { thermo: 129, doorbell: 149, cam: 199, lock: 139, light: 119, hub: 99 };
          const sel = s.dev || [];
          let sum = sel.reduce((a, v) => a + map[v], 0);
          if (!sel.length) return { state: 'PRICED', amount: 0, unit: '', sub: 'Select devices to see your install price', summary: [] };
          const on = sel.length >= 3;
          const total = on ? sum * 0.85 : sum;
          return { state: 'PRICED', amount: total, unit: '', sub: on ? '15% multi-device discount applied 🎉' : 'Add 3+ devices to unlock 15% off',
            save: on ? `You saved ${money(sum * 0.15)}` : '',
            summary: [['Devices', sel.length + ' selected'], ['Install', 'Setup & app config included']] };
        },
      },
      handyman: {
        fields: [
          { t: 'seg', k: 'kind', label: 'Task type', def: 'general', opts: [
            { v: 'general', label: 'Small repair' }, { v: 'mount', label: 'Mount / hang' }, { v: 'assemble', label: 'Assembly' }, { v: 'multi', label: 'Punch list' }] },
          { t: 'stepper', k: 'hours', label: 'Estimated hours', min: 1, max: 8, def: 2 },
          { t: 'task', k: 'note', label: 'Describe the task', hint: 'Optional — the more detail, the better we prep' },
        ],
        compute(s) {
          const rate = 95, total = rate * s.hours;
          return { state: 'FROM', amount: total, unit: '', sub: `Billed at ${money(rate)}/hr · 1-hour minimum`,
            summary: [['Task', { general: 'Small repair', mount: 'Mount / hang', assemble: 'Assembly', multi: 'Punch list' }[s.kind]], ['Est. time', s.hours + ' hr']] };
        },
      },
      'tree-stump': {
        fields: [
          { t: 'seg', k: 'job', label: 'Service', def: 'trim', opts: [{ v: 'trim', label: 'Trimming' }, { v: 'removal', label: 'Tree removal' }, { v: 'stump', label: 'Stump grinding' }, { v: 'full', label: 'Removal + stump' }] },
          { t: 'seg', k: 'size', label: 'Tree size', def: 'm', opts: [{ v: 's', label: 'Small' }, { v: 'm', label: 'Medium' }, { v: 'l', label: 'Large' }] },
        ],
        compute(s) {
          return { state: 'QUOTE', sub: 'Every tree is different — we quote after a free on-site assessment',
            summary: [['Service', { trim: 'Trimming', removal: 'Tree removal', stump: 'Stump grinding', full: 'Removal + stump' }[s.job]], ['Size', { s: 'Small', m: 'Medium', l: 'Large' }[s.size]]] };
        },
      },
    };

    const spec = SPEC[activeSlug];
    const host = $('#cfgFields');
    const out = $('#cfgOut');
    if (!spec || !host || !out) return;
    // Clear any previously injected DOM (StrictMode double-invoke / re-mount).
    cleanups.push(() => {
      host.innerHTML = '';
      out.innerHTML = '';
    });

    const state = {};
    spec.fields.forEach((f) => {
      if (f.t === 'check' || f.k === 'areas' || f.k === 'dev' || f.k === 'want') state[f.k] = [];
      else if (f.def !== undefined) state[f.k] = f.def;
      else state[f.k] = '';
    });

    spec.fields.forEach((f) => {
      const wrap = document.createElement('div');
      wrap.className = 'field';
      let inner = `<label>${f.label}</label>` + (f.hint ? `<div class="hint">${f.hint}</div>` : '');
      if (f.t === 'seg') {
        inner += '<div class="seg">' + f.opts.map((o) => `<button type="button" data-k="${f.k}" data-v="${o.v}" class="${o.v === f.def ? 'on' : ''}">${o.label}</button>`).join('') + '</div>';
      } else if (f.t === 'stepper') {
        inner += `<div class="stepper"><button type="button" data-step="-1" data-k="${f.k}">−</button><span class="num" id="num-${f.k}">${f.def}</span><button type="button" data-step="1" data-k="${f.k}">+</button></div>`;
      } else if (f.t === 'check') {
        inner += '<div class="check">' + f.opts.map((o) => `<label data-k="${f.k}" data-v="${o.v}"><span class="box">${CHK}</span>${o.label}${o.price ? `<span class="cprice">from ${money(o.price)}</span>` : ''}</label>`).join('') + '</div>';
      } else if (f.t === 'load') {
        inner += '<div class="loads">' + f.opts.map((o) => `<div class="load ${o.v === f.def ? 'on' : ''}" data-k="${f.k}" data-v="${o.v}" style="--fill:${o.fill}%"><div class="truck"></div><b>${o.label}</b><span>${o.sub}</span></div>`).join('') + '</div>';
      } else if (f.t === 'task') {
        inner += `<textarea class="task" data-k="${f.k}" placeholder="e.g. Mount a 55&quot; TV and hang three shelves in the living room"></textarea>`;
      }
      wrap.innerHTML = inner;
      host.appendChild(wrap);
    });

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';
    let liveTimer = null,
      liveSeq = 0,
      lastLive = null; // last server dollar amount — kept so changes don't flash to the offline estimate
    cleanups.push(() => clearTimeout(liveTimer));
    // Live-priced services fetch the authoritative amount from the server recompute.
    // First load fires immediately; later changes debounce briefly. Sequence-guarded
    // so a fast change wins over an in-flight request; the price dims while updating.
    function applyLivePrice(immediate) {
      const mySeq = ++liveSeq;
      const selections = spec.sel(state);
      const box = out.querySelector('.amount');
      if (box) box.classList.add('updating');
      clearTimeout(liveTimer);
      const go = () => {
        fetch(`${API_BASE}/services/${activeSlug}/config/price`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selections, quantity: 1 }),
        })
          .then((r) => r.json())
          .then((j) => {
            if (mySeq !== liveSeq) return; // superseded by a newer change
            const dp = j && j.data && j.data.displayed_price && j.data.displayed_price.total;
            if (!dp || typeof dp.amount !== 'number') return;
            lastLive = dp.amount / 100;
            const el = out.querySelector('.amt-v');
            if (el) el.textContent = money(lastLive);
          })
          .catch(() => {}) // keep the last price on error
          .finally(() => {
            if (mySeq !== liveSeq) return;
            const b = out.querySelector('.amount');
            if (b) b.classList.remove('updating');
          });
      };
      if (immediate) go();
      else liveTimer = setTimeout(go, 120);
    }

    function render() {
      const r = spec.compute(state);
      let html = '';
      if (r.state === 'QUOTE') {
        html += `<div class="state">Custom estimate</div><div class="amount">Custom<br>Estimate</div>`;
      } else if (r.state === 'CONSULT') {
        html += `<div class="state">No cost</div><div class="amount">Free<br>Consult</div>`;
      } else {
        const pre = r.state === 'FROM' ? '<small>from </small>' : '';
        // For live services keep the last server price on screen while the new one loads.
        const amtStr = spec.live && lastLive != null ? money(lastLive) : money(r.amount || 0);
        html += `<div class="state">${r.state === 'FROM' ? 'Starting at' : 'Your price'}</div><div class="amount">${pre}<span class="amt-v">${amtStr}</span><small>${r.unit || ''}</small><span class="cfg-spin"></span></div>`;
      }
      html += `<div class="sub">${r.sub || ''}</div>`;
      if (r.save) html += `<div class="save">${r.save}</div>`;
      if (r.summary && r.summary.length) html += '<div class="summary">' + r.summary.map((x) => `<div><span>${x[0]}</span><span>${x[1]}</span></div>`).join('') + '</div>';
      if (r.state === 'QUOTE') html += `<label class="cfg-desc-l">Describe your project</label><textarea id="cfgDesc" class="cfg-desc" placeholder="Size, access, timing, number of items or trees — anything that helps us quote accurately."></textarea>`;
      const cta = r.state === 'QUOTE' ? 'Get your custom estimate' : r.state === 'CONSULT' ? 'Request free consult' : 'Book this service';
      html += `<a class="btn btn-primary" href="${BOOK(activeSlug)}">${cta}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>`;
      html += `<div class="fineprint">Final price confirmed at booking. Your selection is carried into the booking flow.</div>`;
      out.innerHTML = html;
      if (spec.live && spec.sel && (r.state === 'PRICED' || r.state === 'FROM')) applyLivePrice(lastLive == null);
    }

    on(host, 'click', (e) => {
      const seg = e.target.closest('.seg button');
      if (seg) {
        const k = seg.dataset.k;
        state[k] = seg.dataset.v;
        $$(`.seg button[data-k="${k}"]`, host).forEach((b) => b.classList.toggle('on', b === seg));
        render();
        return;
      }
      const st = e.target.closest('.stepper button');
      if (st) {
        const k = st.dataset.k,
          f = spec.fields.find((x) => x.k === k);
        let v = state[k] + +st.dataset.step;
        v = Math.max(f.min, Math.min(f.max, v));
        state[k] = v;
        $('#num-' + k).textContent = v;
        render();
        return;
      }
      const ld = e.target.closest('.load');
      if (ld) {
        const k = ld.dataset.k;
        state[k] = ld.dataset.v;
        $$(`.load[data-k="${k}"]`, host).forEach((b) => b.classList.toggle('on', b === ld));
        render();
        return;
      }
      const ch = e.target.closest('.check label');
      if (ch) {
        const k = ch.dataset.k,
          v = ch.dataset.v,
          arr = state[k];
        const i = arr.indexOf(v);
        if (i >= 0) arr.splice(i, 1);
        else arr.push(v);
        ch.classList.toggle('on', i < 0);
        render();
        return;
      }
    });
    render();
  }

  // ======================================================================
  // 2. Testimonial carousel
  // ======================================================================
  function initTestimonials() {
    const DATA = TDATA.map((d) => ({ name: d.name, tag: d.tag, quote: d.quote }));
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
  // 3. .anav navbar + footer reveal + watermark parallax
  // ======================================================================
  function initNavFooter() {
    const nav = document.getElementById('anav');
    if (!nav) return;
    on(window, 'scroll', () => nav.classList.toggle('shrink', scrollY > 20), { passive: true });
    const b = document.getElementById('aburger');
    if (b) on(b, 'click', () => nav.classList.toggle('open'));
    [].slice.call(document.querySelectorAll('#alinks a')).forEach((a) => on(a, 'click', () => nav.classList.remove('open')));

    // footer reveal
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    [].slice.call(document.querySelectorAll('.afr')).forEach((el, i) => {
      el.style.transitionDelay = i * 90 + 'ms';
      io.observe(el);
    });
    cleanups.push(() => io.disconnect());

    // watermark parallax
    const wm = document.querySelector('.afoot-wm'),
      foot = document.querySelector('.afoot');
    if (wm && foot && !reduce) {
      on(window, 'scroll', () => {
        const r = foot.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) {
          const p = (innerHeight - r.top) / (innerHeight + r.height);
          wm.style.transform = 'translateX(-50%) translateY(' + (0.5 - p) * 60 + 'px)';
        }
      }, { passive: true });
    }
  }

  // ======================================================================
  // 4. Final CTA — background video + cursor spotlight
  // ======================================================================
  function initFinalCta() {
    const f = document.querySelector('.final.has-video');
    if (!f) return;
    const v = f.querySelector('video');
    if (v) {
      if (reduce) {
        try {
          v.pause();
        } catch (e) {}
      } else {
        const p = v.play && v.play();
        if (p && p.catch) p.catch(() => {});
      }
    }
    if (reduce) return;
    on(f, 'mousemove', (e) => {
      const r = f.getBoundingClientRect();
      f.classList.add('live');
      f.style.setProperty('--px', ((e.clientX - r.left) / r.width) * 100 + '%');
      f.style.setProperty('--py', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
    on(f, 'mouseleave', () => f.classList.remove('live'));
  }
}

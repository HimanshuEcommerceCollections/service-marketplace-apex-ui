/* eslint-disable */
// Apex /book page runtime — the multi-step booking engine.
//
// Ported near-verbatim from the <script> in apex-booking.html: the SVC catalog,
// per-service FIELDS, the price engine (with membership discount + 7% tax), the
// live sticky summary, step navigation, contact validation, review, submit →
// success + confetti.
//
// Adaptations for React:
//   1. Exported as mountBooking() (called from the page's useEffect once the DOM
//      is committed) instead of an IIFE.
//   2. Reads ?service=<slug> from the URL to preselect a service and jump to the
//      configure step — the site's CTAs link to /book?service=<slug> (data-service
//      slugs, e.g. lawn-care); mapped to the engine's ids (e.g. lawn).
//   3. The original teal-nav shrink + .afr footer-reveal script is dropped — the
//      page renders the shared <SiteNav/>/<SiteFooter/> and mountChrome() drives
//      their behavior.
//   4. Top-level listeners register a disposer so the page tears down cleanly
//      (StrictMode double-invoke / navigation). DOM built into #cfg/#pcard/#review
//      is replaced on each render, so its inner listeners die with it.

export function mountBooking() {
  const cleanups = [];
  const on = (t, ev, fn, opts) => {
    if (!t) return;
    t.addEventListener(ev, fn, opts);
    cleanups.push(() => t.removeEventListener(ev, fn, opts));
  };
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  var SVC = {
    cleaning: { name: 'Home Cleaning', ic: '<path d="M3 12l2-2h14l2 2v7a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M8 10V6a4 4 0 018 0v4"/>' },
    lawn: { name: 'Lawn Care', ic: '<path d="M3 20h18M6 20V8M10 20V5M14 20v-8M18 20V9"/>' },
    power: { name: 'Power Washing', ic: '<path d="M12 3v6M8 7l4-4 4 4M5 21h14l-2-9H7z"/>' },
    paint: { name: 'Painting', ic: '<path d="M4 20l6-6M14 6l4 4M13 5l6 6-9 3-3-3z"/>' },
    junk: { name: 'Junk Removal', ic: '<path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13h10l1-13"/>' },
    pool: { name: 'Pool Service', ic: '<path d="M2 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2M6 15V6a2 2 0 014 0M14 15V6a2 2 0 014 0"/>' },
    pest: { name: 'Pest Control', ic: '<path d="M12 3v3M9 6h6M8 10a4 4 0 018 0v4a4 4 0 01-8 0zM4 12h4M16 12h4M5 8l3 2M19 8l-3 2M5 16l3-2M19 16l-3-2"/>' },
    security: { name: 'Home Security', ic: '<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>' },
    smart: { name: 'Smart Home', ic: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><circle cx="12" cy="15" r="2"/>' },
    handyman: { name: 'Handyman', ic: '<path d="M14 7l3 3M3 21l9-9M14.7 3.3a2 2 0 013 3L9 15l-4 1 1-4z"/>' },
    tree: { name: 'Tree & Stump Removal', ic: '<path d="M12 22v-6M8 16a4 4 0 01-1-8 5 5 0 019.5-1.5A3.5 3.5 0 0116 16z"/>' },
  };
  function svgOf(k) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + SVC[k].ic + '</svg>';
  }

  // configurator field definitions
  var FIELDS = {
    cleaning: [
      { t: 'stepper', k: 'beds', label: 'Bedrooms', min: 1, max: 6, def: 2 },
      { t: 'stepper', k: 'baths', label: 'Bathrooms', min: 1, max: 5, def: 2 },
      { t: 'seg', k: 'size', label: 'Home size', def: 'm', opts: [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']] },
      { t: 'seg', k: 'type', label: 'Cleaning type', def: 'standard', opts: [['standard', 'Standard'], ['deep', 'Deep clean'], ['moveout', 'Move-out']] },
      { t: 'seg', k: 'freq', label: 'Frequency', def: 'once', opts: [['once', 'One-time'], ['weekly', 'Weekly'], ['biweekly', 'Bi-weekly'], ['monthly', 'Monthly']] }],
    lawn: [
      { t: 'seg', k: 'lot', label: 'Lot size', def: 'm', opts: [['s', 'Small'], ['m', 'Medium'], ['l', 'Large'], ['xl', 'XL']] },
      { t: 'seg', k: 'svc', label: 'Service', def: 'mow', opts: [['mow', 'Mow & edge'], ['full', 'Full care +']] },
      { t: 'seg', k: 'freq', label: 'Frequency', def: 'weekly', opts: [['once', 'One-time'], ['weekly', 'Weekly'], ['biweekly', 'Bi-weekly']] }],
    power: [
      { t: 'checks', k: 'areas', label: 'What needs washing?', opts: [['driveway', 'Driveway', 99], ['siding', 'House siding', 149], ['deck', 'Deck / patio', 119], ['fence', 'Fence', 89], ['roof', 'Roof / gutters', 199], ['walk', 'Walkways', 79]] }],
    paint: [
      { t: 'seg', k: 'scope', label: 'Project scope', def: 'room', opts: [['room', 'Single room'], ['multi', 'Multiple rooms'], ['interior', 'Whole interior'], ['exterior', 'Exterior']] },
      { t: 'seg', k: 'surface', label: 'Surfaces', def: 'walls', opts: [['walls', 'Walls'], ['trim', 'Walls + trim'], ['ceil', 'Walls + ceilings']] }],
    junk: [
      { t: 'load', k: 'load', label: 'How much to haul?', opts: [['q', '¼ Truck', 'A few items', 99, 25], ['h', '½ Truck', 'A room-worth', 179, 50], ['t', '¾ Truck', 'Large clear-out', 259, 75], ['f', 'Full Truck', 'Whole garage', 329, 100]] }],
    pool: [
      { t: 'seg', k: 'freq', label: 'Frequency', def: 'weekly', opts: [['once', 'One-time'], ['weekly', 'Weekly'], ['biweekly', 'Bi-weekly'], ['monthly', 'Monthly']] },
      { t: 'seg', k: 'type', label: 'Service type', def: 'standard', opts: [['standard', 'Standard clean'], ['green', 'Green-to-clean +']] }],
    pest: [
      { t: 'seg', k: 'freq', label: 'Frequency', def: 'quarterly', opts: [['once', 'One-time'], ['quarterly', 'Quarterly'], ['monthly', 'Monthly']] },
      { t: 'seg', k: 'cov', label: 'Coverage', def: 'both', opts: [['interior', 'Interior'], ['both', 'Interior + exterior']] }],
    smart: [
      { t: 'checks', k: 'devices', label: 'Choose your devices', opts: [['thermostat', 'Smart thermostat', 120], ['doorbell', 'Video doorbell', 180], ['locks', 'Smart locks', 160], ['cameras', 'Security cameras', 140], ['lighting', 'Smart lighting', 90], ['hub', 'Smart hub', 110]] }],
    handyman: [
      { t: 'seg', k: 'block', label: 'Time needed', def: '2h', opts: [['2h', '2 hours'], ['4h', '4 hours'], ['half', 'Half day'], ['full', 'Full day']] }],
    security: [{ t: 'quote' }],
    tree: [{ t: 'quote' }],
  };

  var state = { step: 1, service: null, cfg: {}, files: [], contact: {}, prop: 'House', date: '', slot: '', agree: false };

  // ---- price engine ----
  function money(n) { return '$' + Math.round(n).toLocaleString(); }
  function priceFor(id, c) {
    var b = 0, disc = 0, quote = false, label = '';
    if (id === 'cleaning') { b = 79 + (c.beds || 2) * 18 + (c.baths || 2) * 22 + { s: 0, m: 25, l: 60 }[c.size || 'm'] + { standard: 0, deep: 70, moveout: 120 }[c.type || 'standard'];
      disc = { once: 0, weekly: .15, biweekly: .12, monthly: .08 }[c.freq || 'once']; label = 'per visit'; }
    else if (id === 'lawn') { b = { s: 39, m: 59, l: 89, xl: 119 }[c.lot || 'm'] + (c.svc === 'full' ? 40 : 0); disc = { once: 0, weekly: .15, biweekly: .12 }[c.freq || 'weekly']; label = 'per visit'; }
    else if (id === 'power') { var A = { driveway: 99, siding: 149, deck: 119, fence: 89, roof: 199, walk: 79 }; (c.areas || []).forEach(function (a) { b += A[a]; }); if (!b) b = 0; }
    else if (id === 'paint') { if ((c.scope || 'room') === 'room') { b = 349 + { walls: 0, trim: 120, ceil: 160 }[c.surface || 'walls']; } else { quote = true; } }
    else if (id === 'junk') { b = { q: 99, h: 179, t: 259, f: 329 }[c.load || 'q']; }
    else if (id === 'pool') { b = { once: 149, weekly: 119, biweekly: 129, monthly: 139 }[c.freq || 'weekly'] + (c.type === 'green' ? 80 : 0); disc = (c.freq && c.freq !== 'once') ? .10 : 0; label = 'per visit'; }
    else if (id === 'pest') { b = { once: 149, quarterly: 119, monthly: 99 }[c.freq || 'quarterly'] + (c.cov === 'both' ? 40 : 0); disc = (c.freq === 'monthly') ? .10 : (c.freq === 'quarterly' ? .05 : 0); label = 'per visit'; }
    else if (id === 'smart') { var D = { thermostat: 120, doorbell: 180, locks: 160, cameras: 140, lighting: 90, hub: 110 }; var n = (c.devices || []).length; (c.devices || []).forEach(function (d) { b += D[d]; }); if (n >= 3) disc = .15; }
    else if (id === 'handyman') { b = { '2h': 150, '4h': 280, half: 400, full: 720 }[c.block || '2h']; }
    else if (id === 'security' || id === 'tree') { quote = true; }
    var save = Math.round(b * disc); var sub = b - save; var tax = +(sub * 0.07); var total = sub + tax;
    return { quote: quote, base: b, save: save, sub: sub, tax: tax, total: total, label: label, valid: (id === 'power' || id === 'smart') ? b > 0 : true };
  }

  // ---- configurator summary lines ----
  function cfgLines(id, c) {
    var L = []; var F = FIELDS[id] || [];
    F.forEach(function (f) {
      if (f.t === 'stepper') L.push([f.label, String(c[f.k] != null ? c[f.k] : f.def)]);
      else if (f.t === 'seg') { var v = c[f.k] || f.def; var o = f.opts.filter(function (x) { return x[0] === v; })[0]; if (o) L.push([f.label, o[1]]); }
      else if (f.t === 'checks') { var arr = c[f.k] || []; L.push([f.label, arr.length ? arr.length + ' selected' : '—']); }
      else if (f.t === 'load') { var o = f.opts.filter(function (x) { return x[0] === (c[f.k] || 'q'); })[0]; if (o) L.push([f.label, o[1]]); }
    });
    if (id === 'security' || id === 'tree' || ((id === 'paint') && (c.scope && c.scope !== 'room'))) L.push(['Type', 'Custom estimate']);
    return L;
  }

  // ---- render configurator (step 2) ----
  function renderCfg() {
    var id = state.service, F = FIELDS[id] || [], el = document.getElementById('cfg'), h = '';
    F.forEach(function (f) {
      if (f.t === 'quote') {
        h += '<div class="quote-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><p>This service is quoted after a quick review. Tell us about your project and add photos if handy.</p></div>';
        h += '<div class="fld"><label>Describe your project</label><div class="ff"><textarea id="qdesc" rows="5" placeholder=" " style="width:100%;padding:16px;border:1px solid var(--line);border-radius:14px;font:inherit;font-size:15px;resize:vertical"></textarea></div></div>';
        h += '<div class="fld"><label>Reference photos (optional)</label><div class="upload" id="drop"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg><b>Click to upload</b><span>PNG or JPG, up to 5 files</span><input type="file" id="file" accept="image/*" multiple hidden></div><div class="up-list" id="uplist"></div></div>';
      } else if (f.t === 'stepper') {
        var v = state.cfg[f.k] != null ? state.cfg[f.k] : f.def; state.cfg[f.k] = v;
        h += '<div class="fld"><label>' + f.label + '</label><div class="stepper" data-k="' + f.k + '" data-min="' + f.min + '" data-max="' + f.max + '"><button data-d="-1">−</button><span class="val">' + v + '</span><button data-d="1">+</button></div></div>';
      } else if (f.t === 'seg') {
        var cur = state.cfg[f.k] || f.def; state.cfg[f.k] = cur;
        h += '<div class="fld"><label>' + f.label + '</label><div class="seg" data-k="' + f.k + '">' + f.opts.map(function (o) { return '<button data-v="' + o[0] + '" class="' + (o[0] === cur ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div></div>';
      } else if (f.t === 'checks') {
        var arr = state.cfg[f.k] || []; state.cfg[f.k] = arr;
        h += '<div class="fld"><label>' + f.label + '</label><div class="checks" data-k="' + f.k + '">' + f.opts.map(function (o) { var on = arr.indexOf(o[0]) >= 0; return '<div class="chk ' + (on ? 'on' : '') + '" data-v="' + o[0] + '"><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><span class="t">' + o[1] + '</span><span class="pr">$' + o[2] + '</span></div>'; }).join('') + '</div></div>';
      } else if (f.t === 'load') {
        var cur = state.cfg[f.k] || 'q'; state.cfg[f.k] = cur;
        h += '<div class="fld"><label>' + f.label + '</label><div class="load" data-k="' + f.k + '">' + f.opts.map(function (o) { return '<div class="truck ' + (o[0] === cur ? 'on' : '') + '" data-v="' + o[0] + '"><div class="bar"><i style="height:' + o[4] + '%"></i></div><b>' + o[1] + '</b><span>' + o[2] + '</span><div class="p">$' + o[3] + '</div></div>'; }).join('') + '</div></div>';
      }
    });
    el.innerHTML = h;
    // wire controls (transient DOM — replaced on each renderCfg)
    el.querySelectorAll('.stepper').forEach(function (s) { s.querySelectorAll('button').forEach(function (btn) { btn.addEventListener('click', function () { var k = s.dataset.k, mn = +s.dataset.min, mx = +s.dataset.max; var v = (state.cfg[k] || 0) + +btn.dataset.d; v = Math.max(mn, Math.min(mx, v)); state.cfg[k] = v; s.querySelector('.val').textContent = v; sync(); }); }); });
    el.querySelectorAll('.seg').forEach(function (g) { g.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; g.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); state.cfg[g.dataset.k] = b.dataset.v; sync(); }); });
    el.querySelectorAll('.checks').forEach(function (g) { g.addEventListener('click', function (e) { var c = e.target.closest('.chk'); if (!c) return; var k = g.dataset.k, v = c.dataset.v, arr = state.cfg[k]; var i = arr.indexOf(v); if (i >= 0) { arr.splice(i, 1); c.classList.remove('on'); } else { arr.push(v); c.classList.add('on'); } sync(); }); });
    el.querySelectorAll('.load').forEach(function (g) { g.addEventListener('click', function (e) { var t = e.target.closest('.truck'); if (!t) return; g.querySelectorAll('.truck').forEach(function (x) { x.classList.remove('on'); }); t.classList.add('on'); state.cfg[g.dataset.k] = t.dataset.v; sync(); }); });
    var drop = el.querySelector('#drop'); if (drop) {
      var fi = el.querySelector('#file'); drop.addEventListener('click', function () { fi.click(); });
      fi.addEventListener('change', function () { state.files = [].slice.call(fi.files).slice(0, 5); var ul = el.querySelector('#uplist'); ul.innerHTML = state.files.map(function (f) { return '<span class="up-chip">' + f.name + '</span>'; }).join(''); });
    }
    var qd = el.querySelector('#qdesc'); if (qd) qd.addEventListener('input', function () { state.cfg.desc = qd.value; sync(); });
  }

  // ---- pricing card (step 3) ----
  function renderPrice() {
    var p = priceFor(state.service, state.cfg), el = document.getElementById('pcard');
    if (p.quote) { el.innerHTML = '<span class="glow"></span><span class="lbl">Your estimate</span><div class="custom">Custom Estimate</div><p style="position:relative;color:rgba(255,255,255,.75);margin-top:12px;max-width:38ch">A coordinator will review your project details and send a tailored quote — usually within one business day.</p>'; return; }
    var rows = '<div class="r"><span>Service</span><b>' + SVC[state.service].name + '</b></div>';
    cfgLines(state.service, state.cfg).forEach(function (l) { rows += '<div class="r"><span>' + l[0] + '</span><b>' + l[1] + '</b></div>'; });
    rows += '<div class="r"><span>Estimated price</span><b>' + money(p.base) + (p.label ? ' <small style="color:rgba(255,255,255,.5)">' + p.label + '</small>' : '') + '</b></div>';
    if (p.save > 0) rows += '<div class="r save"><span>Membership savings</span><b>−' + money(p.save) + '</b></div>';
    rows += '<div class="r"><span>Tax (7%)</span><b>' + money(p.tax) + '</b></div>';
    rows += '<div class="r total"><span>Total</span><b>$<span data-count id="pcTotal">0</span></b></div>';
    el.innerHTML = '<span class="glow"></span><span class="lbl">' + (p.label || 'Estimated total') + '</span><div class="amt">$<span data-count id="pcBig">0</span></div><div class="rows">' + rows + '</div>';
    countUp(document.getElementById('pcBig'), p.total, 900);
    countUp(document.getElementById('pcTotal'), p.total, 900);
  }

  // ---- sticky summary ----
  function sync() {
    var s = document.getElementById('sumBody');
    document.getElementById('sprog').style.width = (state.step / 5 * 100) + '%';
    if (!state.service) { s.innerHTML = '<div class="empty">Select a service to get started.</div>'; return; }
    var p = priceFor(state.service, state.cfg);
    var html = '<div class="srv"><span class="ic">' + svgOf(state.service) + '</span><div><b>' + SVC[state.service].name + '</b><span>Step ' + state.step + ' of 5</span></div></div>';
    var lines = cfgLines(state.service, state.cfg);
    if (lines.length) { html += '<div class="cfgsum">' + lines.map(function (l) { return '<div class="cs"><span>' + l[0] + '</span><b>' + l[1] + '</b></div>'; }).join('') + '</div>'; }
    html += '<div class="tot"><div class="est"><span>' + (p.quote ? 'Estimate' : (p.label || 'Estimated')) + '</span><b>' + (p.quote ? 'Custom' : money(p.total)) + '</b></div>';
    if (!p.quote && p.save > 0) html += '<div class="sv"><span>Membership savings</span><span>−' + money(p.save) + '/visit</span></div>';
    html += '</div>';
    if (!p.quote && p.save > 0) html += '<div class="badge"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z"/></svg>Member price applied</div>';
    s.innerHTML = html;
  }

  // ---- count up ----
  function countUp(el, to, dur) { if (!el) return; if (reduce) { el.textContent = Math.round(to).toLocaleString(); return; } var st = null, from = 0; function f(t) { if (!st) st = t; var p = Math.min((t - st) / dur, 1); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))).toLocaleString(); if (p < 1) requestAnimationFrame(f); } requestAnimationFrame(f); }

  // ---- step navigation ----
  function goStep(n) {
    if (n < 1 || n > 5) return;
    state.step = n;
    document.querySelectorAll('.step').forEach(function (s) { s.classList.toggle('active', +s.dataset.step === n); });
    document.getElementById('success').classList.remove('show');
    document.querySelectorAll('.stepdot').forEach(function (d) { var ds = +d.dataset.s; d.classList.toggle('active', ds === n); d.classList.toggle('done', ds < n); });
    document.getElementById('pfill').style.width = ((n - 1) / 4 * 88) + '%';
    if (n === 2) renderCfg();
    if (n === 3) renderPrice();
    if (n === 5) renderReview();
    sync();
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  // step 1: pick service
  document.querySelectorAll('.svc-card').forEach(function (c) {
    on(c, 'click', function () {
      document.querySelectorAll('.svc-card').forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel');
      state.service = c.dataset.id; state.cfg = {}; state.files = [];
      sync(); setTimeout(function () { goStep(2); }, 180);
    });
  });

  // back/continue buttons
  document.querySelectorAll('[data-go]').forEach(function (b) { on(b, 'click', function () { goStep(+b.dataset.go); }); });
  // progress clicks (go back to done steps)
  document.querySelectorAll('.stepdot').forEach(function (d) { on(d, 'click', function () { if (d.classList.contains('done')) goStep(+d.dataset.s); }); });

  // step 4 validation
  var V = { fn: 'First name required', ln: 'Last name required', em: 'Enter a valid email', ph: 'Enter a valid phone', st: 'Street required', ci: 'City required', stt: 'State required', zip: '5-digit ZIP required' };
  function validField(id) {
    var wrap = document.getElementById(id).closest('.ff'), v = document.getElementById(id).value.trim(), ok = true, msg = '';
    if (id === 'em') ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
    else if (id === 'ph') ok = v.replace(/\D/g, '').length >= 10;
    else if (id === 'zip') { ok = /^\d{5}$/.test(v); if (ok) msg = 'ZIP verified ✓'; }
    else ok = v.length > 0;
    wrap.classList.toggle('ok', ok && v.length > 0); wrap.classList.toggle('err', !ok && v.length > 0);
    wrap.querySelector('.msg').textContent = (v.length > 0) ? (ok ? msg : V[id]) : '';
    return ok && v.length > 0;
  }
  ['fn', 'ln', 'em', 'ph', 'st', 'ci', 'stt', 'zip'].forEach(function (id) { var e = document.getElementById(id); on(e, 'input', function () { validField(id); state.contact[id] = e.value; }); on(e, 'blur', function () { validField(id); }); });
  on(document.getElementById('prop'), 'click', function (e) { var p = e.target.closest('.prop'); if (!p) return; this.querySelectorAll('.prop').forEach(function (x) { x.classList.remove('on'); }); p.classList.add('on'); state.prop = p.dataset.v; });
  on(document.getElementById('dt'), 'change', function () { state.date = this.value; });
  on(document.getElementById('slots'), 'click', function (e) { var b = e.target.closest('button'); if (!b) return; this.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); state.slot = b.dataset.v; });
  on(document.getElementById('toReview'), 'click', function () {
    var ids = ['fn', 'ln', 'em', 'ph', 'st', 'ci', 'stt', 'zip'], allok = true; ids.forEach(function (id) { if (!validField(id)) allok = false; });
    if (!allok) { document.querySelector('.ff.err') && document.querySelector('.ff.err').scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    goStep(5);
  });

  // step 5 review
  function renderReview() {
    var p = priceFor(state.service, state.cfg), c = state.contact, el = document.getElementById('review');
    var rows = [['Service', SVC[state.service].name]];
    cfgLines(state.service, state.cfg).forEach(function (l) { rows.push(l); });
    rows.push(['Estimated price', p.quote ? 'Custom estimate' : money(p.total)]);
    rows.push(['Name', (c.fn || '') + ' ' + (c.ln || '')]);
    rows.push(['Email', c.em || '']); rows.push(['Phone', c.ph || '']);
    rows.push(['Address', [c.st, c.ci, c.stt, c.zip].filter(Boolean).join(', ')]);
    rows.push(['Property type', state.prop]);
    rows.push(['Preferred schedule', [state.date, state.slot].filter(Boolean).join(' · ') || 'Flexible']);
    el.innerHTML = rows.map(function (r) { return '<div class="rrow"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('');
  }
  var agree = document.getElementById('agree');
  on(agree, 'click', function () { state.agree = !state.agree; agree.classList.toggle('on', state.agree); document.getElementById('submitBtn').disabled = !state.agree; });

  // submit -> skeleton -> success + confetti
  on(document.getElementById('submitBtn'), 'click', function () {
    var btn = this; btn.disabled = true; btn.innerHTML = '<span class="skel" style="width:120px;height:14px;display:inline-block;border-radius:7px"></span>';
    setTimeout(function () {
      document.querySelectorAll('.step').forEach(function (s) { s.classList.remove('active'); });
      document.getElementById('bid').textContent = 'APX-2026-' + String(Math.floor(1000 + Math.random() * 8999));
      document.getElementById('success').classList.add('show');
      document.getElementById('pfill').style.width = '100%';
      document.querySelectorAll('.stepdot').forEach(function (d) { d.classList.add('done'); d.classList.remove('active'); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      confetti();
      btn.innerHTML = 'Submit booking request';
    }, 1100);
  });
  on(document.getElementById('again'), 'click', function () {
    state = { step: 1, service: null, cfg: {}, files: [], contact: {}, prop: 'House', date: '', slot: '', agree: false };
    document.querySelectorAll('.svc-card').forEach(function (x) { x.classList.remove('sel'); });
    document.getElementById('success').classList.remove('show');
    agree.classList.remove('on'); document.getElementById('submitBtn').disabled = true;
    goStep(1);
  });

  // ripple
  on(document, 'click', function (e) { var b = e.target.closest('.btn.ripple'); if (!b) return; var r = b.getBoundingClientRect(); var s = document.createElement('span'); s.className = 'rip'; var d = Math.max(r.width, r.height); s.style.width = s.style.height = d + 'px'; s.style.left = (e.clientX - r.left - d / 2) + 'px'; s.style.top = (e.clientY - r.top - d / 2) + 'px'; b.appendChild(s); setTimeout(function () { s.remove(); }, 600); });

  // confetti
  function confetti() {
    if (reduce) return; var cv = document.getElementById('confetti'), ctx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
    var cols = ['#1B536E', '#6FB4D6', '#C97B4A', '#2E7D5B', '#F0C9AC'], P = [];
    for (var i = 0; i < 140; i++) P.push({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * 0.3, vx: (Math.random() - .5) * 11, vy: Math.random() * -13 - 4, r: Math.random() * 6 + 3, c: cols[i % cols.length], a: 1, rot: Math.random() * 6 });
    var t0 = Date.now();
    (function loop() { var el = Date.now() - t0; ctx.clearRect(0, 0, cv.width, cv.height); P.forEach(function (p) { p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.rot += .2; p.a = Math.max(0, 1 - el / 2600); ctx.save(); ctx.globalAlpha = p.a; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.2); ctx.restore(); }); if (el < 2600) requestAnimationFrame(loop); else ctx.clearRect(0, 0, cv.width, cv.height); })();
  }

  // ?service=<slug> preselect → jump to configure step. Accepts the site's
  // data-service slugs (cleaning, lawn-care, …) and the engine's ids (lawn, …).
  var SLUG = { cleaning: 'cleaning', 'lawn-care': 'lawn', lawn: 'lawn', 'power-washing': 'power', power: 'power', painting: 'paint', paint: 'paint', 'junk-removal': 'junk', junk: 'junk', 'pool-service': 'pool', pool: 'pool', 'pest-control': 'pest', pest: 'pest', 'home-security': 'security', security: 'security', 'smart-home': 'smart', smart: 'smart', handyman: 'handyman', 'tree-stump': 'tree', tree: 'tree' };
  try {
    var raw = new URLSearchParams(location.search).get('service');
    var pid = raw && SLUG[raw];
    if (pid && SVC[pid]) {
      var card = document.querySelector('.svc-card[data-id="' + pid + '"]');
      if (card) card.classList.add('sel');
      state.service = pid; state.cfg = {}; state.files = [];
      sync(); goStep(2);
    }
  } catch (e) {}

  sync();

  return function () { cleanups.forEach(function (c) { try { c(); } catch (e) {} }); };
}

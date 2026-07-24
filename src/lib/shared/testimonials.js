/* eslint-disable */
// Shared testimonials driver — a gsap-free port of the home page's
// initTestimonials (lib/apex/runtime.js). Populates the shared <Testimonials/>
// shell (#testimonials + tx-* markup) and wires the expanding-card carousel:
// click a card / arrows to select, autoplay with hover-pause, reduced-motion
// aware. The home page keeps its own gsap-animated driver; every other page
// calls this. Returns a teardown fn.
//
// items: { name, role, quote, portrait }[]
export function mountTestimonials(items) {
  const root = document.getElementById('testimonials');
  if (!root || !Array.isArray(items) || !items.length) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const byId = (id) => document.getElementById(id);
  const STAR =
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 20.8l1.3-6.6L2.5 9l6.6-.8z"/></svg>';

  const starsEl = byId('txStars');
  if (starsEl) starsEl.innerHTML = STAR.repeat(5);
  const track = byId('txTrack');
  const qEl = byId('txQuote'),
    wEl = byId('txWho'),
    rEl = byId('txRole');
  if (!track) return () => {};

  track.innerHTML = items
    .map(
      (d, i) =>
        `<div class="tx-card${i === 0 ? ' active' : ''}" data-i="${i}"><img src="${d.portrait}" alt="${d.name}" loading="lazy"><div class="tx-cap"><div class="n">${d.name}</div><div class="r">${d.role}</div></div></div>`
    )
    .join('');
  const cards = [].slice.call(track.querySelectorAll('.tx-card'));

  const cleanups = [];
  let idx = -1,
    timer = null;

  function fill(i) {
    const d = items[i];
    if (qEl) qEl.textContent = '“' + d.quote + '”';
    if (wEl) wEl.textContent = d.name;
    if (rEl) rEl.textContent = d.role;
  }
  function set(i) {
    i = (i + items.length) % items.length;
    if (i === idx) return;
    cards.forEach((c, k) => c.classList.toggle('active', k === i));
    idx = i;
    fill(i);
  }
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function play() {
    stop();
    if (reduce) return;
    timer = setInterval(() => set(idx + 1), 4400);
  }

  cards.forEach((c) => {
    const h = () => {
      set(+c.dataset.i);
      play();
    };
    c.addEventListener('click', h);
    cleanups.push(() => c.removeEventListener('click', h));
  });
  const prev = byId('txPrev'),
    next = byId('txNext');
  if (prev) {
    const h = () => {
      set(idx - 1);
      play();
    };
    prev.addEventListener('click', h);
    cleanups.push(() => prev.removeEventListener('click', h));
  }
  if (next) {
    const h = () => {
      set(idx + 1);
      play();
    };
    next.addEventListener('click', h);
    cleanups.push(() => next.removeEventListener('click', h));
  }
  if (matchMedia('(pointer:fine)').matches) {
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    cleanups.push(() => {
      root.removeEventListener('mouseenter', stop);
      root.removeEventListener('mouseleave', play);
    });
  }
  cleanups.push(stop);

  idx = 0;
  fill(0);
  play();

  return () => cleanups.forEach((c) => { try { c(); } catch (e) {} });
}

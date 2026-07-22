/* eslint-disable */
// Shared site-chrome runtime for pages that are NOT the home page.
//
// On the home page, mountApex already drives the nav scroll state (#nav.scrolled)
// and the footer reveal (.fv2, via gsap). Every other page that renders the shared
// <SiteNav/> + <SiteFooter/> calls mountChrome() instead to get the same behaviour
// without gsap:
//   - toggle #nav.scrolled past 60% of the viewport
//   - reveal .site-foot .fv2 on scroll-into-view (adds .in; chrome.css transitions)
//
// Returns a teardown fn (listeners + observer) for clean unmount.

export function mountChrome() {
  const cleanups = [];

  const nav = document.getElementById('nav');
  if (nav) {
    const setNav = () => nav.classList.toggle('scrolled', scrollY > innerHeight * 0.6);
    setNav();
    addEventListener('scroll', setNav, { passive: true });
    cleanups.push(() => removeEventListener('scroll', setNav));
  }

  const fv = [...document.querySelectorAll('.site-foot .fv2')];
  if (fv.length) {
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
    fv.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());
  }

  return () => {
    cleanups.forEach((c) => {
      try {
        c();
      } catch (e) {}
    });
  };
}

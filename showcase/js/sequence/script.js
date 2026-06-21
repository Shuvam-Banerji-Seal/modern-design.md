/* =========================================================================
   Sequence design.md showcase — interactions
   Implements the motion & interaction rules observed in design.md:
   - Button: opacity .8 hover/focus, 150ms ease-out
   - Link hover: shift to brand primary
   - Header: sticky, hairline shadow stack
   - Marquee: scroll-left @keyframes (already in CSS, JS just gates reduced motion)
   - Theme toggle: writes data-theme on <html> (cookie persistence stub)
   - Section reveal: not observed in the dump, so we add a single subtle
     IntersectionObserver-based fade-in for sections to give the page
     a sense of life without inventing new visual rules.
   ========================================================================= */

(function () {
  'use strict';

  const root = document.documentElement;
  const THEME_KEY = 'sqd-theme';

  // --- Theme toggle ----------------------------------------------------
  // design.md: useColorScheme hook writes data-theme to <html> and persists.
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const stored = readCookie(THEME_KEY);
  if (stored === 'dark' || stored === 'light') {
    root.setAttribute('data-theme', stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      writeCookie(THEME_KEY, next, 365);
    });
  }

  function readCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function writeCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + d.toUTCString() + '; path=/';
  }

  // --- Sticky header shadow lift on scroll -----------------------------
  // design.md: header hairline shadow is unconditional. We add a *very
  // light* additional shadow when the page has scrolled past the hero so
  // the header feels pinned — implemented via class swap, no design
  // change to the rest state.
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('is-pinned');
      else header.classList.remove('is-pinned');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Active nav link on in-page hash ---------------------------------
  // design.md: aria-[current=page]:border-[#6D28D9] aria-[current=page]:text-[#6D28D9]
  const navLinks = document.querySelectorAll('.primary-nav__link[href^="#"]');
  if (navLinks.length) {
    const targets = Array.from(navLinks)
      .map((a) => {
        const id = a.getAttribute('href');
        if (!id || id === '#' || id.length < 2) return null;
        return document.querySelector(id);
      })
      .filter(Boolean);
    const setActive = (id) => {
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    };
    if ('IntersectionObserver' in window && targets.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(e.target.id);
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      targets.forEach((t) => io.observe(t));
    }
  }

  // --- Smooth scroll for in-page anchors -------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 80; /* offset for sticky header */
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --- Subtle section reveal -------------------------------------------
  // design.md: "not observed" — we add a single low-key fade on sections
  // to give the showcase a sense of rhythm, gated by prefers-reduced-motion
  // and by IntersectionObserver. Doesn't add a new visual rule, just
  // a brief opacity transition.
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('main > section');
  if (!reduce && 'IntersectionObserver' in window && sections.length) {
    sections.forEach((s) => {
      s.classList.add('reveal');
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    sections.forEach((s) => io.observe(s));
  } else {
    sections.forEach((s) => s.classList.add('is-visible'));
  }

  // --- Marquee: pause on hover for keyboard / screen-reader users ------
  // design.md: scroll-left runs unconditionally. The CSS keyframes are
  // already wired; we just expose a hover-pause for usability.
  document.querySelectorAll('.marquee').forEach((m) => {
    const track = m.querySelectorAll('.marquee__track');
    m.addEventListener('mouseenter', () => track.forEach((t) => t.style.animationPlayState = 'paused'));
    m.addEventListener('mouseleave', () => track.forEach((t) => t.style.animationPlayState = 'running'));
    m.addEventListener('focusin',    () => track.forEach((t) => t.style.animationPlayState = 'paused'));
    m.addEventListener('focusout',   () => track.forEach((t) => t.style.animationPlayState = 'running'));
  });

  // --- Hero matrix breathing -------------------------------------------
  // design.md notes the dot-matrix SVG uses desynced <animate opacity>
  // with dur 2.4s / 3.6s / 4.8s. We replicate the effect with a CSS
  // animation gated by a data-matrix container, no extra deps.
  const matrix = document.querySelector('[data-matrix]');
  if (matrix) {
    const circles = matrix.querySelectorAll('circle');
    circles.forEach((c, i) => {
      const dur = [2.4, 3.6, 4.8, 6][i % 4];
      c.style.animation = `pulse ${dur}s cubic-bezier(.4,0,.6,1) infinite`;
      c.style.animationDelay = (i % 7) * 0.12 + 's';
    });
  }
})();

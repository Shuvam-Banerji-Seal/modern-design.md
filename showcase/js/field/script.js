/* ============================================================
   FIELD.IO — interactions
   Per design.md §Motion:
   - Hero carousel: stacked absolute <a> with opacity 0→1,
     transform translateY(3rem)→0, cubic-bezier(0.25, 1, 0.5, 1),
     stagger durations 0.5s / 1s / 1.5s.
   - Nav hover: opacity 0.5→1, duration 200ms ease-in-out.
   - Pill hover: bg #202020 → #303030, transition-all 200ms.
   - Card lift: -translate-y-2 on hover.
   - Theme tokens switch via .theme-systems / .theme-blue on <body>.
   - IntersectionObserver-driven project reveal (replaces the
     hero's stagger for below-the-fold content).
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. Hero carousel — manual cross-fade cycle
  // ----------------------------------------------------------
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  let activeIndex = 0;
  const ROTATE_MS = 5200;

  function show(nextIndex) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === nextIndex);
    });
    activeIndex = nextIndex;
  }

  function cycle() {
    const next = (activeIndex + 1) % slides.length;
    show(next);
  }

  // Begin cycle only after the initial stagger reveal completes.
  // The longest stagger in the design is 1.5s + 1s opacity = 2.5s.
  if (slides.length > 1) {
    setTimeout(() => {
      setInterval(cycle, ROTATE_MS);
    }, 2600);
  }

  // Pause cycle on hover, resume on leave — better UX, mirrors
  // editorial portfolio behaviour described in §Motion.
  const heroEl = document.querySelector('.hero');
  let timer = null;

  function startCycle() {
    if (slides.length < 2 || timer) return;
    timer = setInterval(cycle, ROTATE_MS);
  }
  function stopCycle() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  if (heroEl) {
    heroEl.addEventListener('mouseenter', stopCycle);
    heroEl.addEventListener('mouseleave', () => {
      // re-arm cycle after the initial reveal window
      setTimeout(startCycle, 800);
    });
  }

  // ----------------------------------------------------------
  // 2. Project card reveal — IntersectionObserver stagger
  // ----------------------------------------------------------
  const cards = document.querySelectorAll('.project-card.stagger');

  if ('IntersectionObserver' in window && cards.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number(entry.target.dataset.delay || 0);
            setTimeout(() => {
              entry.target.classList.add('is-revealed');
            }, delay * 120);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add('is-revealed'));
  }

  // ----------------------------------------------------------
  // 3. Theme switcher
  //    design.md §Visual Language defines three themes —
  //    .theme-systems (dark) and .theme-blue (brand blue).
  //    Default light theme is on <body> by default.
  // ----------------------------------------------------------
  const themeButtons = document.querySelectorAll('[data-theme]');
  const body = document.body;

  function applyTheme(name) {
    body.classList.remove('theme-light', 'theme-systems', 'theme-blue');
    body.classList.add('theme-' + name);
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
    });
  });

  // ----------------------------------------------------------
  // 4. Pill chip — keyboard activation parity with click
  // ----------------------------------------------------------
  document.querySelectorAll('.pill').forEach((pill) => {
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.click();
      }
    });
  });

  // ----------------------------------------------------------
  // 5. Smooth scroll for in-page nav
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ----------------------------------------------------------
  // 6. Header — subtle scrim when leaving the hero
  //    (design.md notes the header is transparent over the hero)
  // ----------------------------------------------------------
  const header = document.querySelector('.site-header');
  const sentinel = document.querySelector('.hero');

  if (header && sentinel && 'IntersectionObserver' in window) {
    const headerIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // sentinel no longer intersecting = scrolled past hero
          header.style.backgroundColor = entry.isIntersecting
            ? 'transparent'
            : 'rgba(255,255,255,0.85)';
          header.style.backdropFilter = entry.isIntersecting
            ? 'none'
            : 'blur(10px)';
        });
      },
      { rootMargin: '-50px 0px 0px 0px' }
    );
    headerIO.observe(sentinel);
  }

  // Respect reduced-motion preference (mirrored in CSS too)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (timer) { clearInterval(timer); timer = null; }
    slides.forEach((s) => s.classList.add('is-active'));
  }
})();
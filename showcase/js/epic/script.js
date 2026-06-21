/* EPIC Agency showcase — JS behaviors reconstructed from design.md
   No frameworks. Only the patterns described in the spec:
     - sticky header / mega-menu toggle
     - slogan scatter on scroll (IntersectionObserver + class toggle)
     - case-card auto-rotate (every 8s)
     - page-transition overlay on internal navigation
     - cookie bar dismiss + persistence
     - reduced-motion respect
*/

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────
     MEGA MENU (§Header — open/close)
     ───────────────────────────────────────────────────────────── */
  function initMegaMenu() {
    const trigger = document.querySelector('.mega-menu-trigger');
    const menu = document.getElementById('megaMenu');
    if (!trigger || !menu) return;

    function setOpen(isOpen) {
      menu.classList.toggle('is-open', isOpen);
      trigger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    trigger.addEventListener('click', function () {
      const open = !menu.classList.contains('is-open');
      setOpen(open);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        trigger.focus();
      }
    });

    /* Close menu when any menu link is clicked */
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     LANGUAGE SWITCHER (no real backend — toggles aria-expanded)
     ───────────────────────────────────────────────────────────── */
  function initLangSwitcher() {
    const btn = document.querySelector('.lang-trigger');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.textContent = expanded ? 'EN / FR' : 'FR / EN';
    });
  }

  /* ─────────────────────────────────────────────────────────────
     SLOGAN SCATTER on scroll (§Slogan — GSAP equivalent, vanilla)
     Triggers the .is-scattered class when hero leaves viewport.
     ───────────────────────────────────────────────────────────── */
  function initSloganScatter() {
    const slogan = document.getElementById('slogan');
    const hero = document.querySelector('.hero');
    if (!slogan || !hero) return;

    if (prefersReducedMotion) return;

    /* When the hero scrolls out of view, scatter; restore when it returns */
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          slogan.classList.remove('is-scattered');
        } else {
          slogan.classList.add('is-scattered');
        }
      });
    }, { threshold: 0.25 });

    io.observe(hero);
  }

  /* ─────────────────────────────────────────────────────────────
     CASE CARDS — auto-rotate every 8s (§Case carousel)
     Visually re-orders the grid by promoting one card to the front.
     Pure DOM: prepend a clone, then restore from original order.
     ───────────────────────────────────────────────────────────── */
  function initCaseCarousel() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const cards = Array.from(grid.children);
    if (cards.length < 2) return;

    const ROTATE_MS = 8000;
    let index = 0;
    let timerId = null;

    function rotate() {
      if (prefersReducedMotion) return;

      /* Fade out current first card */
      cards[index].style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      cards[index].style.opacity = '0';
      cards[index].style.transform = 'translateX(-20px)';

      setTimeout(function () {
        /* Move it to the end */
        grid.appendChild(cards[index]);
        cards[index].style.transition = 'none';
        cards[index].style.opacity = '0';
        cards[index].style.transform = 'translateY(-20px)';

        /* Force reflow then fade in */
        /* eslint-disable-next-line no-unused-expressions */
        cards[index].offsetHeight;

        cards[index].style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        cards[index].style.opacity = '1';
        cards[index].style.transform = 'translateY(0)';

        index = (index + 1) % cards.length;
      }, 350);
    }

    function start() {
      if (timerId) return;
      timerId = setInterval(rotate, ROTATE_MS);
    }

    function stop() {
      if (!timerId) return;
      clearInterval(timerId);
      timerId = null;
    }

    /* Only auto-rotate while the section is in view */
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) start();
        else stop();
      });
    }, { threshold: 0.1 });

    io.observe(grid);
  }

  /* ─────────────────────────────────────────────────────────────
     HEADER FADE — hide when a section "claims" the viewport
     (configurator/castle analog). For this showcase, fades when the
     about canvas is centered, mimicking the pinned-scroll behavior.
     ───────────────────────────────────────────────────────────── */
  function initHeaderFade() {
    const header = document.getElementById('siteHeader');
    const canvas = document.querySelector('.about__canvas');
    if (!header || !canvas) return;

    if (prefersReducedMotion) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.intersectionRatio > 0.55) {
          header.classList.add('is-hidden');
        } else {
          header.classList.remove('is-hidden');
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.55, 0.75, 1] });

    io.observe(canvas);
  }

  /* ─────────────────────────────────────────────────────────────
     RING CTA — flash on click (§Configurator open)
     ───────────────────────────────────────────────────────────── */
  function initRingCta() {
    const ring = document.getElementById('ringCta');
    if (!ring) return;

    ring.addEventListener('click', function () {
      const about = document.querySelector('.about');
      if (!about) return;

      /* Mimic the gsap yoyo flash on .home-about */
      about.style.transition = 'opacity 0.3s ease';
      const original = window.getComputedStyle(about).opacity;
      about.style.opacity = '0.35';
      setTimeout(function () {
        about.style.opacity = original;
      }, 300);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     COOKIE BAR (§Cookie bar — accept / deny persists)
     ───────────────────────────────────────────────────────────── */
  function initCookieBar() {
    const bar = document.getElementById('cookiebar');
    if (!bar) return;

    const KEY = 'showcase-cookie-pref';
    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch (_) { /* ignore */ }

    if (!stored) bar.hidden = false;

    bar.querySelectorAll('[data-cookie]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        try { localStorage.setItem(KEY, btn.dataset.cookie); } catch (_) { /* ignore */ }
        bar.hidden = true;
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     PAGE TRANSITION — brief overlay before scroll-to-anchor
     Mimics the gsap .page-transition opacity 0→1 over 0.5s.
     ───────────────────────────────────────────────────────────── */
  function initPageTransition() {
    const overlay = document.getElementById('pageTransition');
    if (!overlay) return;

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        overlay.classList.add('is-active');

        setTimeout(function () {
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          setTimeout(function () {
            overlay.classList.remove('is-active');
          }, 250);
        }, 250);
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     SHOWREEL PLAY — visual feedback only (no real video)
     ───────────────────────────────────────────────────────────── */
  function initShowreel() {
    const btn = document.querySelector('.showreel__play');
    const frame = document.querySelector('.showreel__frame');
    if (!btn || !frame) return;

    btn.addEventListener('click', function () {
      const placeholder = frame.querySelector('.showreel__placeholder');
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
      if (placeholder) {
        placeholder.textContent = 'Loading reel…';
        placeholder.style.opacity = '1';
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     INIT
     ───────────────────────────────────────────────────────────── */
  function init() {
    initMegaMenu();
    initLangSwitcher();
    initSloganScatter();
    initCaseCarousel();
    initHeaderFade();
    initRingCta();
    initCookieBar();
    initPageTransition();
    initShowreel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

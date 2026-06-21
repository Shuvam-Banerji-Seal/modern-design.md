/* ============================================================
   North Kingdom — sample implementation script.js
   Implements the motion & interaction patterns described in
   websites/northkingdom/design.md §Motion & Interaction
   ============================================================ */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. Reveal-on-scroll: IntersectionObserver
        Targets: case cards, text blocks, featured-video text
        Closest equivalents to the Lenis / Splitting.js pipeline
        observed in the dump. Honors prefers-reduced-motion.
     ----------------------------------------------------------- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal() {
    if (prefersReduced) {
      document.querySelectorAll('[data-reveal], .case-card, .featured-video__title')
        .forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('[data-reveal], .case-card, .featured-video__title')
      .forEach(function (el) { io.observe(el); });
  }

  /* -----------------------------------------------------------
     2. Header hide-on-scroll
        Toggle data-is-visible based on scroll direction.
     ----------------------------------------------------------- */
  function headerScroll() {
    var header = document.getElementById('header');
    if (!header) return;
    var lastY = window.scrollY;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var y = window.scrollY;
          var goingDown = y > lastY && y > 80;
          header.setAttribute('data-is-visible', goingDown ? 'false' : 'true');
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* -----------------------------------------------------------
     3. Fullscreen menu (modal overlay)
        Opens via [data-menu-open], closes via [data-menu-close]
     ----------------------------------------------------------- */
  function menuToggle() {
    var menu = document.getElementById('menu');
    if (!menu) return;
    function setOpen(open) {
      menu.setAttribute('data-is-menu-open', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.documentElement.style.overflow = open ? 'hidden' : '';
    }
    document.querySelectorAll('[data-menu-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { setOpen(true); });
    });
    document.querySelectorAll('[data-menu-close]').forEach(function (el) {
      el.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.getAttribute('data-is-menu-open') === 'true') {
        setOpen(false);
      }
    });
  }

  /* -----------------------------------------------------------
     4. Hero play button visibility
        Fades in once the hero is in view (data-visible="true").
     ----------------------------------------------------------- */
  function playButtonReveal() {
    var btn = document.querySelector('.play-btn');
    if (!btn) return;
    if (prefersReduced) { btn.setAttribute('data-visible', 'true'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () { btn.setAttribute('data-visible', 'true'); }, 400);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(btn);
  }

  /* -----------------------------------------------------------
     5. Hero title visibility
        Mirrors the design's hidden-until-ready pattern.
     ----------------------------------------------------------- */
  function heroTitleReveal() {
    var title = document.getElementById('heroTitle');
    if (!title) return;
    if (prefersReduced) { title.style.visibility = 'visible'; return; }
    setTimeout(function () { title.style.visibility = 'visible'; }, 600);
  }

  /* -----------------------------------------------------------
     6. Page overlay fade-out
        Equivalent of the HomeHero_overlay behavior.
     ----------------------------------------------------------- */
  function pageOverlay() {
    var overlay = document.getElementById('pageOverlay');
    if (!overlay) return;
    window.addEventListener('load', function () {
      setTimeout(function () { overlay.classList.add('is-hidden'); }, 250);
    });
  }

  /* -----------------------------------------------------------
     7. Footer scroll-to-top with rotating arrow
        The arrow rotates based on scroll velocity / direction.
     ----------------------------------------------------------- */
  function footerScrollTop() {
    var btn = document.querySelector('[data-scroll-top]');
    var arrow = document.getElementById('footerArrow');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
    if (!arrow) return;
    var lastY = window.scrollY;
    var raf = null;
    function tick() {
      var y = window.scrollY;
      var delta = y - lastY;
      var current = parseFloat(arrow.style.getPropertyValue('--angle')) || 0;
      var next = current + delta * 0.5;
      next = Math.max(-90, Math.min(90, next));
      arrow.style.setProperty('--angle', next.toFixed(1) + 'deg');
      lastY = y;
      raf = null;
    }
    window.addEventListener('scroll', function () {
      if (raf === null) raf = window.requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* -----------------------------------------------------------
     8. Pause marquee when off-screen (perf)
     ----------------------------------------------------------- */
  function marqueePause() {
    document.querySelectorAll('.marquee').forEach(function (m) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          m.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      }, { threshold: 0 });
      io.observe(m);
    });
  }

  /* -----------------------------------------------------------
     9. Case-card hover glow inheritance
        Make the glow pick up the thumb's gradient.
     ----------------------------------------------------------- */
  function caseGlowInherit() {
    document.querySelectorAll('.case-card').forEach(function (card) {
      var thumb = card.querySelector('.case-card__thumb');
      var glow = card.querySelector('.case-card__glow');
      if (!thumb || !glow) return;
      var bg = window.getComputedStyle(thumb).background;
      glow.style.background = bg;
    });
  }

  /* -----------------------------------------------------------
     10. Smooth anchor scrolling (Lenis-substitute)
     ----------------------------------------------------------- */
  function smoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length <= 1) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
      });
    });
  }

  /* -----------------------------------------------------------
     Boot
     ----------------------------------------------------------- */
  function init() {
    pageOverlay();
    headerScroll();
    menuToggle();
    playButtonReveal();
    heroTitleReveal();
    footerScrollTop();
    smoothAnchors();
    caseGlowInherit();
    reveal();
    marqueePause();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

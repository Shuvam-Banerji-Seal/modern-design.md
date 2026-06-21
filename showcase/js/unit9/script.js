/* =========================================================================
   UNIT9 — showcase interactions
   Implements behavior described in websites/unit9/design.md:
   - Hamburger drawer with cubic-bezier(0.165, 0.84, 0.44, 1)
   - Work tile image fade-in (mirrors .is-loading -> .is-loaded)
   - Cookie consent dismissal -> localStorage
   - Loader toggle on async-ish boundaries
   - History-style pushState on tile click (mirrors Site.PushStates)
   - Scroll-driven hero parallax (mirrors Site.Scrolling.callbacks.hero)
   - Footer year
   ========================================================================= */

(function () {
  'use strict';

  var EASE = 'cubic-bezier(0.165, 0.84, 0.44, 1)';
  var SLIDE_MS = 600;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setFooterYear();
    initDrawer();
    initWorkList();
    initCookieBanner();
    initHomeReelParallax();
    initHeroScrollParallax();
    initHistoryRouting();
    flashLoaderBriefly();
  }

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */

  function setFooterYear() {
    var el = document.getElementById('footer-year');
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------------
     Hamburger drawer
     Mirrors .header-nav slide + visibility .4s delay from design.md.
     ------------------------------------------------------------------------ */

  function initDrawer() {
    var trigger = document.getElementById('menu-trigger');
    var closer = document.querySelector('.menu-closer');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      toggleDrawer();
    });

    if (closer) {
      closer.addEventListener('click', function () {
        closeDrawer();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  function openDrawer() {
    document.body.classList.add('is-menu-open');
  }

  function closeDrawer() {
    document.body.classList.remove('is-menu-open');
  }

  function toggleDrawer() {
    document.body.classList.toggle('is-menu-open');
  }

  /* ------------------------------------------------------------------------
     Work list
     Mirrors .is-loading img opacity reveal from design.md.
     ------------------------------------------------------------------------ */

  function initWorkList() {
    var items = document.querySelectorAll('.work-list li');
    if (!items.length) return;

    var io = ('IntersectionObserver' in window)
      ? new IntersectionObserver(onIntersect, { rootMargin: '100px' })
      : null;

    items.forEach(function (li) {
      if (io) io.observe(li);
      else li.classList.add('is-loaded');
    });

    function onIntersect(entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var li = entry.target;
        window.setTimeout(function () {
          li.classList.add('is-loaded');
        }, 120);
        io.unobserve(li);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Cookie consent
     Mirrors localStorage.consentMode write from design.md.
     ------------------------------------------------------------------------ */

  var CONSENT_KEY = 'consentMode';

  function initCookieBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    var stored = readStoredConsent();
    if (stored) {
      banner.classList.add('is-dismissed');
      return;
    }

    var buttons = banner.querySelectorAll('.cookie-consent-button');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action');
        var choices = collectChoices(banner, action);
        writeStoredConsent(choices);
        banner.classList.add('is-dismissed');
        pushConsentUpdate(choices);
      });
    });
  }

  function collectChoices(banner, action) {
    var labels = banner.querySelectorAll('.cookie-consent-options label');
    var choices = {};

    labels.forEach(function (label) {
      var input = label.querySelector('input');
      if (!input) return;
      var key = label.textContent.trim().toLowerCase();
      if (input.disabled) {
        choices[key] = true;
      } else if (action === 'accept') {
        choices[key] = true;
      } else if (action === 'reject') {
        choices[key] = false;
      } else {
        choices[key] = !!input.checked;
      }
    });

    choices._action = action || 'selection';
    return choices;
  }

  function readStoredConsent() {
    try {
      var raw = window.localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function writeStoredConsent(choices) {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(choices));
    } catch (err) { /* noop */ }
  }

  function pushConsentUpdate(choices) {
    if (typeof window.gtag !== 'function') return;
    var update = {};
    Object.keys(choices).forEach(function (key) {
      if (key.charAt(0) === '_') return;
      update[key] = choices[key] ? 'granted' : 'denied';
    });
    window.gtag('consent', 'update', update);
  }

  /* ------------------------------------------------------------------------
     Home reel parallax (mousemove)
     ------------------------------------------------------------------------ */

  function initHomeReelParallax() {
    var home = document.querySelector('.home');
    if (!home) return;

    var placeholder = home.querySelector('.home-video-placeholder');
    if (!placeholder) return;

    home.addEventListener('mousemove', function (e) {
      var rect = home.getBoundingClientRect();
      var dx = (e.clientX - rect.left) / rect.width - 0.5;
      var dy = (e.clientY - rect.top) / rect.height - 0.5;
      placeholder.style.transform =
        'translate3d(' + (dx * -20) + 'px, ' + (dy * -20) + 'px, 0)';
    });

    home.addEventListener('mouseleave', function () {
      placeholder.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  /* ------------------------------------------------------------------------
     Hero / work scroll parallax
     Mirrors Site.Scrolling.callbacks.hero from design.md.
     ------------------------------------------------------------------------ */

  function initHeroScrollParallax() {
    var ticking = false;

    function tick() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var hero = document.querySelector('.hero-options-notice, .hero');
      var heroImg = document.querySelector('.home-video-placeholder');

      if (heroImg) {
        var f = Math.min(scrollY / Math.max(window.innerHeight, 1), 1);
        heroImg.style.transform =
          'translate3d(0, ' + Math.round(f * 40) + 'px, 0)';
        heroImg.style.opacity = String(1 - f * f);
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      window.requestAnimationFrame(tick);
      ticking = true;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     History-style pushState on tile click
     Mirrors Site.PushStates.changePath from design.md.
     ------------------------------------------------------------------------ */

  function initHistoryRouting() {
    var links = document.querySelectorAll('.home-menu-link, .work-list a');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;

        e.preventDefault();
        var path = href === '#home' ? '/' : '/' + href.slice(1);
        var title = deriveTitle(href);

        if (window.history && window.history.pushState) {
          window.history.pushState({ path: path }, title, path);
        }
        document.title = title + ' — UNIT9';

        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        closeDrawer();
      });
    });

    window.addEventListener('popstate', function () {
      document.title = 'UNIT9 — Production Studio';
    });
  }

  function deriveTitle(href) {
    var slug = href.replace('#', '');
    if (!slug || slug === 'home') return 'Home';
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }

  /* ------------------------------------------------------------------------
     Loader flash (mirrors .is-loading-content toggle)
     ------------------------------------------------------------------------ */

  function flashLoaderBriefly() {
    document.body.classList.add('is-loading-content');
    window.setTimeout(function () {
      document.body.classList.remove('is-loading-content');
      document.body.classList.add('animation-finished');
    }, 700);
  }

})();

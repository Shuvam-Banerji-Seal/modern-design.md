/* ============================================================
   The FWA — Showcase JS
   ------------------------------------------------------------
   Implements every interaction described in
   websites/thefwa/design.md (Animations, Motion & Interaction,
   Components). All easing curves and durations are real values
   pulled from the spec, not invented.
   ============================================================ */

(function () {
  'use strict';

  /* ───────── Signature easing curves from the spec ───────── */
  var EASE_OUT_EXPO  = 'cubic-bezier(.19,1,.22,1)';   // 1064 hits — dominant
  var EASE_OUT_QUINT = 'cubic-bezier(.23,1,.32,1)';   // 238 hits — menu/tooltip
  var EASE_INOUT_QUART = 'cubic-bezier(.86,0,.07,1)'; // 16 hits  — globalnav

  /* ============================================================
     Sticky nav scroll state
     - border-color: 1s cubic-bezier(.23,1,.32,1)
     - .globalnav--hide toggles when user scrolls past hero
     ============================================================ */
  function initHeaderScroll() {
    var header = document.querySelector('.header-main');
    if (!header) return;

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset;
        // Spec: border-color transition toggles as user scrolls
        if (y > 12) {
          header.classList.add('header-main--scrolled');
        } else {
          header.classList.remove('header-main--scrolled');
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     Burger / globalnav
     - transform: translate3d(0,-100%,0) → translate3d(0,0,0)
     - 1s cubic-bezier(.86,0,.07,1)
     - icon morphs to X via cubic-bezier(.19,1,.22,1) .5s .35s
     ============================================================ */
  function initBurger() {
    var burger = document.querySelector('.burger');
    var nav    = document.getElementById('globalnav');
    if (!burger || !nav) return;

    function setOpen(open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      nav.setAttribute('aria-hidden', String(!open));
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
      }
    });
  }

  /* ============================================================
     Filter button / multiselect panel
     - transform: translate3d(0,-100%,0) → translate3d(0,0,0)
     - 350ms cubic-bezier(.23,1,.32,1)
     - logo-area width: .35s cubic-bezier(.23,1,.32,1) .65s
     ============================================================ */
  function initFilter() {
    var btn    = document.querySelector('.header-main__filter');
    var panel  = document.getElementById('multiselect');
    var header = document.querySelector('.header-main');
    if (!btn || !panel) return;

    var count = 0;
    var countEl = btn.querySelector('.filter-count');

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      panel.classList.toggle('is-open', open);
      header.classList.toggle('header-main--filter-open', open);
    }

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });

    // Count checked filters + update badge
    panel.addEventListener('change', function (e) {
      var input = e.target;
      if (!input || input.tagName !== 'INPUT') return;
      var boxes = panel.querySelectorAll('input[type="checkbox"]:checked');
      count = boxes.length;
      if (countEl) countEl.textContent = String(count);
    });

    // Clear / Apply
    panel.addEventListener('click', function (e) {
      var action = e.target.closest('[data-action]');
      if (!action) return;
      if (action.dataset.action === 'clear') {
        panel.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
        count = 0;
        if (countEl) countEl.textContent = '0';
      } else if (action.dataset.action === 'apply') {
        applyFilters();
        setOpen(false);
      }
    });

    // Date list
    panel.querySelectorAll('[data-filter="date"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        panel.querySelectorAll('[data-filter="date"]').forEach(function (x) { x.classList.remove('is-active'); });
        a.classList.add('is-active');
      });
    });
  }

  /* ============================================================
     Filter the timeline grid
     - Award (fotd, fotm, foty, pca, t100, none)
     - Type (ai, website, installation, other)
     ============================================================ */
  function applyFilters() {
    var panel = document.getElementById('multiselect');
    if (!panel) return;

    var awards = checkedValues(panel, 'award');  // may be empty = "all"
    var types  = checkedValues(panel, 'type');

    document.querySelectorAll('.timeline-case').forEach(function (card) {
      var cardAward = card.dataset.award || 'none';
      var cardType  = card.dataset.type  || 'other';

      var awardOk = awards.length === 0 || awards.indexOf(cardAward) !== -1;
      var typeOk  = types.length  === 0 || types.indexOf(cardType)  !== -1;

      card.classList.toggle('is-hidden', !(awardOk && typeOk));
    });
  }
  function checkedValues(panel, kind) {
    var out = [];
    panel.querySelectorAll('input[data-filter="' + kind + '"]:checked').forEach(function (i) {
      out.push(i.value);
    });
    return out;
  }

  /* ============================================================
     Header promo slider
     - opacity 1 ↔ 0, .4s ease-out
     - rotates every 4s
     ============================================================ */
  function initSlider() {
    var slides = document.querySelectorAll('.slider-slide');
    if (slides.length < 2) return;

    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove('slider-slide--active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('slider-slide--active');
    }, 4000);
  }

  /* ============================================================
     Hero down-chevron: arrow-to-bottom-to-center on scroll
     - cubic-bezier(.6,.04,.98,.335) (49%→50%)
     - cubic-bezier(.19,1,.22,1) (52%→100%)
     ============================================================ */
  function initHeroArrow() {
    var arrow = document.querySelector('.timeline-hero__down__arrow');
    var hero  = document.querySelector('.timeline-hero');
    if (!arrow || !hero) return;

    function update() {
      var rect = hero.getBoundingClientRect();
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      // Once hero is more than halfway out of view, the chevron
      // settles at the centre of the page (it has already animated
      // up via the keyframes; we toggle a class for a second beat).
      if (rect.bottom < viewport * 0.5) {
        arrow.classList.add('is-centered');
      } else {
        arrow.classList.remove('is-centered');
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ============================================================
     Cookie notice
     - slides up 200ms ease-out on first visit
     - persisted dismissal via localStorage
     ============================================================ */
  function initCookie() {
    var KEY = 'fwa-cookie-dismissed-v1';
    var bar = document.querySelector('.cookie-notice');
    if (!bar) return;

    try {
      if (window.localStorage && localStorage.getItem(KEY) === '1') return;
    } catch (e) { /* storage blocked — show anyway */ }

    bar.hidden = false;
    // Force a reflow so the transition fires
    // eslint-disable-next-line no-unused-expressions
    bar.offsetHeight;
    requestAnimationFrame(function () { bar.classList.add('is-open'); });

    var dismiss = bar.querySelector('.cookie-notice__dismiss');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        bar.classList.remove('is-open');
        setTimeout(function () { bar.hidden = true; }, 220);
        try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
      });
    }
  }

  /* ============================================================
     Video modal (coda-play → youtube-overlay)
     - opacity 0→1, visibility hidden→visible
     - 1s cubic-bezier(.19,1,.22,1)
     ============================================================ */
  function initVideoModal() {
    var overlay = document.querySelector('.youtube-overlay');
    var opener  = document.querySelectorAll('.coda-play');
    if (!overlay || opener.length === 0) return;

    function open()  {
      overlay.hidden = false;
      // eslint-disable-next-line no-unused-expressions
      overlay.offsetHeight;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
    }
    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      setTimeout(function () { overlay.hidden = true; }, 1000);
    }

    opener.forEach(function (btn) { btn.addEventListener('click', open); });
    var closeBtn = overlay.querySelector('.youtube-overlay__close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  /* ============================================================
     Infinite scroll trigger
     - when .infinitescroll-trigger scrolls into view, append
       a copy of the existing cases (placeholder data).
     - spec: fetch('/api/timeline/?offset=20&limit=20')
     ============================================================ */
  function initInfiniteScroll() {
    var trigger = document.querySelector('.infinitescroll-trigger');
    var list    = document.querySelector('.timeline');
    if (!trigger || !list) return;

    var loading = false;

    function loadMore() {
      if (loading) return;
      loading = true;
      trigger.classList.add('is-loading');

      // Simulate the API latency from the spec's REST surface
      setTimeout(function () {
        var items = list.querySelectorAll('.timeline-case');
        if (items.length === 0) { loading = false; return; }
        // Append a copy of the last 4 items, simulating the
        // chronological append the spec describes.
        for (var i = 0; i < Math.min(4, items.length); i++) {
          var src = items[items.length - 1 - i];
          var clone = src.cloneNode(true);
          clone.classList.add('timeline-case--appended');
          list.appendChild(clone);
        }
        trigger.classList.remove('is-loading');
        loading = false;
      }, 600);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) loadMore();
        });
      }, { rootMargin: '300px' });
      io.observe(trigger);
    } else {
      trigger.addEventListener('click', loadMore);
    }
  }

  /* ============================================================
     Button hover → trailing .arrow fades in
     - 1s cubic-bezier(.19,1,.22,1) (the .arrow transition)
     - The CSS does most of the work; this just makes sure the
       element has the right DOM contract.
     ============================================================ */
  function initButtonArrows() {
    document.querySelectorAll('.button--go').forEach(function (btn) {
      if (btn.querySelector('.arrow')) return;
      var a = document.createElement('span');
      a.className = 'arrow';
      a.setAttribute('aria-hidden', 'true');
      btn.appendChild(a);
    });
  }

  /* ============================================================
     Boot
     ============================================================ */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initHeaderScroll();
    initBurger();
    initFilter();
    initSlider();
    initHeroArrow();
    initCookie();
    initVideoModal();
    initInfiniteScroll();
    initButtonArrows();
  });

})();

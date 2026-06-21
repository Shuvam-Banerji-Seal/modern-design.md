/* ========================================================================
   Dogstudio — sample JS implementation
   Behavior derived from design.md §Animations, §Motion & Interaction,
   and §JavaScript & Libraries. Implemented in vanilla JS (no GSAP/
   Three.js/Plyr) — the design's intent is preserved, library calls are
   replaced with native equivalents.
   ======================================================================== */

(function () {
  'use strict';

  var doc = document;
  var win = window;
  var d = doc.documentElement;

  /* ------------------------------------------------------------------
     Site loader (design.md §Components → Site loader)
     ------------------------------------------------------------------ */

  function hideLoader() {
    var loader = doc.getElementById('siteLoader');
    if (!loader) return;
    var ring = loader.querySelector('.site-loader-percent');
    if (ring) {
      var len = 2 * Math.PI * 45; /* r = 45 from the SVG */
      ring.style.strokeDasharray = String(len);
      ring.style.strokeDashoffset = String(len);
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 1200, 1);
        ring.style.strokeDashoffset = String(len * (1 - p));
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(function () { loader.classList.add('is-hidden'); }, 220);
        }
      }
      requestAnimationFrame(step);
    } else {
      loader.classList.add('is-hidden');
    }
  }
  if (doc.readyState === 'complete') {
    setTimeout(hideLoader, 400);
  } else {
    win.addEventListener('load', function () { setTimeout(hideLoader, 400); });
  }

  /* ------------------------------------------------------------------
     In-view reveal (design.md §Motion & Interaction → Section reveal)
     ------------------------------------------------------------------ */

  var inViewObserver;
  if ('IntersectionObserver' in win) {
    inViewObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          inViewObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    var inViewEls = doc.querySelectorAll('.js-in-view');
    inViewEls.forEach(function (el) { inViewObserver.observe(el); });
  } else {
    doc.querySelectorAll('.js-in-view').forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ------------------------------------------------------------------
     Hero entrance timeline (design.md §Animations → JS-driven →
     hero entrance + line-anim + per-letter stagger)
     ------------------------------------------------------------------ */

  function runHeroEntrance() {
    var lines = doc.querySelectorAll('.home-hero .line');
    lines.forEach(function (l) { l.classList.add('in-view'); });

    var letters = doc.querySelectorAll('.home-hero .fx-letter');
    letters.forEach(function (letter) {
      var delay = parseFloat(getComputedStyle(letter).getPropertyValue('--d')) || 0;
      setTimeout(function () { letter.classList.add('in-view'); }, delay);
    });

    var sideLead = doc.querySelector('[data-side-delay="lead"]');
    var sideBody = doc.querySelector('[data-side-delay="body"]');
    var sideSocial = doc.querySelector('[data-side-delay="social"]');
    var showreelLink = doc.querySelector('.showreel-link');

    if (showreelLink) {
      setTimeout(function () { showreelLink.classList.add('in-view'); }, 1100);
    }
    if (sideLead) {
      setTimeout(function () { sideLead.classList.add('in-view'); }, 1300);
    }
    if (sideBody) {
      setTimeout(function () { sideBody.classList.add('in-view'); }, 1500);
    }
    if (sideSocial) {
      setTimeout(function () { sideSocial.classList.add('in-view'); }, 1700);
    }
  }
  /* Hero runs after the loader hides */
  setTimeout(runHeroEntrance, 1600);

  /* About title letter stagger (per design.md → in-view stagger) */
  var aboutTitle = doc.querySelector('[data-about-title]');
  if (aboutTitle && 'IntersectionObserver' in win) {
    var aboutObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          var letters = entry.target.querySelectorAll('.fx-letter');
          letters.forEach(function (letter, i) {
            letter.style.setProperty('--d', (i * 30) + 'ms');
            setTimeout(function () { letter.classList.add('in-view'); }, i * 30);
          });
          aboutObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    aboutObserver.observe(aboutTitle);
  }

  /* ------------------------------------------------------------------
     Cases — row hover/active → scene swap
     (design.md §Motion & Interaction → case-list hover)
     ------------------------------------------------------------------ */

  var casesList = doc.getElementById('casesList');
  var casesStage = doc.getElementById('casesStage');

  function activateCase(slug) {
    if (!casesList || !casesStage) return;
    var rows = casesList.querySelectorAll('.case-row');
    var scenes = casesStage.querySelectorAll('.home-cases-scene');
    rows.forEach(function (r) {
      r.classList.toggle('is-active', r.dataset.case === slug);
    });
    scenes.forEach(function (s) {
      s.classList.toggle('is-visible', s.dataset.case === slug);
    });
  }

  if (casesList && casesStage) {
    var rows = casesList.querySelectorAll('.case-row');
    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        activateCase(row.dataset.case);
      });
      row.addEventListener('focusin', function () {
        activateCase(row.dataset.case);
      });
    });
  }

  /* Cases red hairline — grows as the list scrolls into view */
  var casesRule = doc.querySelector('[data-cases-rule]');
  if (casesRule && 'IntersectionObserver' in win) {
    var ruleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          ruleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    ruleObserver.observe(casesRule);
  }

  /* ------------------------------------------------------------------
     Hamburger menu (design.md §Components → Site menu)
     ------------------------------------------------------------------ */

  var menuBtn = doc.getElementById('menuButton');
  var siteMenu = doc.getElementById('siteMenu');

  function setMenu(open) {
    if (!menuBtn || !siteMenu) return;
    siteMenu.classList.toggle('is-open', open);
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    siteMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    d.style.overflow = open ? 'hidden' : '';
  }

  if (menuBtn && siteMenu) {
    menuBtn.addEventListener('click', function () {
      setMenu(!siteMenu.classList.contains('is-open'));
    });
  }

  /* ------------------------------------------------------------------
     Showreel modal (design.md §Components → Showreel modal)
     ------------------------------------------------------------------ */

  var showreel = doc.getElementById('showreel');
  var showreelClose = doc.getElementById('showreelClose');

  function openShowreel() {
    if (!showreel) return;
    showreel.classList.add('is-open');
    showreel.setAttribute('aria-hidden', 'false');
  }
  function closeShowreel() {
    if (!showreel) return;
    showreel.classList.remove('is-open');
    showreel.setAttribute('aria-hidden', 'true');
  }

  doc.querySelectorAll('.js-show-showreel').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openShowreel();
      if (siteMenu && siteMenu.classList.contains('is-open')) {
        setMenu(false);
      }
    });
  });
  if (showreelClose) {
    showreelClose.addEventListener('click', closeShowreel);
  }
  if (showreel) {
    var backdrop = showreel.querySelector('[data-close-showreel]');
    if (backdrop) backdrop.addEventListener('click', closeShowreel);
  }

  /* ------------------------------------------------------------------
     Cookie banner (design.md §Components → Cookie banner)
     ------------------------------------------------------------------ */

  var cookieBanner = doc.getElementById('cookieBanner');
  function dismissCookie() {
    if (cookieBanner) cookieBanner.classList.add('is-hidden');
  }
  doc.querySelectorAll('.js-cookie-accept, .js-cookie-deny').forEach(function (b) {
    b.addEventListener('click', dismissCookie);
  });

  /* ------------------------------------------------------------------
     Volume toggle (design.md §Components → Volume toggle)
     ------------------------------------------------------------------ */

  var volumeBtn = doc.getElementById('volumeButton');
  if (volumeBtn) {
    volumeBtn.addEventListener('click', function () {
      var playing = volumeBtn.classList.toggle('is-playing');
      volumeBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    });
  }

  /* ------------------------------------------------------------------
     Language switcher (design.md §Components → Footer → Language chip)
     ------------------------------------------------------------------ */

  doc.querySelectorAll('.lang-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      doc.querySelectorAll('.lang-chip').forEach(function (c) {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
    });
  });

  /* ------------------------------------------------------------------
     Keyboard — Escape closes overlays (per design.md accessibility)
     ------------------------------------------------------------------ */

  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (showreel && showreel.classList.contains('is-open')) {
      closeShowreel();
      return;
    }
    if (siteMenu && siteMenu.classList.contains('is-open')) {
      setMenu(false);
    }
  });

  /* ------------------------------------------------------------------
     Cursor-follow parallax on the WebGL placeholder
     (design.md §Motion & Interaction → 3D scene reacts to cursor)
     ------------------------------------------------------------------ */

  var scene = doc.querySelector('.dog-scene');
  if (scene && win.matchMedia('(hover: hover)').matches) {
    var targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    doc.addEventListener('mousemove', function (e) {
      var w = win.innerWidth, h = win.innerHeight;
      targetX = (e.clientX / w - 0.5) * 18;
      targetY = (e.clientY / h - 0.5) * 18;
    });
    function tick() {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      var grain = scene.querySelector('.scene-grain');
      if (grain) {
        grain.style.transform =
          'translate(' + currentX.toFixed(2) + 'px,' +
                        currentY.toFixed(2) + 'px)';
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();

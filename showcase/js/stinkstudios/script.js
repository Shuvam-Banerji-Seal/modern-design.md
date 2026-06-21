/* =============================================================
   Stink Studios — interactive layer
   Implements scroll/hover effects documented in design.md §Motion
   ============================================================= */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const docBody = document.body;

  /* -------------------------------------------------------------
     1. Header scroll behaviour
        design.md §Components > Header → body classes
        Header_isScrollingDown → transform: translateY(-100%)
        Header_isScrollingUp   → transform: translateY(0)
        Trigger ≈ every 100ms based on scroll direction
     ------------------------------------------------------------- */

  function initHeaderScroll() {
    if (reducedMotion) return;

    let lastY = window.scrollY;
    let ticking = false;
    let lastDirection = 'up';

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      const direction = delta > 0 ? 'down' : 'up';

      if (Math.abs(delta) > 4 && direction !== lastDirection) {
        docBody.classList.toggle('is-scrolling-down', direction === 'down');
        docBody.classList.toggle('is-scrolling-up', direction === 'up');
        lastDirection = direction;
      }

      // Header background appears after scrolling past hero
      docBody.classList.toggle('has-background', y > 80);

      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll();
  }

  /* -------------------------------------------------------------
     2. Hero word-by-word reveal (IntersectionObserver)
        design.md §JS-driven animations:
        gsap-animate-word → opacity 0 → 1
        Each word appears in sequence as hero enters viewport.
        timeScale of 0.75 applied to global pacing.
     ------------------------------------------------------------- */

  function initHeroReveal() {
    const hero = document.querySelector('.hero');
    const words = document.querySelectorAll('.gsap-animate-word');
    if (!hero || !words.length) return;

    // Stagger between adjacent words — 0.75 timeScale applied (per design.md)
    const baseStagger = 90; // ms, slightly slower than GSAP would default
    const scaledStagger = baseStagger * 0.75 * 1.5;

    let triggered = false;

    const reveal = () => {
      if (triggered) return;
      triggered = true;

      words.forEach((word, i) => {
        const delay = i * scaledStagger;
        window.setTimeout(() => {
          word.classList.add('is-revealed');
        }, delay);
      });
    };

    if (!('IntersectionObserver' in window) || reducedMotion) {
      words.forEach((w) => w.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });

    io.observe(hero);
  }

  /* -------------------------------------------------------------
     3. Project card reveal (IntersectionObserver)
        design.md §JS-driven animations:
        gsap-animate-stagger    → fade up, opacity 1
        gsap-animate-subtitle   → fade up, 1s power3.out equivalent
        gsap-animate-tag        → fade up, staggered
        timeScale 0.75 applied
     ------------------------------------------------------------- */

  function initProjectReveal() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length || !('IntersectionObserver' in window)) {
      cards.forEach((c) => c.classList.add('is-revealed'));
      return;
    }

    if (reducedMotion) {
      cards.forEach((c) => c.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    cards.forEach((card) => io.observe(card));
  }

  /* -------------------------------------------------------------
     4. Generic section reveal (about / contact copy)
     ------------------------------------------------------------- */

  function initSectionReveal() {
    const targets = document.querySelectorAll('.gsap-animate-stagger, .gsap-animate-tag');
    if (!targets.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((t) => {
        t.style.opacity = '1';
        t.style.visibility = 'visible';
        t.style.transform = 'none';
      });
      return;
    }

    // Only observe ones not already inside a project-card (those use the card observer)
    const standalone = [];
    targets.forEach((t) => {
      if (!t.closest('.project-card')) standalone.push(t);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.visibility = 'visible';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    standalone.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------------------
     5. Footer logotype path animation
        design.md §Footer — SVG strokes animate pathLength on scroll
     ------------------------------------------------------------- */

  function initFooterReveal() {
    const footer = document.querySelector('.site-footer');
    const text = document.querySelector('.footer-logotype-text');
    if (!footer || !text) return;

    if (reducedMotion) {
      footer.classList.add('is-revealed');
      return;
    }

    if (!('IntersectionObserver' in window)) {
      footer.classList.add('is-revealed');
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add('is-revealed');
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });

    io.observe(footer);
  }

  /* -------------------------------------------------------------
     6. Theme toggle (yin-yang)
        design.md §Motion & Interaction > Theme toggle
        Covers the screen with .YinYang_yinyang overlay, animates
        background-color and color over 0.4s linear, then unmounts.
     ------------------------------------------------------------- */

  function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    const overlay = document.querySelector('.theme-flip-overlay');
    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
      const root = document.documentElement;
      const goingLight = !root.classList.contains('light-mode');

      // Overlay flashes the OPPOSITE color first (matches yin-yang effect).
      overlay.style.backgroundColor = goingLight ? '#000' : '#fff';
      overlay.style.color = goingLight ? '#fff' : '#000';
      overlay.classList.add('is-active');

      window.setTimeout(() => {
        root.classList.toggle('light-mode', goingLight);
        toggle.setAttribute(
          'aria-label',
          goingLight ? 'Switch to dark mode' : 'Switch to light mode'
        );
      }, 200);

      window.setTimeout(() => {
        overlay.classList.remove('is-active');
        overlay.style.backgroundColor = '';
        overlay.style.color = '';
      }, 600);
    });
  }

  /* -------------------------------------------------------------
     7. Nav list hover dim/restore
        design.md §Motion & Interaction:
        :hover .Header_navList > * { opacity: 0.4 }
        :hover > * { opacity: 1 } on the specific item
        CSS-only behaviour — we just make sure focus behaves the same.
     ------------------------------------------------------------- */

  function initNavKeyboard() {
    const nav = document.querySelector('.nav-list');
    if (!nav) return;
    nav.addEventListener('focusin', () => nav.classList.add('is-focus'));
    nav.addEventListener('focusout', () => nav.classList.remove('is-focus'));
  }

  /* -------------------------------------------------------------
     8. Project grid view toggle
        design.md §Project toggle — flips between "View grid" / "View list"
     ------------------------------------------------------------- */

  function initViewToggle() {
    const toggle = document.querySelector('.view-toggle');
    const label = document.querySelector('.view-toggle-label');
    const grid = document.querySelector('.project-grid');
    if (!toggle || !label || !grid) return;

    let isList = false;

    const apply = () => {
      label.textContent = isList ? 'View grid' : 'View list';
      toggle.setAttribute('aria-pressed', String(isList));
      grid.classList.toggle('is-list-view', isList);
    };

    toggle.addEventListener('click', apply);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        apply();
      }
    });
  }

  /* -------------------------------------------------------------
     9. Newsletter form (UX only)
        design.md §NewsletterInput — success state flips bg/text.
     ------------------------------------------------------------- */

  function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    const input = form.querySelector('.newsletter-input');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input.value || !input.checkValidity()) {
        input.focus();
        return;
      }
      form.classList.add('is-success');
      input.value = '';
      input.setAttribute('placeholder', 'thanks — see you soon.');
    });

    input.addEventListener('input', () => {
      if (form.classList.contains('is-success')) {
        form.classList.remove('is-success');
        input.setAttribute('placeholder', 'your@email.com');
      }
    });
  }

  /* -------------------------------------------------------------
     10. Mobile menu (placeholder open/close behaviour)
     ------------------------------------------------------------- */

  function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('.mobile-menu-label').textContent = open ? 'close' : 'menu';
      docBody.classList.toggle('is-menu-open', open);
    });
  }

  /* -------------------------------------------------------------
     11. Initialise on DOM ready
     ------------------------------------------------------------- */

  const init = () => {
    initHeaderScroll();
    initHeroReveal();
    initProjectReveal();
    initSectionReveal();
    initFooterReveal();
    initThemeToggle();
    initNavKeyboard();
    initViewToggle();
    initNewsletter();
    initMobileMenu();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
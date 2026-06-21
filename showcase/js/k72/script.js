/* ============================================================
   K72 — design.md showcase script
   Pure-vanilla replacement for the original Locomotive+GSAP+modujs
   bundle. Only behaviours from design.md are implemented:
     - loader lifecycle (is-loading → is-loaded → is-ready)
     - IntersectionObserver-driven is-inview for u-anim-scroll
     - header hide-quicknav past 200px of scroll
     - menu open/close + langswitcher hover direction
     - banner scroll-direction reactivity
     - time updater (250ms, America/Toronto)
     - custom scrollbar thumb
     - back-to-top scroll
     - banner hover white-wipe (CSS-driven)
   ============================================================ */

(function () {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Loader lifecycle (design.md: Load.js init5) ---------- */
  // Mark no-js fallback: drop has-no-js so JS-only states take over
  html.classList.remove('has-no-js');

  const markLoaded = () => {
    body.classList.remove('is-loading');
    body.classList.add('is-loaded');
    // design.md: is-ready added 300 ms after is-loaded
    setTimeout(() => body.classList.add('is-ready'), 300);
  };

  if (document.readyState === 'complete') {
    markLoaded();
  } else {
    window.addEventListener('load', markLoaded, { once: true });
  }

  /* ---------- 2. IntersectionObserver → is-inview (Locomotive substitute) ---------- */
  const inviewEls = document.querySelectorAll('.u-anim-scroll, .u-anim, [data-inview]');
  if ('IntersectionObserver' in window && inviewEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            // Stop observing once revealed (design.md: one-shot reveals)
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    inviewEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: reveal everything
    inviewEls.forEach((el) => el.classList.add('is-inview'));
  }

  /* ---------- 3. Header: hide-quicknav past 200 px (design.md Scroll module) ---------- */
  const header = document.querySelector('.c-header');
  let lastScrollY = window.scrollY;
  let scrollDirection = 'down';

  /* ---------- 7. Custom scrollbar (Locomotive-style 11 px track, 7 px thumb) ---------- */
  const scrollbar = document.querySelector('[data-scrollbar]');
  const scrollbarThumb = document.querySelector('[data-scrollbar-thumb]');

  const updateScrollbar = () => {
    if (!scrollbar || !scrollbarThumb) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      scrollbar.classList.remove('is-visible');
      return;
    }
    scrollbar.classList.add('is-visible');
    const ratio = window.scrollY / docHeight;
    const thumbHeight = Math.max(40, window.innerHeight * 0.3);
    const travel = window.innerHeight - thumbHeight - 4;
    scrollbarThumb.style.height = `${thumbHeight}px`;
    scrollbarThumb.style.transform = `translate3d(0, ${ratio * travel}px, 0)`;
  };

  const onScroll = () => {
    const y = window.scrollY;
    if (y > 200) {
      html.classList.add('hide-quicknav');
    } else {
      html.classList.remove('hide-quicknav');
    }
    // design.md: Scroll.update → data-scroll-direction on <html>
    scrollDirection = y > lastScrollY ? 'down' : 'up';
    html.dataset.scrollDirection = scrollDirection;
    lastScrollY = y;
    updateScrollbar();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Menu toggle (design.md Header module) ---------- */
  const menu = document.querySelector('.c-menu');
  const menuTogglers = document.querySelectorAll('[data-header="menu-toggler"]');

  const setMenu = (open) => {
    html.classList.toggle('has-menu-opened', open);
    if (menu) {
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    menuTogglers.forEach((btn) => {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Lock body scroll while open
    body.style.overflow = open ? 'hidden' : '';
  };

  menuTogglers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = !html.classList.contains('has-menu-opened');
      setMenu(willOpen);
    });
  });

  // Close menu on link click
  if (menu) {
    menu.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', () => setMenu(false));
    });
  }

  // Close on Escape
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' && html.classList.contains('has-menu-opened')) {
      setMenu(false);
    }
  });

  /* ---------- 5. Time updater (design.md Time.js: 250 ms, America/Toronto) ---------- */
  const timeNodes = document.querySelectorAll('[data-module-time]');
  if (timeNodes.length) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Toronto',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h24'
    });
    const updateClock = () => {
      const now = fmt.format(new Date());
      timeNodes.forEach((node) => {
        node.textContent = `MONTREAL_${now}`;
      });
    };
    updateClock();
    setInterval(updateClock, 250);
  }

  /* ---------- 6. Pointer-direction tracking (design.md: window.cursorPosition) ---------- */
  // Used by the MainNav hover overlay direction detection.
  window.cursorPosition = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    window.cursorPosition.x = e.clientX;
    window.cursorPosition.y = e.clientY;
  }, { passive: true });

  /* ---------- 8. data-scroll-to (back-to-top, etc.) ---------- */
  document.querySelectorAll('[data-scroll-to]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = el.getAttribute('data-scroll-to');
      if (!target) return;
      e.preventDefault();
      const node = document.querySelector(target);
      if (node) {
        node.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      } else if (target === '#top') {
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* ---------- 9. in-page anchor smooth-scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    if (a.hasAttribute('data-scroll-to')) return;
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const node = document.querySelector(id);
      if (node) {
        e.preventDefault();
        node.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* ---------- 10. Resize observer → refresh in-view + scrollbar ---------- */
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      updateScrollbar();
      // Trigger a synthetic scroll event to re-evaluate inview if needed
    });
    ro.observe(body);
  }
  window.addEventListener('resize', updateScrollbar);

})();

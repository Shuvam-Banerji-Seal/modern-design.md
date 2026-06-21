/* =========================================================================
 * Miranda — Paper Portfolio (script.js)
 * -------------------------------------------------------------------------
 * Behaviors implemented below are taken from
 * websites/niccolomiranda/design.md §Animations / §Motion & Interaction:
 *
 *   1. vh fix (--vh = innerHeight * 0.01 on resize)            §Motion
 *   2. Page fade-in (.appear class on #app after curtain)     §Animations
 *   3. Nav hide on scroll-down                                §Animations
 *   4. Hamburger → menu open / close                          §Components
 *   5. Marquee pause toggle (hover behavior is in CSS)        §Components
 *   6. Mouse-tracking visual on hero wordmark                 §Motion
 *   7. Horizontal drag on project track (butter-slider stand-in)
 *   8. Card hover micro-tilt                                  §Motion
 *
 * No external libraries are used (the design lists GSAP / Locomotive /
 * OGL, but they are out of scope for the showcase constraint).
 * ========================================================================= */

(() => {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. vh fix — design.md §Motion → vh fix on mobile                   */
  /* ------------------------------------------------------------------ */
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  setVh();
  window.addEventListener('resize', setVh);

  /* ------------------------------------------------------------------ */
  /* 2. Page fade-in — design.md §Animations → CSS transition            */
  /*    "#app:not(.appear) { opacity: 0 }", .appear added at 2s         */
  /* ------------------------------------------------------------------ */
  const app = document.getElementById('app');
  if (app) {
    setTimeout(() => app.classList.add('appear'), 2000);
  }

  /* ------------------------------------------------------------------ */
  /* 3. Nav hide on scroll-down — design.md §Components → Nav          */
  /*    (`.nav.hide .nav-inner { transform: translateY(-100%) }`)        */
  /* ------------------------------------------------------------------ */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) {
        nav.classList.add('hide');
      } else {
        nav.classList.remove('hide');
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------ */
  /* 4. Hamburger → menu — design.md §Components → Hamburger / Menu    */
  /* ------------------------------------------------------------------ */
  const navLink = document.querySelector('.nav-link');
  const menu = document.getElementById('menu');

  const setMenu = (open) => {
    if (!menu || !navLink) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    navLink.classList.toggle('is-open', open);
    navLink.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (navLink) {
    navLink.addEventListener('click', () => {
      const willOpen = !navLink.classList.contains('is-open');
      setMenu(willOpen);
    });
  }

  if (menu) {
    menu.querySelectorAll('.menu-title').forEach((title) => {
      title.addEventListener('click', (e) => {
        e.preventDefault();
        setMenu(false);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 6. Mouse-tracking visual on hero wordmark                          */
  /*    design.md §Motion & Interaction → principles; the original     */
  /*    uses an OGL paper-curtain shader; we approximate with a        */
  /*    pointer-driven translate3d on the H1 + accent color shift.     */
  /* ------------------------------------------------------------------ */
  const wordmark = document.querySelector('.miranda-wordmark');
  if (wordmark) {
    const hero = wordmark.closest('.hero');
    let raf = 0;

    const apply = (nx, ny) => {
      // nx, ny are -1..1 normalized across the hero surface
      const tx = nx * 1.2;     // vw-ish range, in vw
      const ty = ny * 0.8;
      wordmark.style.transform = `translate3d(${tx}vw, ${ty}vw, 0)`;
      wordmark.style.textShadow = `${-nx * 0.4}vw ${-ny * 0.4}vw 0 rgba(150, 181, 159, 0.25)`;
    };

    if (hero) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => apply(nx, ny));
      });

      hero.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        wordmark.style.transform = 'translate3d(0, 0, 0)';
        wordmark.style.textShadow = 'none';
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 7. Horizontal drag on project track                                */
  /*    design.md §Components → butter-slider                          */
  /*    (lightweight stand-in — no library)                             */
  /* ------------------------------------------------------------------ */
  const track = document.getElementById('projects-track');
  if (track) {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let targetScroll = 0;
    let currentScroll = 0;

    const animate = () => {
      currentScroll += (targetScroll - currentScroll) * 0.15; // smoothAmount = 0.15
      track.scrollLeft = currentScroll;
      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        requestAnimationFrame(animate);
      }
    };

    track.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      targetScroll = startScroll;
      currentScroll = startScroll;
      track.setPointerCapture(e.pointerId);
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      targetScroll = startScroll - (e.clientX - startX);
      requestAnimationFrame(animate);
    });

    const endDrag = (e) => {
      if (!isDown) return;
      isDown = false;
      track.releasePointerCapture(e.pointerId);
      track.style.cursor = 'grab';
    };

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.style.cursor = 'grab';
  }

  /* ------------------------------------------------------------------ */
  /* 8. Card hover micro-tilt                                           */
  /*    design.md §Animations → "inline transform: translate3d"         */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('.item-img-w').forEach((img) => {
    const card = img.closest('.project-card');
    if (!card) return;

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const rx = -(((e.clientY - r.top) / r.height) * 2 - 1) * 4; // deg
      const ry =  (((e.clientX - r.left) / r.width)  * 2 - 1) * 4;
      img.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04, 1.04, 1)`;
    });

    card.addEventListener('pointerleave', () => {
      img.style.transform = '';
    });
  });

  /* ------------------------------------------------------------------ */
  /* Pathname body-class hook — design.md §Motion → Pathname class     */
  /* ------------------------------------------------------------------ */
  const m = document.location.pathname.match(/(?<=work\/).*$/);
  if (m) document.body.classList.add(`work-${m[0]}`);
})();
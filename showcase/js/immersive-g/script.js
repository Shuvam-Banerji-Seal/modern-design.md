/* ============================================================
   Immersive Garden — design.md showcase · behaviour
   Vanilla JS that mimics the GSAP/Lenis timings from design.md.
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ------------------------------------------------------------
     1. Per-word / per-letter text split
        Mirrors HeroBlock `AnimatedParagraph` + textBlock motion.
     ------------------------------------------------------------ */
  const splitToWords = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return /\S/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);

    textNodes.forEach((textNode) => {
      const text = textNode.nodeValue;
      const frag = document.createDocumentFragment();
      const tokens = text.split(/(\s+)/);
      let wordIndex = 0;
      tokens.forEach((tok) => {
        if (/^\s+$/.test(tok)) {
          frag.appendChild(document.createTextNode(tok));
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = tok;
          frag.appendChild(span);
          wordIndex++;
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });

    // Tag each .word with --i for staggered transition-delay
    const words = root.querySelectorAll(':scope > .word');
    words.forEach((w, i) => { w.style.setProperty('--i', i); });
  };

  document.querySelectorAll('[data-reveal="letter"]').forEach(splitToWords);

  /* ------------------------------------------------------------
     2. IntersectionObserver — block enter (1.9s ease-in-out)
        .mediaBlock + .textBlock fades opacity 0→1
     ------------------------------------------------------------ */
  const blockEls = document.querySelectorAll('[data-reveal="block"], [data-reveal="letter"], [data-reveal="fade"]');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });
    blockEls.forEach((el) => io.observe(el));
  } else {
    blockEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------
     3. Header fade-out on scroll (mimics headerBlock 1.5s linear
        hidden transition with 1s delay)
     ------------------------------------------------------------ */
  const header = document.querySelector('[data-header]');
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    const hideAt = 80;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > hideAt && y > lastY) header.classList.add('is-out');
      else header.classList.remove('is-out');
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
  }

  /* ------------------------------------------------------------
     4. Custom cursor (two-layer lerp follower + label swap)
        matches design.md §Custom cursor
     ------------------------------------------------------------ */
  const cursor = document.querySelector('[data-cursor-root]');
  if (cursor && !isTouch && !prefersReducedMotion) {
    const dot = cursor.querySelector('.cursor__follow');
    const ease = cursor.querySelector('.cursor__ease');
    const label = cursor.querySelector('.cursor__text');

    let tx = -100, ty = -100;       // target (pointer)
    let ex = -100, ey = -100;       // eased
    let raf;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.remove('is-hidden');
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

    const loop = () => {
      ex += (tx - ex) * 0.15;
      ey += (ty - ey) * 0.15;
      if (dot) dot.style.transform = `translate3d(${tx - 2.5}px, ${ty - 2.5}px, 0)`;
      if (ease) ease.style.transform = `translate3d(${ex - 2.5}px, ${ey - 2.5}px, 0)`;
      if (label) label.style.transform = `translate3d(${tx + 16}px, ${ty + 16}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Hover label swap + .is-over class on basicButton (toggles low-opacity)
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (label) label.textContent = el.dataset.cursor;
        cursor.classList.add('is-lowOpacity');
      });
      el.addEventListener('mouseleave', () => {
        if (label) label.textContent = '';
        cursor.classList.remove('is-lowOpacity');
      });
    });
  }

  /* ------------------------------------------------------------
     5. ScrollCursor — 3 progress dots + 120-particle fast field
        The .dots__fast field "stamps" radial-gradient dots via CSS;
        JS just drives the fast-field opacity based on scroll velocity.
     ------------------------------------------------------------ */
  const scrollCursor = document.querySelector('.scrollCursor');
  if (scrollCursor) {
    const fast = scrollCursor.querySelector('.dots__fast');
    const dots = scrollCursor.querySelectorAll('.dot__default');
    let lastY = window.scrollY;
    let lastT = performance.now();
    let fastMix = 0;

    const update = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = Math.max(now - lastT, 1);
      const v = Math.abs(dy / dt); // px/ms

      // Fast-mode: fade fast dots in proportional to scroll velocity
      const target = Math.min(v / 1.2, 1);
      fastMix += (target - fastMix) * 0.08;
      if (fast) fast.style.opacity = fastMix.toFixed(3);
      dots.forEach((d) => d.style.opacity = (1 - fastMix).toFixed(3));

      // 3 progress dots ride with scrollPct
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      dots.forEach((d, i) => {
        const y = 30 + i * 20 + pct * 30;
        d.style.top = `${y}%`;
      });

      lastY = window.scrollY;
      lastT = now;
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ------------------------------------------------------------
     6. Sound toggle (click to enable sound — label crossfade)
     ------------------------------------------------------------ */
  const sound = document.querySelector('.sound');
  if (sound) {
    sound.classList.add('sound--muted');
    sound.addEventListener('click', () => sound.classList.toggle('sound--muted'));
    // Flip to dark variant when footer is in view
    if ('IntersectionObserver' in window) {
      const fObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) sound.classList.add('sound--dark-bg');
          else sound.classList.remove('sound--dark-bg');
        });
      }, { threshold: 0.4 });
      const footer = document.querySelector('.footer');
      if (footer) fObs.observe(footer);
    }
  }

  /* ------------------------------------------------------------
     7. Page-transition cross-fade hook (0.7s ease)
        Reserved for future SPA nav; here it just ensures
        body opacity is fully restored after a tab switch.
     ------------------------------------------------------------ */
  window.addEventListener('pageshow', () => {
    document.body.style.opacity = '1';
  });

})();
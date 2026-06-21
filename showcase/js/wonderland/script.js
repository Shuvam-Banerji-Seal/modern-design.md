/* =========================================================
   Wonderland — showcase JS
   Implements scroll/hover behaviors from websites/wonderland/design.md
   (Sections §Motion & Interaction, §Animations, §Components).
   No external deps; uses GSAP-style easing values inline.
   ========================================================= */

(() => {
  'use strict';

  /* ------------------------------------------------------------
     Easing — mirrors design.md §Motion & Interaction
     ------------------------------------------------------------ */
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);          // cubic-bezier(.19,1,.22,1)
  const easeReveal   = (t) => {                                // cubic-bezier(.165,.84,.44,1)
    // approximation: ease-out-quart with slight overshoot at the end
    return t < 1 ? 1 - Math.pow(1 - t, 4) : 1;
  };

  /* ------------------------------------------------------------
     1. Loading overlay + loader percent
        (design.md §Loading overlay & loader — pulse-infinite 1s linear infinite)
     ------------------------------------------------------------ */
  const overlay = document.getElementById('loading-overlay');
  const loader = document.getElementById('loader');
  let percent = 0;

  function runLoader() {
    const tick = () => {
      // Smooth count-up; never decreases, capped at 100
      percent = Math.min(100, percent + Math.random() * 6 + 1);
      if (loader) loader.textContent = String(Math.floor(percent));
      if (percent < 100) {
        requestAnimationFrame(tick);
      } else {
        // Settle then fade out the overlay (design.md: websiteLoaded true)
        setTimeout(() => {
          overlay.classList.add('is-hidden');
          document.body.classList.remove('no-scroll');
          // Reveal nav (design.md §Nav — .show after first paint)
          const nav = document.getElementById('nav');
          if (nav) requestAnimationFrame(() => nav.classList.add('show'));
        }, 350);
      }
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------
     2. Nav .show class (already in HTML; we just ensure it
        appears after the loader clears).
     ------------------------------------------------------------ */
  // (Handled inside runLoader)

  /* ------------------------------------------------------------
     3. IntersectionObserver — section reveal (design.md §Section reveal)
        Adds .is-revealed to [data-reveal] and the footer.
     ------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  function initReveals() {
    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------
     4. Footer heading reveal
        design.md §Footer: starts at translate3d(0,90px,0), animates to 0
        as the footer scrolls into view. Word-anim-inner rotateY -60° → 0.
     ------------------------------------------------------------ */
  const footer = document.getElementById('footer');
  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        // Stagger the word-anim-inner rotations once the heading is visible
        const words = entry.target.querySelectorAll('.word-anim-inner');
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('start-rotate'), 80 * i);
        });
        footerObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );
  if (footer) footerObserver.observe(footer);

  /* ------------------------------------------------------------
     5. Burger menu toggle (design.md §Nav — burger-to-cross keyframes)
        Implemented via CSS class toggling; we mirror the duration.
     ------------------------------------------------------------ */
  const burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ------------------------------------------------------------
     6. Contact modal open/close (design.md §Contact modal)
        Slides down from -110% over 1.2s cubic-bezier(.19,1,.22,1).
     ------------------------------------------------------------ */
  const contactModal = document.getElementById('contact-modal');
  const navCta = document.getElementById('nav-cta');
  const contactClose = document.getElementById('contact-close');

  function openContact() {
    if (!contactModal) return;
    contactModal.classList.add('is-open');
    contactModal.setAttribute('aria-hidden', 'false');
  }
  function closeContact() {
    if (!contactModal) return;
    contactModal.classList.remove('is-open');
    contactModal.setAttribute('aria-hidden', 'true');
  }
  if (navCta) navCta.addEventListener('click', openContact);
  if (contactClose) contactClose.addEventListener('click', closeContact);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContact();
  });

  /* ------------------------------------------------------------
     7. Contact-words swap (design.md §Contact modal — title cyc)
        Cycles through translated "friend" words every 1.4s.
     ------------------------------------------------------------ */
  const contactWords = document.querySelectorAll('#contact-words .contact-word');
  let wordIndex = 0;
  setInterval(() => {
    if (!contactWords.length) return;
    contactWords[wordIndex].classList.remove('is-active');
    wordIndex = (wordIndex + 1) % contactWords.length;
    contactWords[wordIndex].classList.add('is-active');
  }, 1400);

  /* ------------------------------------------------------------
     8. Copy-email interaction (design.md §Footer §copy-email)
        Click on .heading-email toggles .is-copied for 2s.
     ------------------------------------------------------------ */
  document.querySelectorAll('.heading-email .text').forEach((el) => {
    el.addEventListener('click', (e) => {
      // Use clipboard if available, otherwise just toggle state for demo
      const txt = el.textContent.trim();
      const parent = el.closest('.heading-email');
      if (!parent) return;
      if (navigator.clipboard && txt) {
        navigator.clipboard.writeText(txt).catch(() => {});
      }
      parent.classList.add('is-copied');
      setTimeout(() => parent.classList.remove('is-copied'), 2000);
    });
  });

  /* ------------------------------------------------------------
     9. Newsletter input — isSending state (design.md §load keyframe)
     ------------------------------------------------------------ */
  document.querySelectorAll('.form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = form.querySelector('.input-container');
      if (c) {
        c.classList.add('isSending');
        setTimeout(() => c.classList.remove('isSending'), 2400);
      }
    });
  });

  /* ------------------------------------------------------------
     10. Cookie banner dismiss (design.md §Cookie banner)
         Stores localStorage["cookie-accept"] = "true".
     ------------------------------------------------------------ */
  const cookie = document.getElementById('cookie');
  const cookieOk = document.getElementById('cookie-ok');
  if (cookieOk) {
    cookieOk.addEventListener('click', () => {
      try { localStorage.setItem('cookie-accept', 'true'); } catch (e) {}
      if (cookie) cookie.style.display = 'none';
    });
  }
  // Hide by default if already accepted
  try {
    if (localStorage.getItem('cookie-accept') === 'true' && cookie) {
      cookie.style.display = 'none';
    }
  } catch (e) {}

  /* ------------------------------------------------------------
     11. Progress bar driven by scroll (design.md §Color Progress bar)
         scaleX(0 → 1) over the page scroll.
     ------------------------------------------------------------ */
  const progressBar = document.getElementById('progress');
  const progressInner = document.getElementById('progress-inner');
  let scrollProgress = 0;
  let scrollTarget = 0;
  function onScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollTarget = Math.min(1, Math.max(0, window.scrollY / max));
    if (progressBar) progressBar.classList.add('is-on');
  }
  function tickProgress() {
    scrollProgress += (scrollTarget - scrollProgress) * 0.08;
    if (progressInner) progressInner.style.transform = `scaleX(${scrollProgress.toFixed(4)})`;
    requestAnimationFrame(tickProgress);
  }

  /* ------------------------------------------------------------
     12. WebGL "artwork" — minimal canvas placeholder
         (design.md §WebGL artwork canvas — Three.js r132, scroll-driven camera)
         We don't ship Three.js; we draw a procedural placeholder that
         reacts to scroll (sin-driven x offset) and time.
     ------------------------------------------------------------ */
  const canvas = document.getElementById('gl-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    const projectCount = 10;
    const colors = ['#EC6437', '#F86430', '#ECE4DA', '#F7EFE6', '#DED6CB', '#484749', '#1A191B', '#2F2E31', '#F59371', '#5FE32D'];
    const t0 = performance.now();

    function draw(now) {
      const t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Background: warm "earth arch"
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.78, 10, width * 0.5, height * 0.78, height * 0.9);
      grad.addColorStop(0, '#ECE4DA');
      grad.addColorStop(0.55, '#D6CCBE');
      grad.addColorStop(1, '#1A191B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Arch ring of project cards (mirrors design.md "earth arch")
      const cx = width * 0.5;
      const cy = height * 0.85;
      const r = Math.min(width, height) * 0.42;
      // Sin-driven horizontal sway driven by scrollProgress * projectCount
      const sway = 1.5 * Math.sin(-scrollProgress * Math.PI * projectCount) * (1 - Math.min(1, 0.02 * Math.abs(scrollTarget - scrollProgress)));

      for (let i = 0; i < projectCount; i++) {
        const a = (i / projectCount) * Math.PI - Math.PI / 2;
        const x = cx + Math.cos(a) * r + sway * (i % 2 === 0 ? 1 : -1) * 20;
        const y = cy + Math.sin(a) * r;
        const cardW = Math.min(width * 0.18, 220);
        const cardH = cardW * 0.66;
        const rot = (a + Math.PI / 2) * (180 / Math.PI);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rot * Math.PI) / 180);
        // card shadow
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(-cardW / 2 + 8, -cardH / 2 + 12, cardW, cardH);
        // card face
        const cGrad = ctx.createLinearGradient(0, -cardH / 2, 0, cardH / 2);
        cGrad.addColorStop(0, colors[i % colors.length]);
        cGrad.addColorStop(1, '#1A191B');
        ctx.fillStyle = cGrad;
        ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
        // label
        ctx.fillStyle = '#DED6CB';
        ctx.font = `${Math.max(10, cardW * 0.05)}px "Space Grotesk", system-ui, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`0${i + 1}`, -cardW / 2 + 10, cardH / 2 - 8);
        ctx.restore();
      }

      // bloom-ish glow
      const bloom = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 1.6);
      bloom.addColorStop(0, 'rgba(236, 100, 55, 0.18)');
      bloom.addColorStop(1, 'rgba(26, 25, 27, 0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ------------------------------------------------------------
     13. Hover lift for case-study cards (CSS handles 90% but we
         also lift the inner meta text by 2px for a subtle parallax).
     ------------------------------------------------------------ */
  document.querySelectorAll('.project__link').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const meta = link.querySelector('.project__meta');
      if (meta) meta.style.transform = 'translateY(-2px)';
      meta && (meta.style.transition = 'transform .5s cubic-bezier(.19,1,.22,1)');
    });
    link.addEventListener('mouseleave', () => {
      const meta = link.querySelector('.project__meta');
      if (meta) meta.style.transform = '';
    });
  });

  /* ------------------------------------------------------------
     14. Discover label reveal
        design.md: discover-pulse 2s ease 2s 3 forwards.
     ------------------------------------------------------------ */
  const discover = document.getElementById('discover');
  if (discover) {
    setTimeout(() => discover.classList.add('showDiscover'), 600);
  }

  /* ------------------------------------------------------------
     Boot
     ------------------------------------------------------------ */
  function boot() {
    initReveals();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    tickProgress();
    runLoader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

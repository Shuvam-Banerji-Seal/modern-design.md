/* ==========================================================================
   Resn — design.md showcase script
   Vanilla JS implementation of the interactive language described in
   websites/resn/design.md. No external libraries.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1.  Loader  — bar progress, percentage tween, fade-out on complete
   * ------------------------------------------------------------------ */
  const loader     = document.getElementById('loader');
  const loaderFill = document.getElementById('loader-fill');
  const loaderPct  = document.getElementById('loader-pct');

  function setLoader(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    loaderFill.style.width = clamped + '%';
    loaderPct.textContent  = String(Math.floor(clamped)).padStart(2, '0');
  }

  // Simulated asset preload (since we have no real THREE.js bundle in
  // the showcase). Reports progress to the bar with the out-back curve
  // used in the live site.
  function runLoader() {
    if (!loader) return Promise.resolve();
    return new Promise((resolve) => {
      let pct = 0;
      setLoader(0);
      const tick = () => {
        // Eased increments: faster at the start, slower at the end.
        const remaining = 100 - pct;
        const step = Math.max(0.4, remaining * 0.06 + Math.random() * 1.2);
        pct = Math.min(100, pct + step);
        setLoader(pct);
        if (pct < 100) {
          window.setTimeout(tick, 60 + Math.random() * 80);
        } else {
          window.setTimeout(() => {
            loader.classList.add('is-done');
            resolve();
          }, 320);
        }
      };
      tick();
    });
  }

  /* ------------------------------------------------------------------ *
   * 2.  Tagline  — kinetic letter-by-letter reveal on load
   * ------------------------------------------------------------------ */
  function revealTagline() {
    const tag = document.querySelector('.tagline');
    if (!tag) return;
    // small delay so the loader fade is felt first
    window.setTimeout(() => tag.classList.add('is-in'), 200);
    // second line: nudge opacity to 1 once the staggered letters settle
    window.setTimeout(() => tag.classList.add('is-fully-in'), 1400);
  }

  /* ------------------------------------------------------------------ *
   * 3.  Award ticker  — counter tween (eases from 0 to target)
   * ------------------------------------------------------------------ */
  function tweenNumber(el) {
    const target = parseInt(el.dataset.target || '0', 10);
    const dur    = 1800;
    const start  = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.floor(target * eased)).padStart(3, '0');
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = String(target).padStart(3, '0');
    }
    requestAnimationFrame(frame);
  }

  function initTicker() {
    document.querySelectorAll('.ticker-number').forEach(tweenNumber);
    document.querySelectorAll('.stat--accent').forEach(tweenNumber);
  }

  /* ------------------------------------------------------------------ *
   * 4.  Background "shards"  — small WebGL-free painter that fakes
   *     the warm-black 3D background with moving gradients. Stays
   *     well under 1KB, runs on a 16ms rAF.
   * ------------------------------------------------------------------ */
  function initShards() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr  = Math.min(2, window.devicePixelRatio || 1);

    let w = 0, h = 0, t = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function shard(cx, cy, r, rot, hue) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      const grd = ctx.createLinearGradient(-r, -r, r, r);
      grd.addColorStop(0,    `hsla(${hue}, 18%, 14%, 0.85)`);
      grd.addColorStop(0.55, `hsla(${hue}, 14%, 10%, 0.65)`);
      grd.addColorStop(1,    `hsla(${hue},  8%,  6%, 0.0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.8, -r * 0.2);
      ctx.lineTo(r * 0.5,  r);
      ctx.lineTo(-r * 0.7, r * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      t += 0.0035;
      ctx.clearRect(0, 0, w, h);

      // base vignette
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.55, 0, w * 0.5, h * 0.5, Math.max(w, h));
      bg.addColorStop(0,   '#1C1A1C');
      bg.addColorStop(0.6, '#141214');
      bg.addColorStop(1,   '#070607');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // floating shards
      for (let i = 0; i < 7; i++) {
        const cx = w * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.7 + i * 1.3)));
        const cy = h * (0.2 + 0.6 * (0.5 + 0.5 * Math.cos(t * 0.6 + i * 0.9)));
        const r  = 90 + 60 * Math.sin(t * 0.5 + i);
        const rot = t * 0.3 + i * 1.1;
        const hue = 20 + i * 4; // warm black
        shard(cx, cy, r, rot, hue);
      }

      // film grain — additive dots, very cheap
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.fillRect(x, y, 1, 1);
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    draw();
  }

  /* ------------------------------------------------------------------ *
   * 5.  Interactive bar  — knob drag + click-to-cycle scenes
   * ------------------------------------------------------------------ */
  function initInteractiveBar() {
    const bar   = document.querySelector('.interactive-bar');
    if (!bar) return;
    const knob  = bar.querySelector('.ib-knob');
    const track = bar.querySelector('.ib-track');
    const digit = bar.querySelector('.ib-digit');
    const max   = 5;

    function setFrame(n) {
      const clamped = Math.max(0, Math.min(max - 1, n));
      const pct = clamped / (max - 1);
      knob.style.transform = `translateX(${pct * 100}%) translateX(-8px)`;
      knob.classList.add('is-active');
      digit.textContent = String(clamped + 1).padStart(2, '0');
      window.setTimeout(() => knob.classList.remove('is-active'), 700);
    }

    // click anywhere on the track to jump
    track.addEventListener('click', (e) => {
      const r = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      setFrame(Math.round(pct * (max - 1)));
    });

    // simple pointer drag
    let dragging = false;
    knob.addEventListener('pointerdown', (e) => {
      dragging = true;
      knob.setPointerCapture(e.pointerId);
    });
    knob.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const r = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      knob.style.transform = `translateX(${pct * 100}%) translateX(-8px)`;
      digit.textContent = String(Math.round(pct * (max - 1)) + 1).padStart(2, '0');
    });
    knob.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      knob.releasePointerCapture(e.pointerId);
      knob.classList.add('is-active');
      window.setTimeout(() => knob.classList.remove('is-active'), 700);
    });

    setFrame(0);
  }

  /* ------------------------------------------------------------------ *
   * 6.  Shell buttons  — Drop ripple, Audio toggle, Menu / Reel routes
   * ------------------------------------------------------------------ */
  function initShell() {
    // Drop — emit a one-shot pulse and fade in the featured card
    const dropBtn = document.querySelector('.shell-btn--drop');
    dropBtn && dropBtn.addEventListener('click', () => {
      dropBtn.classList.remove('is-pulsing');
      // restart animation
      void dropBtn.offsetWidth;
      dropBtn.classList.add('is-pulsing');
      window.setTimeout(() => dropBtn.classList.remove('is-pulsing'), 900);

      const featured = document.getElementById('featured');
      if (featured) {
        featured.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Audio — toggle aria-pressed; visual state is purely CSS
    const audioBtn = document.querySelector('.shell-btn--audio');
    audioBtn && audioBtn.addEventListener('click', () => {
      const pressed = audioBtn.getAttribute('aria-pressed') === 'true';
      audioBtn.setAttribute('aria-pressed', String(!pressed));
    });

    // Discover menu
    const menuBtn   = document.querySelector('.shell-btn--menu');
    const menu      = document.getElementById('discover');
    const menuClose = menu && menu.querySelector('.discover-close');
    function openMenu()  { if (!menu) return; menu.dataset.open = 'true';  menu.setAttribute('aria-hidden', 'false'); menuBtn && menuBtn.setAttribute('aria-expanded', 'true');  document.body.style.overflow = 'hidden'; }
    function closeMenu() { if (!menu) return; menu.dataset.open = 'false'; menu.setAttribute('aria-hidden', 'true');  menuBtn && menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    menuBtn   && menuBtn.addEventListener('click', openMenu);
    menuClose && menuClose.addEventListener('click', closeMenu);
    menu && menu.querySelectorAll('.discover-link, .discover-cta').forEach((a) => {
      a.addEventListener('click', () => window.setTimeout(closeMenu, 50));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu && menu.dataset.open === 'true') closeMenu();
    });

    // Showreel overlay
    const reelBtn = document.querySelector('.shell-btn--reel');
    const reel    = document.getElementById('reel');
    function openReel()  { if (!reel) return; reel.dataset.open = 'true';  reel.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
    function closeReel() { if (!reel) return; reel.dataset.open = 'false'; reel.setAttribute('aria-hidden', 'true');  document.body.style.overflow = ''; }
    reelBtn && reelBtn.addEventListener('click', openReel);
    reel    && reel.addEventListener('click', (e) => { if (e.target === reel) closeReel(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reel && reel.dataset.open === 'true') closeReel();
    });
  }

  /* ------------------------------------------------------------------ *
   * 7.  Scroll reveal  — IntersectionObserver on `.reveal` and sections
   * ------------------------------------------------------------------ */
  function initReveal() {
    // Tag every section that should fade in
    document.querySelectorAll(
      '.featured, .work, .about, .section-head, .work-card, .stat'
    ).forEach((el) => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------ *
   * 8.  Smooth scroll for in-page anchors (the live site is one page)
   * ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const tgt = document.querySelector(id);
        if (!tgt) return;
        e.preventDefault();
        tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 9.  Boot
   * ------------------------------------------------------------------ */
  function boot() {
    initShards();
    initShell();
    initInteractiveBar();
    initReveal();
    initSmoothScroll();

    runLoader().then(() => {
      revealTagline();
      initTicker();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

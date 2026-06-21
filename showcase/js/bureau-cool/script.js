/* ==========================================================================
   Bureau Cool — script.js
   Implements hover / scroll / pointer behaviors from
   websites/bureau-cool/design.md (§Components, §Motion & Interaction).

   Only behavior, no DOM structure: the markup lives in index.html, the
   tokens live in style.css. No external dependencies.
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------
     Utilities
     -------------------------------------------------------------------- */

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------
     1. Pill navigation — smooth-scroll to anchored sections
        design.md §Components > Pill button (nav)
        The two nav pills route to: #start (Projects) and #information.
        -------------------------------------------------------------------- */

  function initNavPills() {
    const pills = $$('.pill');
    if (!pills.length) return;

    const targets = ['#start', '#information'];

    pills.forEach((pill, i) => {
      const target = document.querySelector(targets[i]);
      if (!target) return;

      pill.addEventListener('click', (e) => {
        e.preventDefault();
        if (prefersReducedMotion()) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* --------------------------------------------------------------------
     2. Marquee — pause on hover (CSS keyframes already drive motion)
        design.md §Components > Marquee strip / Marquee ticker
        -------------------------------------------------------------------- */

  function initMarquee() {
    const track = $('.marquee-track');
    if (!track) return;

    const parent = track.closest('.marquee');

    const pause = () => {
      track.style.animationPlayState = 'paused';
    };
    const resume = () => {
      track.style.animationPlayState = 'running';
    };

    if (parent) {
      parent.addEventListener('mouseenter', pause);
      parent.addEventListener('mouseleave', resume);
      parent.addEventListener('focusin',  pause);
      parent.addEventListener('focusout', resume);
    }
  }

  /* --------------------------------------------------------------------
     3. Project cards — small scale on hover, matches design.md
        §Components > Image card (project) → md:hover:scale-110 / 1.05 / 0.95
        §Motion > Specific behaviors
        -------------------------------------------------------------------- */

  function initProjectHover() {
    const titles = $$('.project-title');

    titles.forEach((title) => {
      const wrapper = title.closest('.basic-hover');
      if (!wrapper) return;

      wrapper.addEventListener('mouseenter', () => {
        title.style.transform = 'scale(1.02)';
        title.style.transformOrigin = 'left center';
      });
      wrapper.addEventListener('mouseleave', () => {
        title.style.transform = 'scale(1)';
      });
    });
  }

  /* --------------------------------------------------------------------
     4. Drag handle — pointer-driven `translate3d(x, y, 0)` element
        design.md §Components > Draggable hero card:
          "outer <div class="fixed z-80 top-0 left-0 backface-hidden
           md:cursor-grab pointer-events-none" style="transform:
           translate3d(...); width: 360px; height: 202.5px;">"
        Behavior: parent has pointer-events:none so the handle floats
        above without intercepting clicks; JS follows the cursor and
        writes inline translate3d. We add cursor-grab toggling on a
        child element so the cursor does change.
        -------------------------------------------------------------------- */

  function initDragHandle() {
    if (prefersReducedMotion()) return;

    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.setAttribute('aria-hidden', 'true');

    handle.innerHTML = `
      <div class="drag-handle-frame">
        <span class="drag-handle-label smallsans">drag</span>
      </div>
    `;

    document.body.appendChild(handle);

    // Initial position (matches the inline style in design.md, rounded).
    let x = 168;
    let y = 168;

    const apply = () => {
      handle.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    };
    apply();

    // Follow the cursor with a slight damping.
    let targetX = x;
    let targetY = y;
    let raf = null;

    const onMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetX = Math.max(0, Math.min(w - 360, e.clientX - 180));
      targetY = Math.max(0, Math.min(h - 202, e.clientY - 100));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = null;
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      apply();
      if (Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    // Cursor grab states on the frame.
    const frame = handle.querySelector('.drag-handle-frame');
    if (frame) {
      frame.addEventListener('pointerdown', () => {
        handle.classList.add('is-grabbing');
      });
      window.addEventListener('pointerup', () => {
        handle.classList.remove('is-grabbing');
      });
    }
  }

  /* --------------------------------------------------------------------
     5. Scroll reveals — design.md §Motion & Interaction:
        "Section reveal on scroll: not explicitly observed in the static
         DOM — no IntersectionObserver markers found … GSAP timelines
         likely drive scroll-based reveals".
        We replicate the intent with an IntersectionObserver fade/translate
        on each major section.
        -------------------------------------------------------------------- */

  function initScrollReveals() {
    if (prefersReducedMotion()) return;
    if (!('IntersectionObserver' in window)) return;

    const targets = $$('.project, .information > *, .footer');

    targets.forEach((el) => {
      el.classList.add('reveal');
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05,
    });

    targets.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------------------
     6. Circle-bullet hover micro-interaction
        design.md §Components > Circle bullet / grab dot
        Background fades to #EDEDED on hover (group-hover).
        -------------------------------------------------------------------- */

  function initProjectDotHover() {
    const dots = $$('.project-dot');
    dots.forEach((dot) => {
      const row = dot.closest('.project-row') || dot.closest('.project');
      if (!row) return;
      row.addEventListener('mouseenter', () => {
        dot.style.background = 'var(--color-neutral-200)';
      });
      row.addEventListener('mouseleave', () => {
        dot.style.background = 'var(--color-black)';
      });
    });
  }

  /* --------------------------------------------------------------------
     7. Feature row date hover — bring date back to full opacity on
        press-row hover (matches .grey-hover inverse in design.md).
        -------------------------------------------------------------------- */

  function initFeatureRowHover() {
    const rows = $$('.feature-row');
    rows.forEach((row) => {
      const link = row.querySelector('a.basic-hover');
      if (!link) return;
      row.addEventListener('mouseenter', () => {
        link.style.opacity = '1';
      });
      row.addEventListener('mouseleave', () => {
        link.style.opacity = '';
      });
    });
  }

  /* --------------------------------------------------------------------
     Boot
     -------------------------------------------------------------------- */

  function boot() {
    initNavPills();
    initMarquee();
    initProjectHover();
    initProjectDotHover();
    initFeatureRowHover();
    initScrollReveals();
    initDragHandle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
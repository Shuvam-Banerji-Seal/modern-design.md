/* =========================================================================
   makemepulse — design.md showcase
   Implements interactions referenced in
   websites/makemepulse/design.md §Motion & Interaction.
   ========================================================================= */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;

  /* ------------------------------------------------------------------------
     Spinner hide (design.md §Spinner / loader)
     ------------------------------------------------------------------------ */
  const spinner = doc.getElementById('page-spinner');
  const hideSpinner = () => {
    if (!spinner) return;
    spinner.classList.add('is-hidden');
    setTimeout(() => spinner.remove(), 600);
  };
  // Show briefly, then fade on window load.
  if (doc.readyState === 'complete') hideSpinner();
  else window.addEventListener('load', hideSpinner);

  /* ------------------------------------------------------------------------
     Nuxt progress bar fake (design.md: width / opacity transitions)
     ------------------------------------------------------------------------ */
  const progress = doc.getElementById('nuxt-progress');
  if (progress) {
    requestAnimationFrame(() => {
      progress.style.width = '40%';
      setTimeout(() => { progress.style.width = '85%'; }, 120);
      setTimeout(() => {
        progress.style.width = '100%';
        setTimeout(() => {
          progress.style.opacity = '0';
          setTimeout(() => progress.remove(), 400);
        }, 100);
      }, 260);
    });
  }

  /* ------------------------------------------------------------------------
     Custom cursor (design.md §Custom cursor)
     - position: translate3d(-50%,-50%,0) per frame
     - 0.667s cubic-bezier(.4,.8,.74,1) transition
     ------------------------------------------------------------------------ */
  const cursor = doc.querySelector('.cursor-type:not(.cursor-type--video)');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetX = cursorX;
  let targetY = cursorY;
  const isCoarse = matchMedia('(pointer: coarse)').matches;

  if (cursor && !isCoarse) {
    cursor.classList.add('is-active');
    doc.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    const tick = () => {
      // Lerp toward target for the "1s-ish" feel described in design.md
      cursorX += (targetX - cursorX) * 0.18;
      cursorY += (targetY - cursorY) * 0.18;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Hide cursor on pointer leave
    doc.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    doc.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
  } else if (cursor) {
    cursor.remove();
    doc.body.style.cursor = 'auto';
  }

  /* ------------------------------------------------------------------------
     Showreel custom cursor (design.md §Showreel play cursor)
     ------------------------------------------------------------------------ */
  const videoFrame = doc.getElementById('video-frame');
  const videoCursor = doc.querySelector('.cursor-type--video');
  if (videoFrame && videoCursor && !isCoarse) {
    let vx = 0, vy = 0;
    videoFrame.addEventListener('mousemove', (e) => {
      const r = videoFrame.getBoundingClientRect();
      vx = e.clientX - r.left;
      vy = e.clientY - r.top;
      videoCursor.style.opacity = '1';
      videoCursor.style.transform =
        `translate3d(${vx}px, ${vy}px, 0) translate(-50%, -50%)`;
    });
    videoFrame.addEventListener('mouseleave', () => {
      videoCursor.style.opacity = '0';
    });
    videoFrame.addEventListener('click', () => {
      videoFrame.classList.toggle('is-playing');
      videoFrame.classList.add('is-playing');
      // Simulate "playing" state: hide poster + play btn
      setTimeout(() => {
        videoFrame.classList.remove('is-playing');
        videoFrame.classList.add('is-playing');
      }, 50);
    });
  }

  /* ------------------------------------------------------------------------
     Sticky nav + theme swap (design.md §Nav)
     - is-sticky adds gradient overlays
     - color swap based on the section under the nav (theme-light / theme-dark)
     ------------------------------------------------------------------------ */
  const navbar = doc.getElementById('navbar');
  const burger = doc.getElementById('burger');
  const navEl = doc.querySelector('.app-header__nav');
  const sections = Array.from(doc.querySelectorAll('.module'));

  const updateNavTheme = () => {
    if (!navbar) return;
    const navH = 80;
    const y = window.scrollY + navH;
    let overLight = false;
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const bottom = top + r.height;
      if (y >= top && y < bottom) {
        overLight = s.classList.contains('theme-light');
        break;
      }
    }
    navbar.classList.toggle('is-light', overLight);
    navbar.classList.toggle('is-sticky', window.scrollY > 80);
  };
  if (navbar) {
    updateNavTheme();
    window.addEventListener('scroll', updateNavTheme, { passive: true });
    window.addEventListener('resize', updateNavTheme);
  }

  /* ------------------------------------------------------------------------
     Burger menu (mobile)
     ------------------------------------------------------------------------ */
  if (burger && navEl) {
    burger.addEventListener('click', () => {
      const open = navEl.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Close drawer when a link is clicked
    navEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navEl.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     gsap-hidden reveal (design.md §Hero reveal)
     IntersectionObserver flips visibility: hidden -> inherit
     ------------------------------------------------------------------------ */
  const revealTargets = doc.querySelectorAll('.gsap-hidden, .card__baseline');
  const ioReveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('gsap-in');
      if (entry.target.classList.contains('card__baseline')) {
        entry.target.classList.add('is-in');
      }
      ioReveal.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  revealTargets.forEach((el) => ioReveal.observe(el));

  /* ------------------------------------------------------------------------
     Image reveal (design.md §Image reveal)
     .embed-responsive starts at opacity 0 + scale 1.04;
     IO flips is-loaded once visible.
     ------------------------------------------------------------------------ */
  const embedImgs = doc.querySelectorAll('.embed-responsive');
  const ioImg = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-loaded');
        ioImg.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  embedImgs.forEach((el) => ioImg.observe(el));

  /* ------------------------------------------------------------------------
     Floating form labels (design.md §Form focus)
     The CSS handles transform via :focus + [data-value].
     JS just keeps `data-value` in sync with input.value
     (also handles <select> if added later).
     ------------------------------------------------------------------------ */
  const formFields = doc.querySelectorAll('.form-field');
  formFields.forEach((ff) => {
    const input = ff.querySelector('input, textarea');
    if (!input) return;
    const sync = () => {
      ff.setAttribute('data-value', input.value || '');
    };
    sync();
    input.addEventListener('input', sync);
    input.addEventListener('blur', sync);
  });

  /* ------------------------------------------------------------------------
     Newsletter submit (design.md §Newsletter form)
     No backend; just emit a fake response.
     ------------------------------------------------------------------------ */
  doc.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value) return;
      const note = doc.createElement('p');
      note.className = 'paragraph-small';
      note.textContent = 'Thanks — see you in your inbox.';
      note.style.color = 'inherit';
      note.style.opacity = '0';
      note.style.transition = 'opacity .25s ease-in-out';
      form.appendChild(note);
      requestAnimationFrame(() => { note.style.opacity = '1'; });
      form.querySelector('input').value = '';
      form.querySelector('.form-field').setAttribute('data-value', '');
    });
  });

  /* ------------------------------------------------------------------------
     Makemeplay clip-path reveal (design.md §Makemeplay CTA)
     --path-origin starts as inset(45% 0 45% 0); on intersection we add
     .is-reduced which switches to --path-destination. Transition: clip-path 1s
     cubic-bezier(.66,0,.34,1) (declared in CSS).
     ------------------------------------------------------------------------ */
  const clipEl = doc.getElementById('makemeplay-clip');
  if (clipEl) {
    clipEl.style.setProperty('--path-origin', 'inset(45% 0 45% 0 round 0)');
    clipEl.style.setProperty('--path-destination', 'inset(0 0 0 0 round 0)');
    const ioClip = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          clipEl.classList.add('is-reduced');
          ioClip.unobserve(clipEl);
        }
      });
    }, { threshold: 0.35 });
    ioClip.observe(clipEl);
  }

  /* ------------------------------------------------------------------------
     Footer accordion (design.md §Footer)
     Mobile only. Buttons toggle aria-expanded on themselves and
     hide/show their sibling .footer-panel.
     ------------------------------------------------------------------------ */
  doc.querySelectorAll('.footer-title button').forEach((btn) => {
    const targetId = btn.getAttribute('aria-controls');
    const panel = targetId ? doc.getElementById(targetId) : null;
    if (!panel) return;
    panel.setAttribute('aria-hidden', 'true');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.setAttribute('aria-hidden', String(open));
    });
  });

  /* ------------------------------------------------------------------------
     Smooth scroll for in-page anchors (mimics Locomotive Scroll feel)
     ------------------------------------------------------------------------ */
  doc.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = doc.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------------------
     Card hover: image parallax tilt (small flourish)
     ------------------------------------------------------------------------ */
  doc.querySelectorAll('.card__image .image-reveal__mask').forEach((mask) => {
    const card = mask.closest('.card');
    if (!card) return;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      mask.style.transform = `translate3d(${x * -8}px, ${y * -8}px, 0)`;
    });
    card.addEventListener('mouseleave', () => {
      mask.style.transform = '';
    });
  });

  /* ------------------------------------------------------------------------
     Showreel "play" simulation (design.md §Video player)
     ------------------------------------------------------------------------ */
  if (videoFrame) {
    const playBtn = videoFrame.querySelector('.video-player__btn--play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        videoFrame.classList.add('is-playing');
      });
    }
  }

})();

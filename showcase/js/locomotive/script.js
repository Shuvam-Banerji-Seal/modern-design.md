/* ============================================================
   Locomotive — design.md showcase
   Vanilla JS implementation mirroring the GSAP / Lenis / Three.js
   behavior described in design.md (§Animations, §Motion).
   ============================================================ */

(function () {
  'use strict';

  // -- Set --vh custom property (design.md §Vertical rhythm) -------
  const setVH = () => {
    document.documentElement.style.setProperty(
      '--vh', window.innerHeight / 100 + 'px'
    );
  };
  setVH();
  window.addEventListener('resize', setVH);

  // -- Preloader dismissal (design.md §Preloader, animation-fill-mode) ----
  // The real site uses a 1.2s promise + preloaderPromise gate.
  const MIN_PRELOAD_MS = 1200;
  const start = performance.now();

  const dismissPreloader = () => {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, MIN_PRELOAD_MS - elapsed);
    setTimeout(() => {
      document.documentElement.classList.remove('is-first-loading');
    }, wait);
  };

  // Pre-mark as first-loading so the CSS hides the page during paint
  document.documentElement.classList.add('is-first-loading');

  // Trigger dismissal once the window has finished loading
  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
  }

  // -- ScrollProgress engine (design.md §Custom ScrollTrigger alt) ---
  // Mirrors the per-element --progress CSS variable: updates 0..1
  // for any element carrying [data-scroll-css-progress].
  const progressEls = document.querySelectorAll('[data-scroll-css-progress]');
  const homeHero = document.querySelector('.c-home-hero');
  const heroContent = document.querySelector('.c-home-hero_content');

  const updateProgress = () => {
    if (!homeHero) return;
    const rect = homeHero.getBoundingClientRect();
    const heroH = homeHero.offsetHeight || 1;
    // 0 when hero top hits the viewport top; 1 when scrolled past it
    const progress = Math.min(
      1,
      Math.max(0, -rect.top / (heroH - window.innerHeight * 0.5))
    );
    progressEls.forEach((el) => {
      el.style.setProperty('--progress', progress.toFixed(3));
      const mapped = Math.max(0, (progress - 0.5) / 0.5);
      el.style.setProperty('--mapped-progress', mapped.toFixed(3));
    });

    // is-over-home-hero (design.md §Header mix-blend-mode)
    const overHero = rect.top < window.innerHeight * 0.25 && rect.bottom > 0;
    document.documentElement.classList.toggle('is-over-home-hero', overHero);
    document.documentElement.classList.toggle('is-scrolled-past-hero', rect.bottom < 0);
  };

  // -- Header show/hide on scroll direction (design.md §Custom Header) ----
  let lastY = window.scrollY;
  let scrollAccum = 0;

  const updateHeaderOnScroll = () => {
    const y = window.scrollY;
    const dy = y - lastY;

    if (Math.abs(dy) > 4) {
      document.documentElement.classList.toggle('is-scrolling-down', dy > 0 && y > 80);
      document.documentElement.classList.toggle('is-scrolling-up', dy < 0);
      lastY = y;
    }
  };

  // -- 3D Ring auto-rotate speed (design.md §GSAP Ring auto-rotate) ----
  // Bez easing cubic-bezier(0.4, 0, 1, 1) used by the Ring module
  const bezEasing = (t) => {
    // cubic-bezier(0.4, 0, 1, 1) approximation
    const c = 1.70158;
    return t * t * ((c + 1) * t - c);
  };
  const mapRange = (inMin, inMax, outMin, outMax, t) =>
    outMin + (outMax - outMin) * Math.min(1, Math.max(0, (t - inMin) / (inMax - inMin)));

  const ring = document.querySelector('.c-ring');
  const ringScene = ring ? ring.querySelector('.c-ring_scene') : null;

  const tickRing = (ts) => {
    if (!ring || !ringScene) return;
    const progress = parseFloat(ring.style.getPropertyValue('--progress')) || 0;
    const eased = bezEasing(progress);
    const speed = mapRange(0.5, 1, 2, 20, eased);
    const rotation = (ts / 1000) * speed;
    ringScene.style.transform =
      `rotateX(70deg) rotateY(${(rotation * 0.6) % 360}deg) rotateZ(${rotation % 360}deg)`;
  };

  // -- Scroll reveal (data-reveal attribute) ------------------------
  const revealEls = document.querySelectorAll('[data-reveal], .c-featured-links_item, .c-home-about_title, .c-home-extras_title, .c-section-overline');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Stagger child items if they are list items
          if (entry.target.children.length > 0) {
            Array.from(entry.target.children).forEach((child, i) => {
              child.style.transitionDelay = `${i * 60}ms`;
              child.classList.add('is-revealed');
            });
          }
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );
  revealEls.forEach((el) => io.observe(el));

  // -- Letter-shuffle hover (design.md §Hovers module) -------------
  // The Hovers module shuffles each character 4 times over 0.25s using
  // a Fisher-Yates-style swap. This is a faithful vanilla implementation.
  const shuffleEl = (node, iterations, interval) => {
    const original = node.textContent;
    const chars = original.split('');
    if (chars.length < 2) return () => {};
    let i = 0;
    const timer = setInterval(() => {
      // Fisher-Yates single-step swap
      for (let k = chars.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [chars[k], chars[j]] = [chars[j], chars[k]];
      }
      node.textContent = chars.join('');
      i++;
      if (i >= iterations) {
        clearInterval(timer);
        node.textContent = original;
      }
    }, interval);
    return () => {
      clearInterval(timer);
      node.textContent = original;
    };
  };

  document.querySelectorAll('[data-hover-shuffle]').forEach((link) => {
    let cancel = null;
    link.addEventListener('mouseenter', () => {
      cancel = shuffleEl(link, 4, 62.5);
    });
    link.addEventListener('mouseleave', () => {
      if (cancel) cancel();
    });
    link.addEventListener('focus', () => {
      cancel = shuffleEl(link, 4, 62.5);
    });
    link.addEventListener('blur', () => {
      if (cancel) cancel();
    });
  });

  // Also handle the featured-link title halves (children)
  document.querySelectorAll('[data-hover-shuffle-child]').forEach((child) => {
    let cancel = null;
    const parent = child.closest('.c-featured-links_item');
    if (!parent) return;
    parent.addEventListener('mouseenter', () => {
      cancel = shuffleEl(child, 4, 62.5);
    });
    parent.addEventListener('mouseleave', () => {
      if (cancel) cancel();
    });
  });

  // -- Featured-link hover image (design.md §FeaturedLinks) --------
  // Real module places an image over the title. We simulate by
  // nudging the title halves inward on hover for the same feel.
  document.querySelectorAll('.c-featured-links_item').forEach((row) => {
    const halves = row.querySelectorAll('[data-hover-shuffle-child]');
    row.addEventListener('mouseenter', () => {
      halves.forEach((h) => {
        h.style.transform = 'translateY(0.1em) scale(0.96)';
      });
    });
    row.addEventListener('mouseleave', () => {
      halves.forEach((h) => {
        h.style.transform = 'translateY(0.1em)';
      });
    });
  });

  // -- Mobile menu toggle (design.md §Header, data-header=menu-toggler) --
  const toggler = document.querySelector('.c-header_menu-toggler');
  const menu = document.getElementById('mobile-menu');
  if (toggler && menu) {
    toggler.addEventListener('click', () => {
      const open = document.documentElement.classList.toggle('has-menu-opened');
      toggler.setAttribute('aria-expanded', String(open));
      toggler.textContent = open ? 'Close' : 'Menu';
      if (open) {
        // Focus trap: focus first menu link
        const firstLink = menu.querySelector('a, button');
        if (firstLink) firstLink.focus();
      } else {
        toggler.focus();
      }
    });

    // Esc closes menu + returns focus to toggler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.documentElement.classList.contains('has-menu-opened')) {
        document.documentElement.classList.remove('has-menu-opened');
        toggler.setAttribute('aria-expanded', 'false');
        toggler.textContent = 'Menu';
        toggler.focus();
      }
    });
  }

  // -- Newsletter modal toggle (design.md §NewsletterToggler) ------
  const newsletterBtn = document.querySelector('[data-newsletter-toggler]');
  const newsletterModal = document.querySelector('.c-newsletter-modal');
  if (newsletterBtn && newsletterModal) {
    newsletterBtn.addEventListener('click', () => {
      const open = newsletterModal.classList.toggle('is-opened');
      newsletterBtn.setAttribute('aria-expanded', String(open));
      if (open) {
        const input = newsletterModal.querySelector('input');
        if (input) input.focus();
      }
    });
    const closeBtn = newsletterModal.querySelector('.c-newsletter-modal_close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        newsletterModal.classList.remove('is-opened');
        newsletterBtn.setAttribute('aria-expanded', 'false');
      });
    }
    const form = newsletterModal.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = newsletterModal.querySelector('.c-newsletter-modal_feedback');
        if (feedback) {
          feedback.textContent = 'Check your email to confirm. Thanks.';
        }
      });
    }
  }

  // -- Copy-to-clipboard (design.md §CopyToClipboard) --------------
  document.querySelectorAll('[data-copy-to-clipboard]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.textContent.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9@.+-]+$/g, '');
      try {
        await navigator.clipboard.writeText(email);
        const original = btn.textContent;
        btn.textContent = 'Copied to clipboard!';
        setTimeout(() => { btn.textContent = original; }, 1500);
      } catch (err) {
        console.warn('Clipboard write failed', err);
      }
    });
  });

  // -- Hero video: IntersectionObserver play/pause (design.md §VideoInview)
  // We do not have a real video element in the showcase; placeholder div.
  // This block is the documented contract; it remains a no-op on this page.
  const heroVideo = document.querySelector('.c-home-hero_video');
  if (heroVideo && heroVideo.tagName === 'VIDEO') {
    const videoIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            heroVideo.play().catch(() => {});
          } else {
            heroVideo.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    videoIO.observe(heroVideo);
  }

  // -- Team canvas: placeholder rotating glyph (design.md §TeamCanvas)
  // The real module loads a random GLB and rotates it on OrbitControls.
  // Here we render a procedurally rotating emoji-grid to convey the
  // "3D team showcase" affordance without external assets.
  const teamCanvas = document.querySelector('[data-module-team-canvas]');
  if (teamCanvas && teamCanvas.tagName === 'CANVAS') {
    const ctx = teamCanvas.getContext('2d');
    const characters = ['🦊', '🐺', '🦁', '🐯', '🦝', '🐱', '🦄', '🐲',
                       '🦉', '🦅', '🐢', '🦖', '🐙', '🦈', '🐳', '🦓',
                       '🦒', '🐘', '🦏', '🦛', '🐂', '🐎', '🐖', '🐑',
                       '🐕', '🐈', '🐇', '🦘'];
    let rotation = 0;
    let selectedChar = characters[Math.floor(Math.random() * characters.length)];

    const drawTeamScene = (ts) => {
      const w = teamCanvas.width = teamCanvas.offsetWidth;
      const h = teamCanvas.height = teamCanvas.offsetHeight;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.32;
      rotation += 0.005;

      // Ring of 8 orbiting smaller glyphs
      for (let i = 0; i < 8; i++) {
        const angle = rotation + (i / 8) * Math.PI * 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle * 0.5) * radius * 0.4;
        ctx.font = `${Math.min(w, h) * 0.07}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `hsla(${(i * 45 + rotation * 30) % 360}, 60%, 70%, 0.7)`;
        ctx.fillText(characters[i * 3 % characters.length], x, y);
      }

      // Central selected character
      ctx.font = `${Math.min(w, h) * 0.22}px serif`;
      ctx.fillStyle = '#fff';
      ctx.fillText(selectedChar, cx, cy);
    };

    const teamLoop = (ts) => {
      drawTeamScene(ts);
      requestAnimationFrame(teamLoop);
    };

    // Tap to swap character (design.md §Character click swap)
    teamCanvas.addEventListener('click', () => {
      selectedChar = characters[Math.floor(Math.random() * characters.length)];
    });

    requestAnimationFrame(teamLoop);
  }

  // -- Main RAF loop (drives header scroll, hero progress, ring) ---
  const tick = (ts) => {
    updateHeaderOnScroll();
    updateProgress();
    tickRing(ts);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // -- Cookie banner stub (design.md §Cookie banner) ---------------
  // Real site uses CookieConsent v3. We surface the consent affordance
  // through the footer button without rendering the modal body.
  const cookieBtn = document.querySelector('[data-cookie-prefs]');
  if (cookieBtn) {
    cookieBtn.addEventListener('click', () => {
      cookieBtn.textContent = 'Preferences saved';
      setTimeout(() => { cookieBtn.textContent = 'Cookie preferences'; }, 1500);
    });
  }

  // -- Console banner ----------------------------------------------
  console.info(
    '%cLocomotive showcase',
    'font-family: serif; font-size: 20px; color: #312DFB;',
    '\nDesign.md-driven vanilla JS reproduction. No GSAP/Lenis/Three.js.'
  );
})();

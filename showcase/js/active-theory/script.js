/* =========================================================
   Active Theory &mdash; design sample
   JS focuses on the two design.md signals that have to be
   felt on first paint:
     1. mouse-tracking gradient (--x / --y CSS vars)
     2. project card hover: shine + 3D tilt
   Plus a few small polish behaviours referenced in the spec.
   ========================================================= */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const finePointer = window.matchMedia("(hover: hover)").matches;

  /* -----------------------------------------------------
     1. Mouse-tracking gradient on the hero
        The halo + aura read --x / --y from :root, so we
        just smooth the pointer position and write the vars
        back. requestAnimationFrame keeps it at 60 Hz.
     ----------------------------------------------------- */
  const initPointerGradient = () => {
    const root = document.documentElement;
    const hero = document.querySelector(".hero");
    if (!hero) return;

    let targetX = 0.5; // 0..1
    let targetY = 0.3;
    let currentX = 0.5;
    let currentY = 0.3;
    let rafId = 0;
    let active = false;

    const setVars = () => {
      // ease-out cubic feel, lerp factor ~0.12 per frame
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      root.style.setProperty("--x", (currentX * 100).toFixed(2) + "%");
      root.style.setProperty("--y", (currentY * 100).toFixed(2) + "%");

      if (
        Math.abs(targetX - currentX) > 0.0005 ||
        Math.abs(targetY - currentY) > 0.0005
      ) {
        rafId = requestAnimationFrame(setVars);
      } else {
        rafId = 0;
        active = false;
      }
    };

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
      // clamp
      targetX = Math.max(0, Math.min(1, targetX));
      targetY = Math.max(0, Math.min(1, targetY));
      if (!active) {
        active = true;
        rafId = requestAnimationFrame(setVars);
      }
    };

    const onLeave = () => {
      // drift back to a flattering default near the top-left third
      targetX = 0.5;
      targetY = 0.3;
      if (!active) {
        active = true;
        rafId = requestAnimationFrame(setVars);
      }
    };

    if (finePointer) {
      hero.addEventListener("mousemove", onMove, { passive: true });
      hero.addEventListener("mouseleave", onLeave);
    }

    // touch: drive from the first touch until release
    hero.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches.length) return;
        onMove(e.touches[0]);
      },
      { passive: true }
    );
    hero.addEventListener(
      "touchmove",
      (e) => {
        if (!e.touches.length) return;
        onMove(e.touches[0]);
      },
      { passive: true }
    );
    hero.addEventListener("touchend", onLeave, { passive: true });

    // kick the loop once so the default position paints smoothly
    requestAnimationFrame(setVars);
  };

  /* -----------------------------------------------------
     2. Project card hover: shine position + 3D tilt
        data-tilt-strength controls how aggressive the tilt is.
        The shine reads --mx / --my on the .card__media.
     ----------------------------------------------------- */
  const initCardTilt = () => {
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;

    cards.forEach((card) => {
      const media = card.querySelector(".card__media");
      if (!media) return;
      const strength = Number(card.dataset.tiltStrength || 10);

      const onEnter = () => {
        if (reduceMotion) return;
        card.style.transition =
          "transform 400ms cubic-bezier(.17,.4,.02,.99)";
      };

      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0..1
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - y) * strength; // invert so cursor "pushes" up
        const tiltY = (x - 0.5) * strength;

        media.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        media.style.setProperty("--my", (y * 100).toFixed(1) + "%");

        card.style.transition = "transform 80ms linear";
        card.style.transform =
          `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(0)`;
      };

      const onLeave = () => {
        card.style.transition =
          "transform 500ms cubic-bezier(.17,.4,.02,.99)";
        card.style.transform =
          "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
        media.style.setProperty("--mx", "50%");
        media.style.setProperty("--my", "50%");
      };

      if (finePointer) {
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      }

      // keyboard parity: a focused card lifts slightly
      card.addEventListener("focus", () => {
        card.style.transition =
          "transform 300ms cubic-bezier(.17,.4,.02,.99)";
        card.style.transform =
          "perspective(900px) rotateX(2deg) rotateY(-2deg) translateY(-2px)";
      });
      card.addEventListener("blur", onLeave);
    });
  };

  /* -----------------------------------------------------
     3. Hero stats: count up once on first scroll into view
        Mirrors the in-house "scroll progress" binding from
        design.md, applied to plain DOM numbers.
     ----------------------------------------------------- */
  const initCounters = () => {
    const targets = document.querySelectorAll(".hero__stats dd");
    if (!targets.length) return;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (el) => {
      const finalText = el.firstChild && el.firstChild.nodeValue;
      if (!finalText) return;
      const end = parseInt(finalText.replace(/[^0-9]/g, ""), 10);
      if (Number.isNaN(end)) return;

      // store the suffix node (the <span>)
      const suffix = el.querySelector("span");
      const duration = 1100;
      const start = performance.now();

      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const value = Math.round(end * easeOutCubic(t));
        el.firstChild.nodeValue = value.toString();
        if (t < 1) requestAnimationFrame(step);
      };

      el.firstChild.nodeValue = "0";
      requestAnimationFrame(step);
      // suffix element kept as-is
      if (!suffix) return;
    };

    if (!("IntersectionObserver" in window)) {
      targets.forEach(animate);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    targets.forEach((t) => io.observe(t));
  };

  /* -----------------------------------------------------
     4. Soft scroll-in reveal for section heads & cards
        IntersectionObserver + .is-in class, with the
        brand easing matching design.md.
     ----------------------------------------------------- */
  const initReveal = () => {
    if (reduceMotion) {
      document
        .querySelectorAll(".section__head, .card, .pillar, .contact__panel")
        .forEach((el) => el.classList.add("is-in"));
      return;
    }

    const css = document.createElement("style");
    css.textContent = `
      .section__head, .card, .pillar, .contact__panel {
        opacity: 0;
        transform: translateY(14px);
        transition:
          opacity 700ms cubic-bezier(.17,.4,.02,.99),
          transform 700ms cubic-bezier(.17,.4,.02,.99);
        will-change: transform, opacity;
      }
      .section__head.is-in,
      .card.is-in,
      .pillar.is-in,
      .contact__panel.is-in {
        opacity: 1;
        transform: translateY(0);
      }
      .card { transition-delay: 0ms; }
    `;
    document.head.appendChild(css);

    const targets = document.querySelectorAll(
      ".section__head, .card, .pillar, .contact__panel"
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // tiny stagger for the work grid
            const delay = entry.target.classList.contains("card")
              ? (i % 6) * 60
              : 0;
            entry.target.style.transitionDelay = delay + "ms";
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((t) => io.observe(t));
  };

  /* -----------------------------------------------------
     5. Top-bar: subtle backdrop intensify on scroll
        Parallels the in-house UIL "focused" backdrop
        that darkens when the user moves down the page.
     ----------------------------------------------------- */
  const initTopbar = () => {
    const bar = document.querySelector(".topbar");
    if (!bar) return;
    let last = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const t = Math.min(1, y / 80);
      if (Math.abs(t - last) < 0.01) return;
      last = t;
      bar.style.background = `rgba(22, 22, 22, ${(0.55 + 0.35 * t).toFixed(2)})`;
      bar.style.borderColor = `rgba(255, 255, 255, ${(0.10 + 0.10 * t).toFixed(2)})`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  /* -----------------------------------------------------
     Boot
     ----------------------------------------------------- */
  const ready = (fn) => {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  ready(() => {
    initPointerGradient();
    initCardTilt();
    initCounters();
    initReveal();
    initTopbar();
  });
})();

/*
 * Lusion — showcase script.js
 *
 * Simulates the WebGL-style hover effect from the live site:
 *   - Mouse-tracking radial-gradient glow that follows the pointer
 *     across the hero (in lieu of the Three.js / GLSL canvas).
 *   - Soft sphere parallax (the live site has a 3D astronaut in
 *     a geometric structure; here we translate a CSS sphere).
 *   - Hero title character-by-character reveal.
 *   - Smooth scroll for in-page anchors.
 *   - Reveal-on-scroll for large section headings.
 *   - Header pill scale-on-hover (matches the --active before-scale
 *     observed on the live header menu link).
 *
 * Respects prefers-reduced-motion (becomes a no-op for tweens).
 */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* --------------------------------------------------------------------- */
  /*  Smooth scroll                                                         */
  /* --------------------------------------------------------------------- */

  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener("click", function (e) {
        var href = this.getAttribute("href");
        if (!href || href === "#") return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  }

  /* --------------------------------------------------------------------- */
  /*  Hero glow — mouse-tracking radial gradient                             */
  /*  (simulates the WebGL canvas hover described in the design spec)       */
  /* --------------------------------------------------------------------- */

  function initHeroGlow() {
    var glow = document.getElementById("hero-glow");
    var hero = document.getElementById("hero");
    var sphere = hero ? hero.querySelector(".hero__sphere") : null;
    if (!glow || !hero) return;

    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;
    var rafId = null;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function render() {
      // smoothed position (material-style easing)
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);

      // glow follows the pointer relative to the hero
      glow.style.transform =
        "translate(calc(-50% + " +
        currentX +
        "px), calc(-50% + " +
        currentY +
        "px))";

      // sphere counter-parallax for depth
      if (sphere) {
        var dx = currentX - targetX;
        var dy = currentY - targetY;
        sphere.style.transform =
          "translate3d(" +
          dx * 0.6 +
          "px, " +
          dy * 0.6 +
          "px, 0) rotateX(" +
          dy * 0.04 +
          "deg) rotateY(" +
          dx * 0.04 +
          "deg)";
      }

      rafId = requestAnimationFrame(render);
    }

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      targetX = e.clientX - rect.left - rect.width / 2;
      targetY = e.clientY - rect.top - rect.height / 2;
      if (rafId === null && !prefersReducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    });

    hero.addEventListener("mouseleave", function () {
      targetX = 0;
      targetY = 0;
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Hero title — character-by-character reveal                            */
  /* --------------------------------------------------------------------- */

  function initHeroReveal() {
    var hero = document.getElementById("hero");
    if (!hero) return;

    if (prefersReducedMotion) {
      hero.classList.add("is-revealed");
      return;
    }

    var chars = hero.querySelectorAll(".hero__title .char");
    chars.forEach(function (el, idx) {
      el.style.transitionDelay = Math.min(idx * 14, 1200) + "ms";
    });

    // Reveal shortly after load (matches the live site's ~300ms entry)
    window.setTimeout(function () {
      hero.classList.add("is-revealed");
    }, 220);
  }

  /* --------------------------------------------------------------------- */
  /*  Reveal-on-scroll for section headings                                 */
  /* --------------------------------------------------------------------- */

  function initSectionReveal() {
    if (prefersReducedMotion) return;
    if (!("IntersectionObserver" in window)) return;

    var targets = document.querySelectorAll(
      ".featured__title, .reel__title, .approach__title, .end-cta__title, .project-item"
    );

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    targets.forEach(function (el) {
      // start hidden
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition =
        "opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1)";
      observer.observe(el);
    });

    // observer fires when in view — add class to commit transition
    document.addEventListener("transitionrun", function (e) {
      if (e.target.classList && e.target.classList.contains("is-in")) {
        e.target.style.opacity = "";
        e.target.style.transform = "";
      }
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Header talk button — animated pill background                         */
  /*  (mirrors the --active:before scale observed on the live site)         */
  /* --------------------------------------------------------------------- */

  function initHeaderPills() {
    var pills = document.querySelectorAll(".btn-pill, .inline-cta");
    pills.forEach(function (pill) {
      pill.addEventListener("mouseenter", function () {
        pill.style.setProperty("--pill-active", "1");
      });
      pill.addEventListener("mouseleave", function () {
        pill.style.setProperty("--pill-active", "0");
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Project cards — pointer-tracked highlight                             */
  /*  (subtle gradient wash, in lieu of an image reveal)                    */
  /* --------------------------------------------------------------------- */

  function initProjectCardHover() {
    if (prefersReducedMotion) return;

    var cards = document.querySelectorAll(".project-item__image");
    cards.forEach(function (card) {
      var parent = card.closest(".project-item");
      if (!parent) return;

      parent.addEventListener("mousemove", function (e) {
        var rect = parent.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.background =
          "radial-gradient(circle at " +
          x +
          "% " +
          y +
          "%, rgba(255,255,255,0.18), transparent 45%), var(--card-gradient, " +
          getComputedStyle(card).background +
          ")";
      });

      parent.addEventListener("mouseleave", function () {
        card.style.background = "";
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /*  is-white-bg class toggle — invert header chrome as the user           */
  /*  scrolls into a white section (matches the live site's behaviour)      */
  /* --------------------------------------------------------------------- */

  function initBgToggle() {
    if (!("IntersectionObserver" in window)) return;

    var lightSections = document.querySelectorAll(
      ".featured, .reel"
    );

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            document.documentElement.classList.add("is-white-bg");
          } else {
            document.documentElement.classList.remove("is-white-bg");
          }
        });
      },
      { threshold: 0.4 }
    );

    lightSections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Boot                                                                  */
  /* --------------------------------------------------------------------- */

  function boot() {
    initSmoothScroll();
    initHeroGlow();
    initHeroReveal();
    initSectionReveal();
    initHeaderPills();
    initProjectCardHover();
    initBgToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
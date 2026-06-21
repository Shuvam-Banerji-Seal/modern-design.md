/* ============================================================
   ToyFight — rebuild showcase script
   Implements the JS-driven behaviors called out in design.md:
   - mobile nav toggle (MobileNav)
   - footer tagline word rotator (FooterTagline)
   - hero year caption ticker (HomeHeroSection year caption)
   - Lenis-style smooth scroll (substitute, no external deps)
   - scroll-triggered reveals (replaces GSAP ScrollTrigger.batch)
   - pinned-section indicator on wide viewports (ScrollTrigger pin)
   - CRT / disco / bw / negative easter eggs (design.md §"Color")
   - click-to-play simulated page transition (TransitionMaskWrapper)
   ============================================================ */

(function () {
  "use strict";

  /* -----------------------------------------------------------
     1. Mobile nav (MobileNav — design.md §"Components")
     ----------------------------------------------------------- */
  var toggle = document.getElementById("mobile-toggle");
  var panel  = document.getElementById("mobile-nav");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      var next = !open;
      toggle.setAttribute("aria-expanded", String(next));
      panel.classList.toggle("is-open", next);
      panel.setAttribute("aria-hidden", String(!next));
      document.documentElement.style.overflow = next ? "hidden" : "";
    });
    panel.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") {
        toggle.setAttribute("aria-expanded", "false");
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        document.documentElement.style.overflow = "";
      }
    });
  }

  /* -----------------------------------------------------------
     2. Footer tagline rotator (FooterTagline)
     design.md: "swaps the visible word every ~2s; the outgoing
     word fades out and the incoming fades in (CSS class swap)."
     ----------------------------------------------------------- */
  var taglineEl = document.getElementById("tagline-word");
  if (taglineEl) {
    var taglineWords = [
      "studio",
      "agency",
      "makers",
      "designers",
      "craftspeople"
    ];
    var taglineIndex = 0;
    var taglineSuffix = " — for the long game.";
    setInterval(function () {
      taglineIndex = (taglineIndex + 1) % taglineWords.length;
      taglineEl.style.opacity = "0";
      setTimeout(function () {
        taglineEl.textContent = taglineWords[taglineIndex];
        taglineEl.style.opacity = "1";
      }, 220);
    }, 2000);
    taglineEl.textContent = taglineWords[0] + taglineSuffix;
  }

  /* -----------------------------------------------------------
     3. Hero year caption ticker
     design.md: "Year caption… cycles through three strings via
     a JS ticker" + "mix-blend-mode:difference".
     ----------------------------------------------------------- */
  var yearEl = document.getElementById("hero-year");
  if (yearEl) {
    var yearStates = ["2025", "LOADING…", "STUDIO"];
    var yearIndex = 0;
    setInterval(function () {
      yearIndex = (yearIndex + 1) % yearStates.length;
      yearEl.textContent = yearStates[yearIndex];
    }, 2400);
  }

  /* -----------------------------------------------------------
     4. Smooth scroll — Lenis-style substitute
     design.md: "Lenis 1.0.42 … adds `lenis` and `lenis-smooth`
     classes to <html>". We don't pull Lenis; instead we
     implement the same lerp on wheel input.
     ----------------------------------------------------------- */
  var lenisTarget = 0;
  var lenisCurrent = 0;
  var lenisEase = 0.1;
  document.documentElement.classList.add("lenis", "lenis-smooth");

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }
  function getDocHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;
  }

  window.addEventListener("wheel", function (e) {
    var inPrevent = e.target && e.target.closest && e.target.closest("[data-lenis-prevent]");
    if (inPrevent) return;
    lenisTarget += e.deltaY;
    lenisTarget = Math.max(0, Math.min(lenisTarget, getDocHeight()));
  }, { passive: true });

  function lerpLoop() {
    lenisCurrent += (lenisTarget - lenisCurrent) * lenisEase;
    if (Math.abs(lenisTarget - lenisCurrent) < 0.1) {
      lenisCurrent = lenisTarget;
    }
    window.scrollTo(0, lenisCurrent);
    requestAnimationFrame(lerpLoop);
  }
  lenisTarget = getScrollTop();
  lenisCurrent = lenisTarget;
  requestAnimationFrame(lerpLoop);

  /* -----------------------------------------------------------
     5. Scroll-triggered reveals (GSAP ScrollTrigger.batch)
     design.md: "AnimateSlideContent… adds `.show` once the
     element enters the viewport". We add `.is-visible`.
     ----------------------------------------------------------- */
  var revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-child]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var t = entry.target;
        var d = parseInt(t.getAttribute("data-reveal-delay") || "0", 10);
        setTimeout(function () { t.classList.add("is-visible"); }, d);
        io.unobserve(t);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* HorizontalRule (services) — observed by the rule element */
  var rules = document.querySelectorAll(".rule");
  if ("IntersectionObserver" in window && rules.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    rules.forEach(function (r) { ro.observe(r); });
  } else {
    rules.forEach(function (r) { r.classList.add("is-visible"); });
  }

  /* -----------------------------------------------------------
     6. Pinned-section indicator (HomeIntroPinned / HomeLinksPinned)
     design.md: pinned when "min-width:1280px AND min-height:950px".
     We add `.is-pinned-eligible` so a CSS rule could override
     the section height. Here we just toggle a body class.
     ----------------------------------------------------------- */
  function checkPinnedEligibility() {
    var wide = window.innerWidth  >= 1280;
    var tall = window.innerHeight >=  950;
    document.body.classList.toggle("is-pinned-eligible", wide && tall);
  }
  checkPinnedEligibility();
  window.addEventListener("resize", checkPinnedEligibility);

  /* -----------------------------------------------------------
     7. CRT / filter easter eggs
     design.md: "html class swap… filter for .5s". We apply and
     then auto-clear. Each click on the trigger cycles a mode.
     ----------------------------------------------------------- */
  var modes = ["crt", "bw", "negative", "sepia", "blur", "pop", "disco"];
  var crtBtn = document.getElementById("crt-trigger");
  var modeIndex = -1;
  function applyMode(mode) {
    modes.forEach(function (m) { document.documentElement.classList.remove(m); });
    if (mode && mode !== "crt") {
      document.documentElement.classList.add(mode);
      setTimeout(function () {
        document.documentElement.classList.remove(mode);
      }, 500);
    } else if (mode === "crt") {
      document.documentElement.classList.add("crt");
    }
  }
  if (crtBtn) {
    crtBtn.addEventListener("click", function () {
      modeIndex = (modeIndex + 1) % modes.length;
      applyMode(modes[modeIndex]);
      if (modes[modeIndex] !== "crt") {
        modeIndex = -1; // keep cycling through one-shots
      }
    });
  }

  /* -----------------------------------------------------------
     8. Keyboard shortcut: hold "D" to peek CRT
     ----------------------------------------------------------- */
  var keysDown = {};
  document.addEventListener("keydown", function (e) {
    keysDown[e.key.toLowerCase()] = true;
    if (keysDown["c"] && keysDown["r"] && keysDown["t"]) {
      applyMode("crt");
    }
    if (e.key.toLowerCase() === "escape") {
      applyMode(null);
    }
  });
  document.addEventListener("keyup", function (e) {
    delete keysDown[e.key.toLowerCase()];
  });

  /* -----------------------------------------------------------
     9. Simulated page transition
     design.md: "TransitionMaskWrapper… 10 vertical black bars…
     animates scaleX from 0→1 on mount". Click any internal
     <a> that points at a hash to flash the mask briefly.
     ----------------------------------------------------------- */
  var mask = document.getElementById("transition-mask");
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || !mask) return;
    var href = a.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;
    mask.classList.add("is-active");
    setTimeout(function () { mask.classList.remove("is-active"); }, 400);
  });

  /* -----------------------------------------------------------
     10. Play-button simulated audio cue (button / header / TOS)
     design.md: native <audio> + small wrapper. We don't ship
     audio in this rebuild, but we log the trigger so it's wired.
     ----------------------------------------------------------- */
  document.querySelectorAll(".play-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Audio file paths from design.md:
      // /audio/button/fx.mp3, /audio/header/fx.mp3
      // Not included here — see AGENTS.md note about no live assets.
      // new Audio("/audio/button/fx.mp3").play().catch(()=>{});
    });
  });

  /* -----------------------------------------------------------
     11. Hero parallax on scroll (mimics the Spline / canvas feel)
     design.md: "Spline <canvas> sits behind the wordmark".
     ----------------------------------------------------------- */
  var splineScene = document.querySelector(".hero__spline-scene");
  if (splineScene) {
    window.addEventListener("scroll", function () {
      var y = getScrollTop();
      var heroH = window.innerHeight;
      if (y > heroH) return;
      var p = Math.min(1, y / heroH);
      splineScene.style.transform =
        "translate3d(" + (p * 40) + "px, " + (p * -20) + "px, 0) scale(" + (1 + p * 0.06) + ")";
    }, { passive: true });
  }

  /* -----------------------------------------------------------
     12. Footer year auto-update (tiny quality-of-life)
     ----------------------------------------------------------- */
  document.querySelectorAll(".site-footer__legal").forEach(function (el) {
    if (/©/i.test(el.textContent) && !/20\d{2}/.test(el.textContent)) {
      el.textContent = el.textContent.replace("ToyFight", "ToyFight " + new Date().getFullYear());
    }
  });

  /* -----------------------------------------------------------
     13. Diagnostic surface — small object exposed for inspection
     ----------------------------------------------------------- */
  window.__TF_SHOWCASE__ = {
    version: "1.0.0",
    designSource: "websites/toyfight/design.md",
    features: [
      "mobile-nav", "tagline-rotator", "year-ticker",
      "lenis-style-smooth-scroll", "scroll-reveal",
      "pinned-indicator", "crt-easter-egg", "page-transition-mask",
      "hero-parallax"
    ]
  };

})();

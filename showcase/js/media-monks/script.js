/* =================================================================
   Monks (media.monks.com) — sample rebuild
   Implements the JS behaviors named in design.md:
   - a1-outline (per-word text reveal via IntersectionObserver)
   - monk-logo (hero "M" path animation)
   - n1-navigation (show/hide on scroll direction + dark-section inversion)
   - cl-m2-input-field (floating label state)
   - m19-tag (filter chip toggle)
   - m23-progress-button (ring progress simulation)
   - o22-monk-quote-video (circular video mask, click to scale)
   - c20-deep-dive (long-form case study overlay on work tile click)
   ================================================================= */
(function () {
  "use strict";

  const EASE = "cubic-bezier(0.2, 0, 0, 1)";

  /* ------------------------------------------------------------
     a1-outline: per-word text reveal
     Splits [data-split] / [data-allow-outlines] into <span.a1-word>
     and animates them into view with IntersectionObserver.
     ------------------------------------------------------------ */
  function splitWords(root) {
    if (root.dataset.a1Ready === "1") return;
    const fullText = root.textContent.trim();
    if (!fullText) return;
    const frag = document.createDocumentFragment();
    fullText.split(/(\s+)/).forEach(function (chunk) {
      if (/^\s+$/.test(chunk)) {
        frag.appendChild(document.createTextNode(chunk));
        return;
      }
      const span = document.createElement("span");
      span.className = "a1-word is-hidden";
      span.textContent = chunk;
      frag.appendChild(span);
    });
    root.textContent = "";
    root.appendChild(frag);
    root.dataset.a1Ready = "1";
  }

  function initOutlineReveal() {
    const targets = document.querySelectorAll(
      "[data-split], [data-allow-outlines='true']"
    );
    targets.forEach(splitWords);

    if (!("IntersectionObserver" in window)) {
      // Fallback: reveal everything
      document.querySelectorAll(".a1-word.is-hidden").forEach(function (w) {
        w.classList.remove("is-hidden");
      });
      return;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const words = entry.target.querySelectorAll(".a1-word");
          if (entry.isIntersecting) {
            words.forEach(function (w, i) {
              // Stagger 0..30ms per word
              setTimeout(function () {
                w.classList.remove("is-hidden");
              }, i * 20);
            });
          } else {
            // Optional: hide again on exit. Commented out by default for
            // friendlier re-scrolling behavior. Uncomment to match the
            // strict a1-outline spec.
            // words.forEach(function (w) { w.classList.add("is-hidden"); });
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ------------------------------------------------------------
     Hero "M" mark — curved path animation on first paint
     ------------------------------------------------------------ */
  function initHeroM() {
    const m = document.querySelector("[data-component='monk-logo']");
    if (!m) return;

    // Trigger the path-in animation on next frame
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        m.classList.add("is-arrived");
        // After the path lands, swap to filled variant
        setTimeout(function () {
          m.classList.add("is-filled");
        }, 700);
      });
    });
  }

  /* ------------------------------------------------------------
     n1-navigation: show on scroll-up, hide on scroll-down
     Plus color inversion when over a dark section.
     ------------------------------------------------------------ */
  function initNav() {
    const nav = document.querySelector("[data-component='n1-navigation']");
    if (!nav) return;

    let lastY = window.scrollY;
    let threshold = 120;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y < 8) {
        nav.classList.remove("is-visible");
      } else if (delta > 6 && y > threshold) {
        // Scrolling down past threshold -> hide
        nav.classList.remove("is-visible");
      } else if (delta < -6) {
        // Scrolling up -> reveal
        nav.classList.add("is-visible");
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    // Color inversion over dark sections
    const darkSections = document.querySelectorAll(
      ".hero, .contact, .footer"
    );
    if ("IntersectionObserver" in window && darkSections.length) {
      const darkIO = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.target.contains(nav) || nav.contains(entry.target)) return;
            const rect = entry.target.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();
            const overlap =
              rect.top < navRect.bottom && rect.bottom > navRect.top;
            if (overlap && entry.isIntersecting) {
              nav.classList.add("is-negative");
            } else if (!document.querySelector(".is-dark-active")) {
              nav.classList.remove("is-negative");
            }
          });
        },
        { threshold: [0, 0.5, 1] }
      );
      darkSections.forEach(function (s) { darkIO.observe(s); });
    }
  }

  /* ------------------------------------------------------------
     cl-m2-input-field: floating-label has-value toggle
     ------------------------------------------------------------ */
  function initInputs() {
    document
      .querySelectorAll(".cl-m2-input-field input, .cl-m2-input-field textarea, .cl-m2-input-field select")
      .forEach(function (input) {
        const field = input.closest(".cl-m2-input-field");
        if (!field) return;

        function sync() {
          if (input.value && input.value.trim().length > 0) {
            field.classList.add("has-value");
          } else {
            field.classList.remove("has-value");
          }
        }
        sync();
        input.addEventListener("input", sync);
        input.addEventListener("change", sync);
        input.addEventListener("blur", function () {
          if (!input.checkValidity()) {
            field.classList.add("has-error");
          } else {
            field.classList.remove("has-error");
          }
        });
      });
  }

  /* ------------------------------------------------------------
     m19-tag: filter chip toggle (work-tag / filter variants)
     ------------------------------------------------------------ */
  function initTags() {
    document
      .querySelectorAll("[data-component='m19-tag']")
      .forEach(function (tag) {
        tag.addEventListener("click", function (e) {
          if (e.target.closest(".m19-tag__delete")) return;
          tag.classList.toggle("is-selected");
        });
      });
  }

  /* ------------------------------------------------------------
     m23-progress-button: simulate ring progress
     Real site binds to <video> timeupdate; we simulate a 24s loop
     so the scrubber is alive without the actual video.
     ------------------------------------------------------------ */
  function initProgressButtons() {
    document
      .querySelectorAll(".m23-progress-button")
      .forEach(function (btn) {
        const circle = btn.querySelector(".progress .time");
        if (!circle) return;
        const R = 46;
        const C = 2 * Math.PI * R; // 289.03
        circle.style.strokeDasharray = String(C);
        circle.style.strokeDashoffset = String(C);

        let start = null;
        const DURATION = 24000;
        function tick(ts) {
          if (start === null) start = ts;
          const elapsed = (ts - start) % DURATION;
          const pct = elapsed / DURATION;
          circle.style.strokeDashoffset = String(C * (1 - pct));
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          btn.classList.toggle("is-playing");
        });
      });
  }

  /* ------------------------------------------------------------
     o22-monk-quote-video: click circular mask to "expand"
     Real site scales to .9 + plays full-video track.
     Here we toggle is-full-video + a transient scale animation.
     ------------------------------------------------------------ */
  function initQuoteVideo() {
    const mask = document.querySelector(".video-mask");
    if (!mask) return;
    const wrap = mask.closest("[data-component='o22-monk-quote-video']");
    if (!wrap) return;

    mask.addEventListener("click", function (e) {
      // ignore clicks on the play button
      if (e.target.closest(".m23-progress-button")) return;
      wrap.classList.toggle("is-full-video");
      mask.style.transform = wrap.classList.contains("is-full-video")
        ? "scale(0.9)"
        : "";
    });
  }

  /* ------------------------------------------------------------
     c20-deep-dive: long-form case study overlay
     Click a work tile -> fade in a full-page mask with a faux
     deep-dive panel. Esc / close-button to dismiss.
     ------------------------------------------------------------ */
  function ensureDeepDiveMarkup() {
    if (document.querySelector("[data-component='c20-deep-dive']")) return;

    const root = document.createElement("div");
    root.className = "deep-dive";
    root.setAttribute("data-component", "c20-deep-dive");
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = [
      '<div class="deep-dive__mask" role="presentation"></div>',
      '<div class="deep-dive__panel" role="dialog" aria-modal="true" aria-labelledby="dd-title">',
      '  <button class="deep-dive__close" type="button" aria-label="Close">×</button>',
      '  <div class="deep-dive__inner">',
      '    <span class="fs-label deep-dive__eyebrow">Case study</span>',
      '    <h3 id="dd-title" class="fs-display-m">Loading the deep-dive…</h3>',
      '    <p class="fs-body-l">In the live site this overlay loads a long-form case study fetched from Drupal, ',
      "    with a spinner for the first ~300ms. This rebuild mocks the open transition so the c20-deep-dive ",
      "    behavior described in design.md is observable.</p>",
      "  </div>",
      "</div>",
    ].join("");
    document.body.appendChild(root);
  }

  function initDeepDive() {
    ensureDeepDiveMarkup();
    const root = document.querySelector("[data-component='c20-deep-dive']");
    const closeBtn = root.querySelector(".deep-dive__close");
    const titleEl = root.querySelector("#dd-title");

    function open(tile) {
      const title = tile.querySelector("h3")?.textContent || "Case study";
      titleEl.textContent = title;
      root.classList.add("is-open");
      root.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
    }
    function close() {
      root.classList.remove("is-open");
      root.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
    }

    document
      .querySelectorAll(".work__link, .cases__link")
      .forEach(function (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          const tile = link.closest(".work__tile, .cases__tile");
          if (tile) open(tile);
        });
      });

    closeBtn.addEventListener("click", close);
    root.querySelector(".deep-dive__mask").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("is-open")) close();
    });
  }

  /* ------------------------------------------------------------
     Hero scroll-hint: smooth scroll to #work
     ------------------------------------------------------------ */
  function initScrollHint() {
    const hint = document.querySelector(".hero__scroll");
    if (!hint) return;
    hint.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(hint.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ------------------------------------------------------------
     Boot
     ------------------------------------------------------------ */
  function boot() {
    initOutlineReveal();
    initHeroM();
    initNav();
    initInputs();
    initTags();
    initProgressButtons();
    initQuoteVideo();
    initDeepDive();
    initScrollHint();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

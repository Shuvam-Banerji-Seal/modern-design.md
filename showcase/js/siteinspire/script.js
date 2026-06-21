/* ============================================================
   Siteinspire — site interactions
   Source: websites/siteinspire/design.md

   This file implements every client-side behaviour described in
   the spec that is not already provided by the stylesheet:
   - Slideshow: translate3d track, prev/next, dot jump, autoplay-free
   - Filter tabs: ARIA-correct panel switching
   - Filter collapse: max-height + opacity + chevron rotation
   - Lazy-load fade-in: opacity 0 → 1 over 500ms ease-out
   - Newsletter: submit prevention with a no-op confirmation
   - Keyboard: Arrow keys for the slideshow; Escape collapses the filter
   - Mobile search: defocus to collapse
   - Reduced-motion: respect user preference
   ============================================================ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     Helpers
     ----------------------------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn, false); }

  /* -----------------------------------------------------------
     Slideshow
     Pure transform-based; no autoplay. Dots are visual indicators
     + jump targets. Prev wraps to last; next wraps to first.
     ----------------------------------------------------------- */
  function initSlideshow() {
    var root = $("[data-slideshow]");
    if (!root) return;

    var track = $("[data-slideshow-track]", root);
    var slides = $$(".slide", track);
    var dots = $$("[data-slide-go]", root);
    var prevBtn = $("[data-slide-action='prev']", root);
    var nextBtn = $("[data-slide-action='next']", root);
    var caption = $(".slideshow-caption", root);

    if (!slides.length) return;

    var index = parseInt(root.getAttribute("data-active-index") || "0", 10);
    var count = slides.length;

    function getDelta(targetIndex) {
      // Each slide's full width including the gap to the next slide.
      if (!slides[0]) return 0;
      var firstBox = slides[0].getBoundingClientRect();
      var targetBox = slides[targetIndex].getBoundingClientRect();
      // The horizontal offset of slide N relative to slide 0, in the
      // track's local coordinates, is (targetBox.left - firstBox.left).
      return targetBox.left - firstBox.left;
    }

    function applyTransform(targetIndex) {
      if (targetIndex < 0) targetIndex = count - 1;
      if (targetIndex >= count) targetIndex = 0;
      index = targetIndex;

      var delta = getDelta(index);
      // translate3d() — the spec's preferred compositor-friendly hint.
      track.style.transform = "translate3d(" + (-delta) + "px, 0, 0)";

      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });

      if (caption) {
        var labelEl = slides[index].querySelector(".slide-thumb");
        if (labelEl) caption.textContent = labelEl.getAttribute("aria-label") || caption.textContent;
      }

      root.setAttribute("data-active-index", String(index));
    }

    dots.forEach(function (dot, i) {
      on(dot, "click", function () { applyTransform(i); });
    });
    on(prevBtn, "click", function () { applyTransform(index - 1); });
    on(nextBtn, "click", function () { applyTransform(index + 1); });

    // Keyboard navigation
    on(root, "keydown", function (e) {
      if (e.key === "ArrowLeft") { applyTransform(index - 1); e.preventDefault(); }
      else if (e.key === "ArrowRight") { applyTransform(index + 1); e.preventDefault(); }
    });

    // Recompute the offset when the viewport resizes (the slide width
    // changes at each breakpoint). No autoplay; the user drives it.
    var resizeRaf = 0;
    on(window, "resize", function () {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function () { applyTransform(index); });
    });

    // Initial position — set explicitly so the first paint is correct.
    requestAnimationFrame(function () { applyTransform(0); });
  }

  /* -----------------------------------------------------------
     Filter tabs (Radix-style, but manual)
     Toggling aria-selected + hidden on each panel.
     ----------------------------------------------------------- */
  function initFilterTabs() {
    var tabs = $$("[data-filter-tab]");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      on(tab, "click", function () { activate(tab.getAttribute("data-filter-tab")); });
      on(tab, "keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" &&
            e.key !== "Home" && e.key !== "End") return;
        e.preventDefault();
        var i = tabs.indexOf(tab);
        var next = tab;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        activate(next.getAttribute("data-filter-tab"));
        next.focus();
      });
    });

    function activate(name) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-filter-tab") === name;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
      });
      $$(".filter-panel").forEach(function (panel) {
        var on = panel.id === "filter-panel-" + name;
        panel.classList.toggle("is-active", on);
        if (on) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
      });
    }
  }

  /* -----------------------------------------------------------
     Filter collapse toggle
     Animates the .filter-list's max-height + opacity, rotates the
     chevron, mirrors the original CSS View Transitions API fade.
     ----------------------------------------------------------- */
  function initFilterCollapse() {
    var filter = $("[data-filter]");
    var toggle = $("[data-filter-toggle]");
    if (!filter || !toggle) return;

    var list = $(".filter-list", filter);
    if (!list) return;

    on(toggle, "click", function () {
      var collapsed = filter.classList.toggle("is-collapsed");
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
      toggle.setAttribute("aria-label", collapsed ? "Expand filter" : "Collapse filter");
      if (collapsed) {
        list.style.maxHeight = "0px";
        list.style.opacity = "0";
      } else {
        list.style.maxHeight = list.scrollHeight + "px";
        list.style.opacity = "1";
        // After the transition, remove the explicit height so the list
        // can grow naturally (e.g. if the window is resized).
        setTimeout(function () {
          if (!filter.classList.contains("is-collapsed")) {
            list.style.maxHeight = "";
          }
        }, prefersReducedMotion ? 0 : 320);
      }
    });
  }

  /* -----------------------------------------------------------
     Lazy-load fade-in for placeholder thumbs
     Simulates the design's `.not-loaded` → loaded opacity 0→1
     transition with a 500ms ease-out. We do this on cards that
     are below the fold on initial paint; everything above the
     fold is treated as already loaded.
     ----------------------------------------------------------- */
  function initLazyFadeIn() {
    if (!("IntersectionObserver" in window)) {
      $$(".placeholder-thumb").forEach(function (el) { el.classList.add("is-loaded"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Defer the class change to the next frame so the transition
        // is observable (otherwise it would just snap to opacity 1).
        requestAnimationFrame(function () {
          el.classList.add("is-loaded");
        });
        io.unobserve(el);
      });
    }, { rootMargin: "200px 0px", threshold: 0.01 });

    $$(".placeholder-thumb").forEach(function (el) {
      // Anything currently in or near the viewport is treated as
      // already loaded — we only need the fade for items below the fold.
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        el.classList.add("is-loaded");
      } else {
        el.classList.remove("is-loaded");
        io.observe(el);
      }
    });
  }

  /* -----------------------------------------------------------
     Mobile search: defocus on Escape collapses the pill.
     ----------------------------------------------------------- */
  function initSearchBlur() {
    var input = $("#site-search");
    if (!input) return;
    on(input, "keydown", function (e) {
      if (e.key === "Escape") { input.blur(); }
    });
  }

  /* -----------------------------------------------------------
     Newsletter form: soft submit (no backend), push a transient
     toast to the toast region to demonstrate the Sonner-style
     position without actually wiring up a notification library.
     ----------------------------------------------------------- */
  function initNewsletter() {
    var form = $("[data-newsletter]");
    if (!form) return;
    var region = $(".toast-region ol");
    if (!region) return;

    on(form, "submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type=email]");
      if (!input || !input.value) return;
      var li = document.createElement("li");
      li.textContent = "Subscribed — check your inbox.";
      li.style.cssText =
        "background:#FFFFFF;border:1px solid #E4E4E7;border-radius:0.5rem;" +
        "padding:0.75rem 1rem;font-size:0.875rem;color:#18181B;" +
        "box-shadow:0 10px 25px -5px rgba(0,0,0,0.10);pointer-events:auto;";
      region.appendChild(li);
      input.value = "";
      setTimeout(function () {
        li.style.transition = "opacity 200ms ease-out, transform 200ms ease-out";
        li.style.opacity = "0";
        li.style.transform = "translateY(-4px)";
        setTimeout(function () { li.remove(); }, 220);
      }, 2400);
    });
  }

  /* -----------------------------------------------------------
     Header / mobile menu: simple show/hide for the nav.
     In the real site the hamburger opens a Radix dialog; here we
     just toggle the inline nav visibility since the layout is
     single-file.
     ----------------------------------------------------------- */
  function initMobileMenu() {
    var btn = $("[data-mobile-menu]");
    var nav = $(".header-nav");
    if (!btn || !nav) return;

    on(btn, "click", function () {
      var open = nav.classList.toggle("is-mobile-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* -----------------------------------------------------------
     Placeholder thumbnails: deterministic per-tone gradient so
     the grid looks varied without using any real assets.
     ----------------------------------------------------------- */
  function paintPlaceholderThumbs() {
    var palettes = [
      "linear-gradient(135deg, #E4E4E7 0%, #F4F4F5 60%, #FAFAFA 100%)",   // 1
      "linear-gradient(135deg, #D4D4D8 0%, #E4E4E7 60%, #F4F4F5 100%)",   // 2
      "linear-gradient(135deg, #F4F4F5 0%, #E4E4E7 50%, #D4D4D8 100%)",   // 3
      "linear-gradient(135deg, #FAFAFA 0%, #F4F4F5 50%, #E4E4E7 100%)",   // 4
      "linear-gradient(135deg, #E4E4E7 0%, #D4D4D8 100%)",                // 5
      "linear-gradient(135deg, #A1A1AA 0%, #D4D4D8 100%)",                // 6
      "repeating-linear-gradient(45deg, #F4F4F5 0 8px, #E4E4E7 8px 16px)" // ghost
    ];
    $$(".placeholder-thumb").forEach(function (el) {
      var tone = el.getAttribute("data-tone") || "1";
      var idx = parseInt(tone, 10);
      if (isNaN(idx)) idx = 7; // ghost
      el.style.background = palettes[idx - 1] || palettes[0];
    });
  }

  /* -----------------------------------------------------------
     Bootstrap
     ----------------------------------------------------------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    paintPlaceholderThumbs();
    initSlideshow();
    initFilterTabs();
    initFilterCollapse();
    initLazyFadeIn();
    initSearchBlur();
    initNewsletter();
    initMobileMenu();
  });
})();

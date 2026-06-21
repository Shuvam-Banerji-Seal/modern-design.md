/* ==========================================================================
   fffuel showcase — interactions
   Rebuilds the three behaviors documented in design.md §JavaScript & Libraries:
     1. theme switch (toggle .dark-theme on <body>, persist via localStorage)
     2. live text search across the tool grid
     3. category chip filter (mutually exclusive)
   No libraries, no external deps.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 1. Theme switch ---------- */
  // Mirrors the script observed at the tail of the live Alpine bundle:
  //   - on load, restore from localStorage("theme") == "dark-theme"
  //   - on change, toggle .dark-theme and persist
  var switchEl = document.getElementById("themeSwitch");
  var stored   = null;
  try { stored = localStorage.getItem("theme"); } catch (e) { /* private mode */ }

  if (switchEl) {
    if (stored === "dark-theme") {
      document.body.classList.add("dark-theme");
      switchEl.checked = false;
    } else {
      document.body.classList.remove("dark-theme");
      switchEl.checked = true;
    }

    switchEl.addEventListener("change", function (e) {
      var isLight = e.target.checked;
      document.body.classList.toggle("dark-theme", !isLight);
      try {
        if (isLight) localStorage.removeItem("theme");
        else        localStorage.setItem("theme", "dark-theme");
      } catch (err) { /* ignore */ }
    });
  }

  /* ---------- 2 + 3. Tool index: search + category filter ---------- */
  var grid   = document.getElementById("tool-grid");
  var search = document.getElementById("tool-search");
  var chips  = document.querySelectorAll(".chip");
  var empty  = document.getElementById("empty-state");

  var activeCategory = "all";
  var activeQuery    = "";

  if (!grid) return;

  var tiles = Array.prototype.slice.call(grid.querySelectorAll(".tile"));

  function applyFilter() {
    var q = activeQuery.trim().toLowerCase();
    var visibleCount = 0;

    tiles.forEach(function (tile) {
      var name = (tile.getAttribute("data-name") || "").toLowerCase();
      var cat  = tile.getAttribute("data-category") || "";
      var text = (tile.textContent || "").toLowerCase();

      var matchCat = activeCategory === "all" || cat === activeCategory;
      var matchQ   = !q || name.indexOf(q) !== -1 || text.indexOf(q) !== -1;

      var show = matchCat && matchQ;
      var li   = tile.parentElement; // <li> wrapper
      if (li) li.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (empty) empty.hidden = visibleCount > 0;
  }

  // Search input — debounce-free (grid is small)
  if (search) {
    search.addEventListener("input", function (e) {
      activeQuery = e.target.value || "";
      applyFilter();
    });
  }

  // Category chips — single-select tablist
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var cat = chip.getAttribute("data-filter") || "all";

      chips.forEach(function (c) {
        var on = (c === chip);
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-selected", on ? "true" : "false");
      });

      activeCategory = cat;
      applyFilter();
    });
  });

  /* ---------- Keyboard niceties (the design.md does not capture focus rings,
              but a working keyboard experience is implicit in any index page) ---------- */
  if (search) {
    // "/" focuses the search, like many tool indexes
    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        search.focus();
        search.select();
      }
      if (e.key === "Escape" && document.activeElement === search) {
        search.value = "";
        activeQuery = "";
        applyFilter();
        search.blur();
      }
    });
  }

  // Initial render
  applyFilter();
})();

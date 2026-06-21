/* ========================================================================
   modern-design.md — shared landing-page JS
   Renders the site grid from /assets/manifest.json and wires up:
     - Search + category filter
     - Per-card "Details" modal showing parsed colors, fonts, components
     - Download button (raw GitHub URL with `download` attribute hint)
   No external dependencies.
   ======================================================================== */

(function () {
  "use strict";

  const grid = document.querySelector("#grid .grid") || document.querySelector(".grid");
  const chipsHost = document.getElementById("filter-chips");
  const search = document.getElementById("search");
  const count = document.getElementById("result-count");
  if (!grid) return;

  const REPO_RAW = "https://raw.githubusercontent.com/Shuvam-Banerji-Seal/modern-design.md/main";

  /** @type {Array<{slug:string,name:string,category:string,description:string,design_md:string,sample:string|null}>} */
  let entries = [];

  /** @type {Map<string, any>} */
  let detailsBySlug = new Map();

  function card(entry) {
    const hasSample = Boolean(entry.sample);
    const sampleLink = hasSample
      ? `<a class="card-link primary" href="${entry.sample}">View sample →</a>`
      : `<span class="card-link" title="Sample coming soon">Sample pending</span>`;

    return `
      <article class="card" data-slug="${entry.slug}" data-category="${entry.category}">
        <div class="card-cat">${entry.category}</div>
        <h3 class="card-title">${entry.name}</h3>
        <p class="card-desc">${entry.description || "Design specification reverse-engineered from the live site."}</p>
        <div class="card-actions">
          ${sampleLink}
          <button class="card-btn" type="button" data-action="details" data-slug="${entry.slug}">Details ⓘ</button>
          <a class="card-link" href="${entry.design_md}">design.md</a>
        </div>
      </article>
    `;
  }

  function render(filterText, filterCategory) {
    const q = (filterText || "").trim().toLowerCase();
    const filtered = entries.filter((e) => {
      if (filterCategory && filterCategory !== "All" && e.category !== filterCategory) {
        return false;
      }
      if (q) {
        const hay = (e.name + " " + e.slug + " " + e.category + " " + e.description).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="card-empty">No matches. Try a different search or category.</div>`;
    } else {
      grid.innerHTML = filtered.map(card).join("");
    }

    if (count) {
      count.textContent = `${filtered.length} of ${entries.length}`;
    }
  }

  function categories() {
    const set = new Set(entries.map((e) => e.category));
    return ["All", ...Array.from(set).sort()];
  }

  function buildChips() {
    if (!chipsHost) return;
    const cats = categories();
    chipsHost.innerHTML = cats
      .map(
        (c, i) =>
          `<button class="filter-chip" data-cat="${c}" aria-pressed="${i === 0 ? "true" : "false"}" type="button">${c}</button>`
      )
      .join("");
  }

  function wireFilter() {
    let activeCat = "All";
    let activeQuery = "";

    if (chipsHost) {
      chipsHost.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-chip");
        if (!btn) return;
        activeCat = btn.dataset.cat;
        chipsHost.querySelectorAll(".filter-chip").forEach((c) => {
          c.setAttribute("aria-pressed", c === btn ? "true" : "false");
        });
        render(activeQuery, activeCat);
      });
    }

    if (search) {
      let t;
      search.addEventListener("input", (e) => {
        clearTimeout(t);
        const v = e.target.value;
        t = setTimeout(() => {
          activeQuery = v;
          render(activeQuery, activeCat);
        }, 120);
      });
    }
  }

  /* ------------------------------------------------------------------
     Details modal
     ------------------------------------------------------------------ */

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalCat = document.getElementById("modal-cat");
  const modalBody = document.getElementById("modal-body");
  const modalDownload = document.getElementById("modal-download");
  const modalView = document.getElementById("modal-view");
  let lastFocus = null;

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pickFont(family) {
    if (!family) return "Inter, sans-serif";
    // Map self-hosted / paid families to a Google Fonts fallback for the
    // modal preview only. Real samples still load the actual family if
    // it's on Google Fonts.
    const m = family.toLowerCase();
    const table = [
      [/(a(?:eonik|rchetype|ktiv)|din|roboto|inter|manrope|space[\s-]?grotesk|geist|inter)/, "Inter"],
      [/(s(?:erif|pectra|öhne)|playfair|cormorant|domaine|fraunces|cardo|tenor|literata|garamond|noto[\s-]?serif)/, "Playfair Display"],
      [/(mono|jetbrains|fira[\s-]?code|sf[\s-]?mono|menlo|courier|inconsolata|roboto[\s-]?mono|space[\s-]?mono|geist[\s-]?mono|s(?:pe|ct)zia[\s-]?mono)/, "JetBrains Mono"],
      [/(display|sectra|fk[\s-]?raster|grotesk)/, "Playfair Display"],
      [/(spezia[\s-]?condensed)/, "Barlow Condensed"],
      [/(scto[\s-]?grotesk[\s-]?a|schibsted)/, "Inter"],
      [/(good[\s-]?pro)/, "Inter"],
      [/(nbarchitekt|s(?:öhne|ohne)|helvetica[\s-]?neue)/, "Inter"],
      [/(plain)/, "Inter"],
      [/(pally)/, "Inter"],
    ];
    for (const [re, font] of table) {
      if (re.test(m)) return `${font}, Inter, system-ui, sans-serif`;
    }
    // Strip self-hosted markers and use the family name as-is.
    // Use single quotes inside (since the inline style attr uses
    // double quotes) and escape any double quotes that may be in the name.
    const cleaned = family.replace(/['"`]/g, "").split(/,\s*/)[0];
    return `'${cleaned.replace(/'/g, "")}', Inter, system-ui, sans-serif`;
  }

  function renderSwatches(colors) {
    if (!colors || colors.length === 0) {
      return `<p class="muted">No hex colors found in design.md.</p>`;
    }
    return `<div class="swatch-grid">${colors
      .map(
        (c) => `
        <div class="swatch" title="${escapeHtml(c.hex)} — ${escapeHtml(c.role || "")}">
          <span class="swatch-chip" style="background:${c.hex}"></span>
          <span class="swatch-meta">
            <span class="hex">${escapeHtml(c.hex)}</span>
            <span class="role" title="${escapeHtml(c.role || "")}">${escapeHtml(c.role || "—")}</span>
          </span>
        </div>`
      )
      .join("")}</div>`;
  }

  function parseSize(s) {
    // Try to extract a usable preview size from a CSS size value
    // like "clamp(2.5rem, 5vw, 4rem)" or "1.5rem (24 px)" or "32px".
    if (!s) return 18;
    const pxMatch = s.match(/(\d+(?:\.\d+)?)\s*px/i);
    if (pxMatch) {
      const px = parseFloat(pxMatch[1]);
      return Math.min(40, Math.max(14, px));
    }
    const remMatch = s.match(/(\d+(?:\.\d+)?)\s*rem/i);
    if (remMatch) {
      const rem = parseFloat(remMatch[1]);
      return Math.min(40, Math.max(14, rem * 16));
    }
    // Last resort: any number, treat as px.
    const anyMatch = s.match(/(\d+(?:\.\d+)?)/);
    if (anyMatch) return Math.min(40, Math.max(14, parseFloat(anyMatch[1])));
    return 18;
  }

  function parseWeight(w) {
    if (!w) return null;
    const s = String(w).trim().toLowerCase();
    // Common named weights.
    const named = { thin: 100, hairline: 100, extralight: 200, light: 300,
      normal: 400, regular: 400, medium: 500, semibold: 600, bold: 700,
      extrabold: 800, black: 900, extrablack: 950 };
    if (named[s] != null) return named[s];
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
  }

  function renderFonts(fonts) {
    if (!fonts || fonts.length === 0) {
      return `<p class="muted">No typography table found in design.md.</p>`;
    }
    return `<div class="font-list">${fonts
      .map((f) => {
        const sampleFont = pickFont(f.family);
        const role = escapeHtml(f.role || "");
        const family = escapeHtml(f.family || "");
        const weightStr = f.weight || "";
        const sizeStr = f.size || "";
        const weight = parseWeight(weightStr);
        const sizePx = parseSize(sizeStr);
        const sample = f.role ? "Aa Bb Cc 123" : "—";
        const empty = !f.role && !f.family;
        const inlineStyle = [
          `font-family: ${sampleFont}`,
          weight ? `font-weight: ${weight}` : "",
          `font-size: ${sizePx}px`,
        ].filter(Boolean).join("; ");
        return `
          <div class="font-row">
            <span class="font-role">${role || "—"}</span>
            <span class="font-sample" style="${inlineStyle}" data-empty="${empty}">${escapeHtml(sample)}</span>
            <span class="font-meta">${family}${weightStr ? " · " + escapeHtml(weightStr) : ""}${sizeStr ? " · " + escapeHtml(sizeStr) : ""}</span>
          </div>`;
      })
      .join("")}</div>`;
  }

  function renderChips(items, klass) {
    if (!items || items.length === 0) {
      return `<p class="muted">None recorded.</p>`;
    }
    return `<ul class="chip-list">${items
      .map((n) => `<li class="${klass || ""}">${escapeHtml(n)}</li>`)
      .join("")}</ul>`;
  }

  function renderKv(stats, animations, jsLibraries) {
    const kvs = [
      ["Spec lines", stats && stats.lines ? stats.lines : "—"],
      ["Hex colors", stats && stats.hex_colors_total ? stats.hex_colors_total : "—"],
      ["@keyframes", animations && animations.keyframes_count ? animations.keyframes_count : 0],
      ["JS animation libs", animations && animations.js_libraries_referenced
        ? animations.js_libraries_referenced.join(", ") || "—"
        : "—"],
      ["Components", stats && stats.h3_subsections ? stats.h3_subsections : "—"],
    ];
    return `<div class="kv-list">${kvs
      .map(([k, v]) => `<div class="kv"><span class="k">${escapeHtml(k)}</span><span class="v">${escapeHtml(String(v))}</span></div>`)
      .join("")}</div>`;
  }

  function renderAnimations(animations) {
    if (!animations || (animations.keyframes_count === 0 && animations.js_animation_count === 0)) {
      return `<p class="muted">No animations catalogued.</p>`;
    }
    const parts = [];
    if (animations.keyframes_count > 0) {
      parts.push(
        `<li><strong>${animations.keyframes_count}</strong> @keyframes</li>` +
          (animations.keyframes_sample && animations.keyframes_sample.length
            ? ` — sample: ${animations.keyframes_sample.map(escapeHtml).join(", ")}`
            : "")
      );
    }
    if (animations.js_animation_count > 0) {
      parts.push(
        `<li><strong>${animations.js_animation_count}</strong> JS animation refs</li>` +
          (animations.js_libraries_referenced && animations.js_libraries_referenced.length
            ? ` — libs: ${animations.js_libraries_referenced.map(escapeHtml).join(", ")}`
            : "")
      );
    }
    return `<ul class="chip-list">${parts.map((p) => `<li>${p}</li>`).join("")}</ul>`;
  }

  function renderModalBody(detail) {
    return `
      <section class="modal-section">
        <h3>Colors <span class="count">${detail.colors.length} unique</span></h3>
        ${renderSwatches(detail.colors)}
      </section>
      <section class="modal-section">
        <h3>Typography <span class="count">${detail.fonts.length} roles</span></h3>
        ${renderFonts(detail.fonts)}
      </section>
      <section class="modal-section">
        <h3>Components <span class="count">${detail.components.length}</span></h3>
        ${renderChips(detail.components)}
      </section>
      <section class="modal-section">
        <h3>JavaScript libraries <span class="count">${detail.js_libraries.length}</span></h3>
        ${renderChips(detail.js_libraries.map((j) => `${j.name}${j.version ? " " + j.version : ""}`))}
      </section>
      <section class="modal-section">
        <h3>Animations</h3>
        ${renderAnimations(detail.animations)}
      </section>
      <section class="modal-section">
        <h3>At a glance</h3>
        ${renderKv(detail.stats, detail.animations, detail.js_libraries)}
      </section>
    `;
  }

  function getFocusableInModal() {
    if (!modal) return [];
    return Array.from(modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => {
      // Hidden descendants of the closed modal don't count; modal-body
      // shouldn't claim tab focus itself — we hide it from the cycle.
      if (el.classList.contains('modal-body')) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
  }

  function openModal(slug) {
    const detail = detailsBySlug.get(slug);
    const meta = entries.find((e) => e.slug === slug);
    if (!detail || !meta || !modal) return;

    modalTitle.textContent = detail.name;
    modalDesc.textContent = detail.description || meta.description || "";
    modalCat.textContent = detail.description ? meta.category : (meta.category || "");
    if (!detail.description && !modalCat.textContent) {
      modalCat.textContent = "";
    }
    modalBody.innerHTML = renderModalBody(detail);
    modalDownload.href = `${REPO_RAW}/websites/${slug}/design.md`;
    modalDownload.setAttribute("download", `${slug}-design.md`);
    modalView.href = `https://github.com/Shuvam-Banerji-Seal/modern-design.md/blob/main/websites/${slug}/design.md`;

    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    // Focus the first interactive element (close button) instead of the
    // panel so keyboard nav starts cleanly.
    const focusables = getFocusableInModal();
    if (focusables.length) focusables[0].focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function trapFocus(e) {
    if (!modal || modal.hidden) return;
    if (e.key !== "Tab") return;
    const focusables = getFocusableInModal();
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    const idx = focusables.indexOf(active);

    // Always preventDefault — we manage focus manually to avoid
    // the browser tabbing into the scrollable .modal-body div.
    e.preventDefault();
    if (e.shiftKey) {
      if (idx <= 0 || idx === -1) last.focus();
      else focusables[idx - 1].focus();
    } else {
      if (idx === -1 || idx >= focusables.length - 1) first.focus();
      else focusables[idx + 1].focus();
    }
  }

  function wireModal() {
    if (!modal) return;
    // Open via card "Details" button (event delegation).
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="details"]');
      if (btn) {
        e.preventDefault();
        openModal(btn.dataset.slug);
      }
    });

    // Close on backdrop or × button.
    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) closeModal();
    });

    // Close on Escape.
    document.addEventListener("keydown", (e) => {
      if (!modal || modal.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      // Trap Tab focus inside the modal while it's open.
      if (e.key === "Tab") trapFocus(e);
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */

  async function loadJson(path) {
    const r = await fetch(path, { cache: "no-cache" });
    if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
    return r.json();
  }

  async function init() {
    try {
      const [manifest, details] = await Promise.all([
        loadJson("assets/manifest.json"),
        loadJson("assets/design-details.json").catch(() => []),
      ]);
      entries = manifest;
      detailsBySlug = new Map(details.map((d) => [d.slug, d]));
    } catch (e) {
      grid.innerHTML =
        `<div class="card-empty">Manifest missing — the build step may not have run. Run <code>python3 tools/build_manifest.py &gt; showcase/assets/manifest.json</code> locally.</div>`;
      return;
    }

    buildChips();
    wireFilter();
    wireModal();
    render("", "All");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

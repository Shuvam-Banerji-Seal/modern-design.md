/* ------------------------------------------------------------------
   Sample interaction layer for bruno-simon.com showcase.
   No Three.js — only:
     1. A staged "loading" simulation inside the canvas placeholder
     2. Tab switching on the controls panel
     3. Smooth in-page scroll on the hero CTAs (CSS handles it too)
   ------------------------------------------------------------------ */

(() => {
  "use strict";

  /* ---------- 1. Demo loading simulation ---------- */

  const progress = document.getElementById("demoProgress");
  const status   = document.getElementById("demoStatus");
  const canvas   = document.getElementById("demoCanvas");

  if (progress && status) {
    const stages = [
      { pct:  12, text: "Booting the renderer\u2026" },
      { pct:  28, text: "Loading the vehicle\u2026" },
      { pct:  44, text: "Building the playground\u2026" },
      { pct:  62, text: "Painting the terrain\u2026" },
      { pct:  78, text: "Wiring the physics\u2026" },
      { pct:  90, text: "Spinning up audio\u2026" },
      { pct: 100, text: "Ready \u2014 drive away." },
    ];

    let i = 0;
    const tick = () => {
      if (i >= stages.length) {
        if (canvas) canvas.classList.add("is-ready");
        return;
      }
      const stage = stages[i++];
      progress.style.width = stage.pct + "%";
      status.textContent = stage.text;
      const delay = stage.pct === 100 ? 900 : 220 + Math.random() * 260;
      setTimeout(tick, delay);
    };

    setTimeout(tick, 320);
  }

  /* ---------- 2. Controls tab switcher ---------- */

  const tabs       = document.querySelectorAll(".tab");
  const bindingsEl = document.getElementById("bindingsBody");

  const bindingsByTab = {
    keyboard: [
      ["Steer",     '<span class="key">W</span><span class="key">A</span><span class="key">S</span><span class="key">D</span> or arrow keys'],
      ["Boost",     '<span class="key">Shift</span>'],
      ["Brake",     '<span class="key">Ctrl</span> or <span class="key">B</span>'],
      ["Jump",      '<span class="key">Space</span>'],
      ["Interact",  '<span class="key">Enter</span>'],
      ["Map",       '<span class="key">M</span>'],
      ["Respawn",   '<span class="key">R</span>'],
      ["Whisper",   '<span class="key">T</span>'],
      ["Mute",      '<span class="key">L</span>'],
      ["Honk",      '<span class="key">H</span>'],
    ],
    gamepad: [
      ["Steer",     "Left stick or D-pad"],
      ["Boost",     "Right trigger (RT / R2)"],
      ["Brake",     "Left trigger (LT / L2)"],
      ["Jump",      "Cross / A"],
      ["Interact",  "Square / X"],
      ["Map",       "Triangle / Y"],
      ["Respawn",   "Circle / B"],
      ["Whisper",   "Touchpad click"],
      ["Mute",      "Select / Back"],
      ["Honk",      "Right stick click"],
    ],
    touch: [
      ["Steer",     "Left virtual stick"],
      ["Boost",     "Hold the right pedal"],
      ["Brake",     "Hold the left pedal"],
      ["Jump",      "Jump button (top right)"],
      ["Interact",  "Interact button (top right)"],
      ["Map",       "Map button"],
      ["Respawn",   "Respawn button"],
      ["Whisper",   "Whisper button"],
      ["Mute",      "Audio button"],
      ["Camera",    "Right virtual stick"],
    ],
  };

  const renderBindings = (name) => {
    if (!bindingsEl || !bindingsByTab[name]) return;
    const rows = bindingsByTab[name]
      .map(([k, v]) =>
        `<tr><th scope="row">${k}</th><td>${v}</td></tr>`
      )
      .join("");
    bindingsEl.innerHTML = rows;
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      renderBindings(name);
    });
  });

  /* ---------- 3. Smooth scroll fallback for older browsers ---------- */

  if (typeof document.documentElement.style.scrollBehavior === "undefined") {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }
})();

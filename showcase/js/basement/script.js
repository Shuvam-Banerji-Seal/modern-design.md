/* =========================================================
   basement.studio — sample interactions
   Pulled from websites/basement/design.md (Animations + Motion & Interaction)
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Nav hide-on-scroll (custom, no Lenis) ---------- */
  const nav = document.getElementById("nav");
  let lastY = window.scrollY;
  let navTicking = false;

  function onScroll() {
    const y = window.scrollY;
    const dy = y - lastY;
    if (Math.abs(dy) > 4) {
      if (dy > 0 && y > 80) {
        nav.classList.add("is-hidden");
      } else {
        nav.classList.remove("is-hidden");
      }
      lastY = y;
    }
    navTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!navTicking) {
        window.requestAnimationFrame(onScroll);
        navTicking = true;
      }
    },
    { passive: true }
  );

  /* ---------- 2. Hero canvas placeholder (no real R3F / assets) ---------- */
  /* The original site runs React Three Fiber with 11 .glb models and a
     custom AudioEngine. This is a faithful visual stand-in: a low-res
     2D canvas simulating a slowly-shifting lit interior. */
  const heroCanvas = document.getElementById("heroCanvas");
  if (heroCanvas && heroCanvas.getContext) {
    const ctx = heroCanvas.getContext("2d");
    let heroRunning = true;
    let t0 = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = heroCanvas.getBoundingClientRect();
      heroCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
      heroCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    /* Synthetic "office interior": gradients that mimic the original
       three.js scene's lit geometry without using any real assets. */
    function drawFrame(now) {
      if (!heroRunning) return;
      const w = heroCanvas.clientWidth;
      const h = heroCanvas.clientHeight;
      const t = (now - t0) / 1000;

      /* base */
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      /* floor reflection band */
      const floorY = h * 0.62;
      const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
      floorGrad.addColorStop(0, "rgba(230, 230, 230, 0.04)");
      floorGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, w, h - floorY);

      /* horizon line */
      ctx.strokeStyle = "rgba(230, 230, 230, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();

      /* "room" panels */
      const panelCount = 5;
      const panelW = w / panelCount;
      for (let i = 0; i < panelCount; i++) {
        const x = i * panelW;
        const lit = 0.04 + 0.04 * Math.sin(t * 0.4 + i);
        ctx.fillStyle = `rgba(255, 255, 255, ${lit})`;
        ctx.fillRect(x + 1, floorY - 60, panelW - 2, 60);
      }

      /* godrays — a soft warm cone from upper right */
      const grX = w * 0.7;
      const grY = -h * 0.1;
      const grGrad = ctx.createRadialGradient(grX, grY, 10, grX, grY, h * 1.4);
      grGrad.addColorStop(0, "rgba(255, 140, 80, 0.10)");
      grGrad.addColorStop(0.4, "rgba(255, 77, 0, 0.04)");
      grGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grGrad;
      ctx.fillRect(0, 0, w, h);

      /* accent spotlight — pulses slowly */
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.6);
      const spot = ctx.createRadialGradient(
        w * 0.3 + Math.sin(t * 0.2) * 20,
        h * 0.35,
        5,
        w * 0.3,
        h * 0.35,
        h * 0.4
      );
      spot.addColorStop(0, `rgba(255, 255, 255, ${0.04 + pulse * 0.04})`);
      spot.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, w, h);

      /* dotted "scanline" texture overlay (matches `with-dots` motif) */
      ctx.fillStyle = "rgba(230, 230, 230, 0.06)";
      for (let y = 0; y < h; y += 6) {
        for (let x = (Math.floor(t * 30) % 6); x < w; x += 6) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      /* grain */
      const grainCount = 60;
      for (let i = 0; i < grainCount; i++) {
        const gx = Math.random() * w;
        const gy = Math.random() * h;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.04})`;
        ctx.fillRect(gx, gy, 1, 1);
      }

      requestAnimationFrame(drawFrame);
    }
    requestAnimationFrame(drawFrame);

    /* pause animation when offscreen — keep frame budget honest */
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              if (!heroRunning) {
                heroRunning = true;
                t0 = performance.now() - 0;
                requestAnimationFrame(drawFrame);
              }
            } else {
              heroRunning = false;
            }
          }
        },
        { threshold: 0 }
      );
      io.observe(heroCanvas);
    }
  }

  /* ---------- 3. Hero click → canvas overlay ---------- */
  const canvasOverlay = document.getElementById("canvasOverlay");
  const canvasClose = document.getElementById("canvasClose");
  const canvasContainer = document.querySelector(".canvas-container");

  if (canvasContainer && canvasOverlay) {
    canvasContainer.addEventListener("click", (e) => {
      if (e.target.closest(".canvas-container__close")) return;
      canvasOverlay.hidden = false;
      canvasOverlay.style.opacity = "1";
      document.documentElement.dataset.flip = "true";
      setTimeout(() => {
        document.documentElement.dataset.flip = "false";
      }, 750);
    });
  }

  if (canvasClose) {
    canvasClose.addEventListener("click", () => {
      canvasOverlay.hidden = true;
      canvasOverlay.style.opacity = "0";
      document.documentElement.dataset.flip = "true";
      setTimeout(() => {
        document.documentElement.dataset.flip = "false";
      }, 750);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && canvasOverlay && !canvasOverlay.hidden) {
      canvasOverlay.hidden = true;
      document.documentElement.dataset.flip = "false";
    }
  });

  /* ---------- 4. Audio toggle (visual state only — no real audio engine) ---------- */
  const audioToggle = document.getElementById("audioToggle");
  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      const on = audioToggle.classList.toggle("is-on");
      audioToggle.setAttribute(
        "aria-label",
        on ? "Turn music off" : "Turn music on"
      );
    });
  }

  /* ---------- 5. Mobile menu toggle ---------- */
  const menuToggle = document.getElementById("menuToggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });
  }

  /* ---------- 6. Mask transition on intra-page anchor navigation ---------- */
  const main = document.getElementById("main");
  function flip(targetEl) {
    if (!targetEl) return;
    document.documentElement.dataset.flip = "true";
    setTimeout(() => {
      document.documentElement.dataset.flip = "false";
    }, 750);
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      flip();
      /* let the mask animation begin before scrolling */
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    });
  });

  /* ---------- 7. Initialise [data-disabled] on first paint to skip mask ---------- */
  /* Per spec: `[data-disabled="true"] .layout-container { mask-image: none }` —
     we mark html on the very first render so the initial reveal isn't masked. */
  requestAnimationFrame(() => {
    document.documentElement.dataset.disabled = "true";
    setTimeout(() => {
      delete document.documentElement.dataset.disabled;
    }, 16);
  });

  /* ---------- 8. Subtle in-view fade for capability chips ---------- */
  /* The original site doesn't do this but the chips benefit from a hint of
     motion when they enter viewport. Respects prefers-reduced-motion via CSS. */
  if ("IntersectionObserver" in window) {
    const chips = document.querySelectorAll(".chip");
    const co = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            co.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2 }
    );
    chips.forEach((c) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(4px)";
      c.style.transition = "opacity 400ms ease, transform 400ms ease";
      co.observe(c);
    });
  }
})();

/* CSS Design Awards — controller module (vanilla JS, mirrors the
   five controllers in script.min.js per design.md §JavaScript & Libraries)
   No dependencies. Vanilla DOM API only. */

(function () {
  "use strict";

  /* -------------------------------------------------- *
   *  Queue wiring (mirrors ready/resize/scroll arrays) *
   * -------------------------------------------------- */
  var ready = [];
  var resize = [];
  var scroll = [];

  function runQueue(q, evt) {
    for (var i = 0; i < q.length; i++) q[i](evt);
  }

  document.addEventListener("DOMContentLoaded", function () { runQueue(ready); });
  window.addEventListener("resize", function (e) { runQueue(resize, e); });
  window.addEventListener("scroll", function (e) { runQueue(scroll, e); }, { passive: true });

  /* -------------------------------------------------- *
   *  Header: movePage + fadeSlider                     *
   * -------------------------------------------------- */
  ready.push(function movePage() {
    var header = document.querySelector(".header__main-wrapper");
    var page = document.getElementById("page");
    if (!header || !page) return;
    function setHeaderHeight() {
      var h = header.offsetHeight;
      page.style.paddingTop = h + "px";
      document.documentElement.style.setProperty("--header-h", h + "px");
    }
    setHeaderHeight();
    resize.push(setHeaderHeight);
  });

  ready.push(function fadeSlider() {
    var slides = document.querySelectorAll(".header__fade-slider__slide");
    if (slides.length < 2) return;
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
    }, 3000);
  });

  /* -------------------------------------------------- *
   *  Modal: open/close with body scroll lock           *
   * -------------------------------------------------- */
  ready.push(function modalInit() {
    var triggers = document.querySelectorAll("[data-modal-open]");
    var modals = document.querySelectorAll(".modal[data-modal]");
    var closeButtons = document.querySelectorAll(".modal__close");
    var scrollY = 0;

    function lockBody() {
      scrollY = window.scrollY;
      document.body.classList.add("no-scroll");
      document.body.style.top = "-" + scrollY + "px";
      document.body.style.width = "100%";
    }
    function unlockBody() {
      document.body.classList.remove("no-scroll");
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }

    triggers.forEach(function (trig) {
      trig.addEventListener("click", function (e) {
        e.preventDefault();
        var key = trig.getAttribute("data-modal-open");
        var m = document.querySelector('.modal[data-modal="' + key + '"]');
        if (!m) return;
        m.classList.add("active");
        m.setAttribute("aria-hidden", "false");
        lockBody();
        var input = m.querySelector("input[autofocus], input[type=search]");
        if (input) setTimeout(function () { input.focus(); }, 200);
      });
    });

    closeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var m = btn.closest(".modal");
        if (!m) return;
        m.classList.remove("active");
        m.setAttribute("aria-hidden", "true");
        /* design.md: 550ms timeout before restoring scroll position */
        setTimeout(unlockBody, 550);
      });
    });

    /* Escape key closes any open modal */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        modals.forEach(function (m) {
          if (m.classList.contains("active")) {
            m.classList.remove("active");
            m.setAttribute("aria-hidden", "true");
            setTimeout(unlockBody, 550);
          }
        });
      }
    });
  });

  /* -------------------------------------------------- *
   *  Filters: drawer accordion + category filter      *
   * -------------------------------------------------- */
  ready.push(function drawerInit() {
    var triggers = document.querySelectorAll(".filters__trigger[data-drawer-open]");
    var drawers = document.querySelectorAll(".filters__drawer[data-drawer]");
    var container = document.querySelector(".filters__drawers");

    function closeAll() {
      drawers.forEach(function (d) { d.style.display = "none"; });
      triggers.forEach(function (t) { t.classList.remove("active"); });
      if (container) container.style.height = "0px";
    }

    triggers.forEach(function (trig) {
      trig.addEventListener("click", function () {
        var key = trig.getAttribute("data-drawer-open");
        var wasActive = trig.classList.contains("active");
        closeAll();
        if (wasActive) return;
        trig.classList.add("active");
        var target = document.querySelector('.filters__drawer[data-drawer="' + key + '"]');
        if (!target || !container) return;
        target.style.display = "block";
        var h = target.offsetHeight;
        container.style.height = h + "px";
      });
    });
  });

  /* Category filter — show/hide cards by data-cat attribute on cards. */
  ready.push(function categoryFilter() {
    var triggers = document.querySelectorAll(".filters__trigger[data-drawer-open]");
    var cards = document.querySelectorAll(".single-project");

    /* Tag cards with their implied category (winners have 'active' chips). */
    cards.forEach(function (card) {
      var hasActive = card.querySelector(".sp__single-score.active");
      var hasJpanel = card.querySelector(".sp__single-score.jpanel");
      if (hasJpanel) card.dataset.cat = "winners";
      else if (hasActive) card.dataset.cat = "ui";
      else card.dataset.cat = "nominees";
    });

    triggers.forEach(function (trig) {
      trig.addEventListener("click", function () {
        var key = trig.getAttribute("data-drawer-open");
        if (key === "all") {
          cards.forEach(function (c) { c.style.display = ""; });
          return;
        }
        cards.forEach(function (c) {
          if (c.dataset.cat === key) c.style.display = "";
          else c.style.display = "none";
        });
      });
    });
  });

  /* -------------------------------------------------- *
   *  WOTD: thumbnail margin-bottom overlap             *
   *  (design.md: d.init — sets -innerHeight of score top)*
   * -------------------------------------------------- */
  ready.push(function wotdOverlap() {
    var thumb = document.querySelector(".home-wotd__thumbnail");
    var top = document.querySelector(".home-wotd__scores__top");
    if (!thumb || !top) return;
    function apply() {
      var h = top.offsetHeight;
      thumb.style.marginBottom = "-" + h + "px";
    }
    apply();
    resize.push(apply);
  });

  /* -------------------------------------------------- *
   *  Title overflow → fade-in gradient mask            *
   * -------------------------------------------------- */
  ready.push(function titleOverflow() {
    var titles = document.querySelectorAll(".home-wotd__title, .single-project__title");
    function check() {
      titles.forEach(function (t) {
        var inner = t.querySelector("span");
        if (!inner) return;
        if (inner.scrollWidth > t.clientWidth) t.classList.add("is-overflowing");
        else t.classList.remove("is-overflowing");
      });
    }
    check();
    resize.push(check);
  });

  /* -------------------------------------------------- *
   *  Vote rings: rotate .vote__circle__bar by data-count*
   * -------------------------------------------------- */
  ready.push(function voteRing() {
    var rings = document.querySelectorAll(".vote__circle[data-count], .vote__circle__bar[data-count]");
    rings.forEach(function (ring) {
      var count = parseInt(ring.getAttribute("data-count"), 10) || 0;
      var deg = Math.round(count * 3.6);
      ring.style.transform = "rotate(" + deg + "deg)";
    });

    /* click on the ring toggles 'voted' */
    document.querySelectorAll(".vote__circle__button").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var item = btn.closest(".vote__item");
        if (!item) return;
        item.classList.toggle("voted");
        var ring = item.querySelector(".vote__circle");
        if (ring) ring.style.transform = "rotate(360deg)";
      });
    });
  });

  /* -------------------------------------------------- *
   *  Go to top: smooth scroll                          *
   * -------------------------------------------------- */
  ready.push(function goToTop() {
    var btn = document.querySelector("[data-gototop]");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    /* fade in once past hero */
    var wrapper = document.querySelector(".smsc-button-wrapper");
    if (!wrapper) return;
    function onScroll() {
      if (window.scrollY > 600) wrapper.classList.add("is-visible");
      else wrapper.classList.remove("is-visible");
    }
    scroll.push(onScroll);
    onScroll();
  });

  /* -------------------------------------------------- *
   *  Subtle hover-tilt on cards (single-amp parallax)  *
   * -------------------------------------------------- */
  ready.push(function cardHover() {
    document.querySelectorAll(".single-project[data-card]").forEach(function (card) {
      var thumb = card.querySelector(".card-shot");
      if (!thumb) return;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        thumb.style.transform = "scale(1.04) translate3d(" + (dx * 6) + "px," + (dy * 6) + "px,0)";
      });
      card.addEventListener("mouseleave", function () {
        thumb.style.transform = "";
      });
    });
  });

})();

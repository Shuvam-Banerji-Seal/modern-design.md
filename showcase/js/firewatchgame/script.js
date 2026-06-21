(function () {
  'use strict';

  var KEYART_HEIGHT_DESKTOP = 1000;
  var KEYART_HEIGHT_MOBILE = 550;
  var SCRIM_THRESHOLD = 350;
  var SCRIM_FADE_WINDOW = 750;
  var PARALLAX_MIN_WIDTH = 601;
  var SPEEDS = [2, 5, 11, 16, 26, 36, 49, 69, 100];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function getKeyartHeight() {
    return window.innerWidth <= 450 ? KEYART_HEIGHT_MOBILE : KEYART_HEIGHT_DESKTOP;
  }

  function supportsParallax() {
    return window.innerWidth >= PARALLAX_MIN_WIDTH && !isIOS();
  }

  function castParallax() {
    if (!supportsParallax()) return;
    var layers = $$('#parallax .keyart_layer');
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var i, layer, speed, ty;
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      speed = parseInt(layer.getAttribute('data-speed'), 10);
      if (!isFinite(speed)) continue;
      ty = -(y * speed / 100);
      layer.style.transform = 'translate3d(0px, ' + ty + 'px, 0px)';
    }
    var scrim = $('#keyart-scrim');
    if (scrim) {
      var opacity = y > SCRIM_THRESHOLD ? (y - SCRIM_THRESHOLD) / SCRIM_FADE_WINDOW : 0;
      if (opacity > 1) opacity = 1;
      scrim.style.opacity = opacity;
    }
  }

  function dispelParallax() {
    var parallax = $('#parallax');
    var nonparallax = $('#nonparallax');
    if (parallax) parallax.style.display = 'none';
    if (nonparallax) nonparallax.style.display = 'block';
    var layers = $$('#parallax .keyart_layer');
    var i;
    for (i = 0; i < layers.length; i++) {
      layers[i].style.transform = '';
    }
  }

  function startSite() {
    var keyartHeight = getKeyartHeight();
    var parallax = $('#parallax');
    var nonparallax = $('#nonparallax');
    var scrim = $('#keyart-scrim');
    if (parallax) {
      var layers = $$('#parallax .keyart_layer');
      var i;
      for (i = 0; i < layers.length; i++) {
        layers[i].style.height = keyartHeight + 'px';
      }
    }
    if (scrim) scrim.style.height = keyartHeight + 'px';

    if (supportsParallax()) {
      if (nonparallax) nonparallax.style.display = 'none';
      if (parallax) parallax.style.display = 'block';
      castParallax();
    } else {
      dispelParallax();
    }
  }

  function fillYear() {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initLightbox() {
    var lightbox = $('#lightbox');
    var stage = lightbox ? lightbox.querySelector('.lightbox-stage') : null;
    var closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    if (!lightbox || !stage) return;

    function open(thumbLink) {
      var thumb = thumbLink.querySelector('.thumb');
      var caption = thumbLink.getAttribute('data-caption') || '';
      if (!thumb) return;
      stage.innerHTML = '';
      var clone = thumb.cloneNode(true);
      clone.removeAttribute('style');
      stage.appendChild(clone);
      var cap = document.createElement('span');
      cap.textContent = caption;
      cap.style.position = 'absolute';
      cap.style.left = '0';
      cap.style.right = '0';
      cap.style.bottom = '-32px';
      cap.style.fontSize = '12px';
      cap.style.letterSpacing = '2px';
      cap.style.textTransform = 'uppercase';
      cap.style.color = '#ccc';
      cap.style.textAlign = 'center';
      stage.appendChild(cap);
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function close() {
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      stage.innerHTML = '';
    }

    var thumbs = $$('.thumbnails li a');
    var i;
    for (i = 0; i < thumbs.length; i++) {
      thumbs[i].addEventListener('click', function (e) {
        e.preventDefault();
        open(this);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) close();
    });
  }

  function initSmoothScroll() {
    var anchors = $$('a[href^="#"]');
    var i;
    for (i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function init() {
    fillYear();
    initLightbox();
    initSmoothScroll();

    document.body.onload = startSite;
    if (document.readyState === 'complete') startSite();
    else window.addEventListener('load', startSite);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          castParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      startSite();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
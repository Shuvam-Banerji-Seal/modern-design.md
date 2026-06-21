/* ============================================================
   Aristide Benoist — sample showcase script
   Implements:
     - mouse-tracking gradient/blob (CSS variables)
     - frame-rate-independent damped lerp (R.Damp equivalent)
     - per-project palette lerp on hover (R.Damp .05)
     - scroll reveals (IntersectionObserver)
     - project card generation from the 30-item palette
     - parallax nudge of the title block
     - about overlay reveal
   ============================================================ */

(() => {
  'use strict';

  // ----- data: 30 projects, verbatim from design.md (per-project palette)
  const PROJECTS = [
    { n: '01', folder: 'house-of-gucci', title: 'House of Gucci',     txt: '#CC9933', bg: '#FFFFFF', mult: 1.00, year: '2022' },
    { n: '02', folder: 'ph',              title: 'Paul et Henriette',   txt: '#1E1E1E', bg: '#BEBEBE', mult: 1.00, year: '2021' },
    { n: '03', folder: 'canals',          title: 'Canals',              txt: '#FFF1CE', bg: '#DE4C3F', mult: 1.00, year: '2021' },
    { n: '04', folder: 'jmm',             title: 'Jacques Marie Mage',  txt: '#1E1E1E', bg: '#E7E6E3', mult: 1.00, year: '2022' },
    { n: '05', folder: 'mank',            title: 'Mank',                txt: '#D9D9D9', bg: '#0A0A0A', mult: 0.75, year: '2020' },
    { n: '06', folder: 'waka-1',          title: 'Waka Waka I',         txt: '#2A2A2A', bg: '#D5D5D5', mult: 1.00, year: '2020' },
    { n: '07', folder: 'capsulin',        title: 'Capsulin',            txt: '#F0F0F0', bg: '#080911', mult: 0.75, year: '2020' },
    { n: '08', folder: 'design-embraced', title: 'Design Embraced',     txt: '#D99299', bg: '#595E63', mult: 1.00, year: '2021' },
    { n: '09', folder: 'new-company',     title: 'New Company',         txt: '#E0C8A4', bg: '#898270', mult: 0.75, year: '2019' },
    { n: '10', folder: 'tm',              title: 'TM',                  txt: '#DA452F', bg: '#0C0C0C', mult: 0.75, year: '2019' },
    { n: '11', folder: 'waka-2',          title: 'Waka Waka II',        txt: '#F6F0E2', bg: '#85817D', mult: 1.00, year: '2019' },
    { n: '12', folder: 'stuuudio',        title: 'Stuuudio',            txt: '#BD998F', bg: '#FEF8F6', mult: 0.75, year: '2020' },
    { n: '13', folder: 'dribbble',        title: 'Dribbble',            txt: '#FEA8B1', bg: '#1D1C22', mult: 0.75, year: '2018' },
    { n: '14', folder: 'folio-v4',        title: 'Folio v4',            txt: '#070707', bg: '#F5EFDF', mult: 0.75, year: '2020' },
    { n: '15', folder: 'crsa',            title: 'CRSA',                txt: '#1C2134', bg: '#DFE9F3', mult: 1.00, year: '2019' },
    { n: '16', folder: 'marry-monday',    title: 'Marry Monday',        txt: '#55729C', bg: '#EDE8DE', mult: 1.00, year: '2019' },
    { n: '17', folder: 'rappi-pay',       title: 'Rappi Pay',           txt: '#E9786A', bg: '#222223', mult: 1.00, year: '2019' },
    { n: '18', folder: 'monfrini',        title: 'Monfrini',            txt: '#00A8A9', bg: '#DBE6E2', mult: 0.75, year: '2019' },
    { n: '19', folder: 'all-your-days',   title: 'All Your Days',       txt: '#53BB89', bg: '#D3D0C7', mult: 1.00, year: '2018' },
    { n: '20', folder: 'benjamin-guedj',  title: 'Benjamin Guedj',      txt: '#1E1F28', bg: '#B99E94', mult: 1.00, year: '2018' },
    { n: '21', folder: 'everest',         title: 'Everest',             txt: '#AE75E6', bg: '#E0E7EF', mult: 1.00, year: '2018' },
    { n: '22', folder: 'make-reign',      title: 'Make Reign',          txt: '#F04333', bg: '#454545', mult: 1.00, year: '2018' },
    { n: '23', folder: 'guillaume',       title: 'Guillaume Belveze',   txt: '#E3CBB5', bg: '#778379', mult: 1.00, year: '2018' },
    { n: '24', folder: 'epicurrence-8',   title: 'Epicurrence 8',       txt: '#321D44', bg: '#ECDCE9', mult: 1.00, year: '2017' },
    { n: '25', folder: 'folio-v1',        title: 'Folio v1',            txt: '#C7836C', bg: '#DFE0E4', mult: 0.75, year: '2017' },
    { n: '26', folder: 'ben-mingo',       title: 'Ben Mingo',           txt: '#E8E7C8', bg: '#8BA3A7', mult: 1.00, year: '2017' },
    { n: '27', folder: 'digital-asset',   title: 'Digital Asset',       txt: '#D2DCF2', bg: '#32447F', mult: 1.00, year: '2017' },
    { n: '28', folder: 'jenny',           title: 'Jenny Johannesson',   txt: '#FF71CB', bg: '#E9F1F4', mult: 1.00, year: '2017' },
    { n: '29', folder: 'bear-grylls',     title: 'Bear Grylls',         txt: '#D4C3A5', bg: '#515443', mult: 1.00, year: '2016' },
    { n: '30', folder: 'epicurrence-6',   title: 'Epicurrence 6',       txt: '#734130', bg: '#ADADAB', mult: 1.00, year: '2016' }
  ];

  // ----- math helpers (R.Damp, R.Lerp, R.Clamp from the dump)
  const lerp  = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
  // frame-rate independent damping (R.Damp from the engine)
  const damp  = (curr, targ, e, dt) => lerp(curr, targ, 1 - Math.exp(Math.log(1 - e) * dt));

  // ----- DOM refs
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const blob    = $('#bg-blob');
  const tint    = $('#bg-tint');
  const canvas  = $('#bg-canvas');
  const cards   = $('#cards');
  const hero    = $('#hero');
  const heroPgn = $('#hero-pgn');
  const loadEl  = $('#load');
  const about   = $('#about');
  const navAbout = $('#n1-0');
  const navClose = $('#n1-1');
  const wordmark = $('#n0');
  const pgnA    = heroPgn?.querySelector('.pgn-a > div');
  const pgnB    = heroPgn?.querySelector('.pgn-b > div');

  // ----- state
  const state = {
    mouse:   { x: 0, y: 0 },          // raw cursor
    curr:    { x: 0, y: 0 },          // damped position
    bg:      { r: 20,  g: 20,  b: 20  }, // current canvas colour (target = #141414)
    txtCol:  { r: 204, g: 153, b: 51  }, // current accent (target = gold, project 1)
    tintCol: { r: 255, g: 255, b: 255 }, // current tint (project bg)
    heroX:   0,                          // parallax for the title block
    lastT:   performance.now(),
    hidden:  false
  };

  const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // ----- colour helpers
  const hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16)
    };
  };
  const rgbToHex = ({ r, g, b }) =>
    '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase();

  // ----- apply colours to the canvas (background, tint, blob)
  const applyColors = (txt, bg) => {
    state.txtCol = hexToRgb(txt);
    state.tintCol = hexToRgb(bg);
  };

  applyColors(PROJECTS[0].txt, PROJECTS[0].bg);

  // ----- mouse listeners
  const onMove = (e) => {
    const pt = e.touches ? e.touches[0] : e;
    target.x = pt.clientX;
    target.y = pt.clientY;
    state.mouse.x = pt.clientX;
    state.mouse.y = pt.clientY;
  };
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });

  // ----- visibility-pause (R.Tab equivalent)
  document.addEventListener('visibilitychange', () => {
    state.hidden = document.hidden;
  });

  // ----- build the project list
  const buildCards = () => {
    const frag = document.createDocumentFragment();
    PROJECTS.forEach((p, i) => {
      const li = document.createElement('li');
      li.className = 'card reveal';
      li.style.setProperty('--project-txt', p.txt);
      li.style.setProperty('--project-bg',  p.bg);
      li.innerHTML = `
        <div class="card-top">
          <span class="card-num">${p.n} / 30</span>
          <span class="card-arrow">↗</span>
        </div>
        <h3 class="card-title">${p.title}</h3>
        <div class="card-meta">
          <span><span class="card-swatch"></span>${p.folder}</span>
          <span>${p.year}</span>
        </div>
      `;
      // hover drives the canvas palette lerp
      li.addEventListener('mouseenter', () => applyColors(p.txt, p.bg));
      frag.appendChild(li);
    });
    cards.appendChild(frag);
  };

  // ----- hero: mouse-driven parallax on the title block
  const onHeroMove = (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    state.heroX = (e.clientX - cx) / rect.width;
    const heroTarg = (e.clientY - cy) / rect.height;
    state.heroY = heroTarg;
  };
  hero.addEventListener('mousemove', onHeroMove, { passive: true });

  // ----- scroll reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  // ----- about overlay toggle
  const showAbout = () => {
    about.classList.add('is-in');
    navAbout.hidden = true;
    navClose.hidden = false;
    navAbout.classList.remove('active');
    navClose.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const hideAbout = () => {
    about.classList.remove('is-in');
    navAbout.hidden = false;
    navClose.hidden = true;
    navAbout.classList.add('active');
    navClose.classList.remove('active');
    document.body.style.overflow = '';
  };
  navAbout.addEventListener('click', (e) => { e.preventDefault(); showAbout(); });
  navClose.addEventListener('click', (e) => { e.preventDefault(); hideAbout(); });
  // ESC closes
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && about.classList.contains('is-in')) hideAbout();
  });

  // ----- per-frame RAF loop (singleton equivalent of R.Raf)
  const loop = (r) => {
    if (state.hidden) {
      state.lastT = r;
      requestAnimationFrame(loop);
      return;
    }
    const dt = Math.max(0.001, (r - state.lastT) / (1000 / 60));
    state.lastT = r;

    // damp cursor toward target — engine uses R.Damp .07
    state.curr.x = damp(state.curr.x, target.x, 0.07, dt);
    state.curr.y = damp(state.curr.y, target.y, 0.07, dt);

    // damp the canvas colour channels toward the project accent (.05 per R.Damp)
    state.txtCol.r  = damp(state.txtCol.r,  hexToRgbTarget.r,  0.05, dt);
    state.txtCol.g  = damp(state.txtCol.g,  hexToRgbTarget.g,  0.05, dt);
    state.txtCol.b  = damp(state.txtCol.b,  hexToRgbTarget.b,  0.05, dt);
    state.tintCol.r = damp(state.tintCol.r, hexToRgbTint.r,    0.05, dt);
    state.tintCol.g = damp(state.tintCol.g, hexToRgbTint.g,    0.05, dt);
    state.tintCol.b = damp(state.tintCol.b, hexToRgbTint.b,    0.05, dt);

    // blob position
    const px = state.curr.x;
    const py = state.curr.y;
    blob.style.transform = `translate3d(${px}px, ${py}px, 0)`;

    // write CSS variables
    const accent = rgbToHex(state.txtCol);
    const tinter = rgbToHex(state.tintCol);
    canvas.style.setProperty('--blob-c', accent);
    canvas.style.setProperty('--project-tint', tinter);
    document.documentElement.style.setProperty('--project-txt', accent);
    document.documentElement.style.setProperty('--project-tint', tinter);

    // subtle parallax nudge on the hero title
    if (hero) {
      const tx = state.heroX * 18;
      const titles = hero.querySelectorAll('.t');
      titles.forEach((t) => {
        t.style.transform = `translate3d(${tx}px, 0, 0)`;
      });
    }

    requestAnimationFrame(loop);
  };

  // current target colours (mutable per project)
  const hexToRgbTarget = { ...state.txtCol };
  const hexToRgbTint   = { ...state.tintCol };

  const setProjectColors = (txt, bg) => {
    const t = hexToRgb(txt);
    const b = hexToRgb(bg);
    hexToRgbTarget.r = t.r; hexToRgbTarget.g = t.g; hexToRgbTarget.b = t.b;
    hexToRgbTint.r   = b.r; hexToRgbTint.g   = b.g; hexToRgbTint.b   = b.b;
  };
  setProjectColors(PROJECTS[0].txt, PROJECTS[0].bg);

  // ----- init
  const init = () => {
    buildCards();

    // wire observers
    $$('.reveal, .card').forEach((el) => io.observe(el));
    io.observe(about);

    // paginator tick (01/30 → cycles each 4s on the hero for life)
    let pgnIdx = 0;
    setInterval(() => {
      pgnIdx = (pgnIdx + 1) % PROJECTS.length;
      if (pgnA && pgnB) {
        pgnB.textContent = String(pgnIdx).padStart(2, '0');
        pgnA.style.transform = 'translate3d(-100%, 0, 0)';
        pgnB.style.transform = 'translate3d(-100%, 0, 0)';
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        pgnA.offsetHeight;
        pgnA.textContent = String((pgnIdx + 1) % PROJECTS.length + 1).padStart(2, '0');
        pgnA.style.transform = 'translate3d(0, 0, 0)';
        pgnB.style.transform = 'translate3d(100%, 0, 0)';
      }
      const next = PROJECTS[(pgnIdx + 1) % PROJECTS.length];
      setProjectColors(next.txt, next.bg);
    }, 4000);

    // kick the loader animation
    requestAnimationFrame(() => loadEl.classList.add('is-loaded'));

    // set hero project colours to project 1
    setProjectColors(PROJECTS[0].txt, PROJECTS[0].bg);

    // start RAF
    requestAnimationFrame(loop);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

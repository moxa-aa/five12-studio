/* ==========================================================================
   Five12 — interactions (GSAP + ScrollTrigger + SplitText + DrawSVG + Lenis)
   Each block is its own module and is guarded, so one failure never takes
   the rest of the page down.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches;

  if (typeof gsap === 'undefined') {
    document.documentElement.classList.add('no-js');
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  const safe = (name, fn) => { try { fn(); } catch (err) { console.warn('[five12]', name, err); } };
  const rand = gsap.utils.random;

  /* ------------------------------------------------------------------------
     Smooth scroll
     ------------------------------------------------------------------------ */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const lockScroll = (on) => {
    if (lenis) on ? lenis.stop() : lenis.start();
    document.documentElement.classList.toggle('is-locked', on);
  };
  const scrollToTarget = (sel) => {
    const el = sel === '#top' ? 0 : $(sel);
    if (el === null) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else if (el === 0) scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]:not(.js-contact)').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    closeHam();
    scrollToTarget(a.getAttribute('href'));
  }));

  /* ------------------------------------------------------------------------
     Projects data (rendered into the grid)
     ------------------------------------------------------------------------ */
  const PROJECTS = [
    { name: 'Scoop Club', cat: 'Food & Beverage', img: 'img/p1.jpg', hover: 'img/p1-h.jpg', logo: 'SC', color: '#e8407a' },
    { name: 'Loudhouse', cat: 'Music & Audio', img: 'img/p2.jpg', hover: 'img/p2-h.jpg', logo: 'LH', color: '#141414' },
    { name: 'Petal Lab', cat: 'Beauty & Wellness', img: 'img/p3.jpg', hover: 'img/p3-h.jpg', logo: 'PL', color: '#d9486b' },
    { name: 'Kickflip Co.', cat: 'Sports & Lifestyle', img: 'img/p4.jpg', hover: 'img/p4-h.jpg', logo: 'KF', color: '#e0a21a' },
    { name: 'Glaze Theory', cat: 'Food & Bakery', img: 'img/p5.jpg', hover: 'img/p5-h.jpg', logo: 'GT', color: '#2f9e5a' },
    { name: 'Slice Society', cat: 'Food & Beverage', img: 'img/p6.jpg', hover: 'img/p6-h.jpg', logo: 'SS', color: '#ff5400' },
  ];
  const BRUSH = 'M-120 140C220 -60 520 260 820 120S240 420 -120 470S560 640 840 560S260 900 -140 1000S520 1080 860 1060';
  const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

  function renderProjects() {
    const grid = $('.projects-grid');
    grid.innerHTML = PROJECTS.map((p, i) => `
      <div class="p-item">
        <div class="p-clip">
          <a class="p-card" href="#work" aria-label="${p.name} — ${p.cat}">
            <div class="p-media">
              <img src="${p.img}" alt="" loading="lazy">
              <svg viewBox="0 0 709 1012" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs><mask id="pm${i}" maskUnits="userSpaceOnUse" x="-300" y="-300" width="1300" height="1600">
                  <path class="brush-mask" d="${BRUSH}" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </mask></defs>
                <path class="brush-fg" d="${BRUSH}" stroke="#ff5400" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                <image href="${p.hover}" x="0" y="0" width="709" height="1012" preserveAspectRatio="xMidYMid slice" mask="url(#pm${i})"/>
              </svg>
            </div>
            <div class="p-detail">
              <span class="p-logo" style="background:${p.color}">${p.logo}</span>
              <span class="p-names"><span class="project-name">${p.name}</span><span class="project-cat">${p.cat}</span></span>
              <span class="p-arrow">${ARROW}</span>
            </div>
          </a>
        </div>
      </div>`).join('');
  }

  /* ------------------------------------------------------------------------
     Service icons (original line icons)
     ------------------------------------------------------------------------ */
  const ICONS = {
    target: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#ff5400" stroke="#141414" stroke-width="3"/><circle cx="32" cy="32" r="13" fill="#fdf8f5" stroke="#141414" stroke-width="3"/><circle cx="32" cy="32" r="5" fill="#ff5400" stroke="#141414" stroke-width="3"/><path d="M32 32 54 10M46 10h8v8" fill="none" stroke="#141414" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    blocks: '<svg viewBox="0 0 64 64"><rect x="12" y="14" width="40" height="36" rx="5" fill="#ff5400" stroke="#141414" stroke-width="3" transform="rotate(-8 32 32)"/><text x="32" y="42" text-anchor="middle" font-family="Anybody" font-stretch="70%" font-weight="800" font-size="26" fill="#141414" transform="rotate(-8 32 32)">Aa</text></svg>',
    browser: '<svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="36" rx="3" fill="#ff5400" stroke="#141414" stroke-width="3"/><path d="M8 20h48" stroke="#141414" stroke-width="3"/><circle cx="14" cy="16" r="1.6" fill="#141414"/><circle cx="19" cy="16" r="1.6" fill="#141414"/><rect x="14" y="36" width="24" height="5" fill="#fdf8f5"/><path d="M40 36l12 6-5 2 4 6-3 2-4-6-4 3z" fill="#fdf8f5" stroke="#141414" stroke-width="2.4" stroke-linejoin="round"/></svg>',
    pencil: '<svg viewBox="0 0 64 64"><path d="M14 50l4-14 26-26 10 10-26 26z" fill="#ff5400" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><path d="M38 16l10 10M14 50l4-14 10 10z" fill="#fdf8f5" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><path d="M8 56q10-6 20 0t20 0" fill="none" stroke="#141414" stroke-width="3" stroke-linecap="round"/></svg>',
    clapper: '<svg viewBox="0 0 64 64"><rect x="10" y="26" width="44" height="28" rx="2" fill="#ff5400" stroke="#141414" stroke-width="3"/><path d="M10 26l42-12 3 9-42 12z" fill="#fdf8f5" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><path d="M20 22l4 8M31 19l4 8M42 16l4 8" stroke="#141414" stroke-width="3"/><path d="M28 34v12l10-6z" fill="#fdf8f5" stroke="#141414" stroke-width="2.5" stroke-linejoin="round"/></svg>',
    box: '<svg viewBox="0 0 64 64"><path d="M10 22l22-10 22 10v24L32 56 10 46z" fill="#ff5400" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><path d="M10 22l22 10 22-10M32 32v24" fill="none" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><path d="M21 17l22 10v8" fill="none" stroke="#fdf8f5" stroke-width="4"/></svg>',
    eye: '<svg viewBox="0 0 64 64"><path d="M6 32q26-28 52 0-26 28-52 0z" fill="#fdf8f5" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="32" r="11" fill="#ff5400" stroke="#141414" stroke-width="3"/><circle cx="32" cy="32" r="4" fill="#141414"/><path d="M14 14l5 6M32 8v8M50 14l-5 6" stroke="#141414" stroke-width="3" stroke-linecap="round"/></svg>',
  };

  /* ------------------------------------------------------------------------
     Loader → fires 'five12:ready'
     ------------------------------------------------------------------------ */
  let readyFired = false;
  const onReady = (fn) => (readyFired ? fn() : document.addEventListener('five12:ready', fn, { once: true }));
  function fireReady() {
    if (readyFired) return;
    readyFired = true;
    document.dispatchEvent(new CustomEvent('five12:ready'));
  }

  function loader() {
    const el = $('.loader');
    if (reduced) { el.remove(); fireReady(); return; }
    lockScroll(true);
    const orange = $('.loader-bg-orange', el);
    const pink = $('.loader-bg-pink', el);
    const ribbon = $('.loader-ribbon', el);
    const letters = $$('.loader-letters text', el);
    gsap.set([orange, pink], { drawSVG: '0% 100%', strokeWidth: 3000, strokeLinecap: 'round' });
    gsap.set(ribbon, { drawSVG: '0% 0%', strokeWidth: 0, strokeLinecap: 'round', strokeLinejoin: 'round' });
    const gap = [0, 0, 0, 0, 70, 0];  // extra space before "12"
    const widths = letters.map((t) => t.getComputedTextLength());
    const total = widths.reduce((a, b) => a + b, 0) + gap.reduce((a, b) => a + b, 0) + 12 * (letters.length - 1);
    let x = (1000 - total) / 2;
    letters.forEach((t, i) => { x += gap[i]; t.setAttribute('x', x.toFixed(1)); x += widths[i] + 12; });
    letters.forEach((t) => gsap.set(t, { scale: 0, rotation: rand(-25, 25), transformOrigin: '50% 60%' }));
    $('.loader-logo', el).style.visibility = 'visible';

    const tl = gsap.timeline({ delay: 0.25, onComplete: () => { el.remove(); lockScroll(false); } }).timeScale(1.25);
    tl.to(ribbon, { strokeWidth: 19, duration: 1, ease: 'power2.in' }, 0)
      .to(ribbon, { drawSVG: '0% 7%', duration: 0.7, ease: 'power2.in' }, 0)
      .to(ribbon, { drawSVG: '40% 47%', duration: 1.2, ease: 'none' }, 0.7)
      .to(letters, { scale: 1, rotation: 0, duration: 0.7, stagger: 0.09, ease: 'back.out(2.2)' }, 0.75)
      .to(letters, { fill: '#ff5400', duration: 0.4, stagger: 0.06 }, 1.3)
      .to(ribbon, { drawSVG: '100% 100%', duration: 0.9, ease: 'power2.inOut' }, 1.9)
      .to(ribbon, { strokeWidth: 0, duration: 0.6, ease: 'power2.in' }, 2.2)
      .to(letters, { scale: 0, rotation: () => rand(-20, 20), duration: 0.45, stagger: 0.04, ease: 'back.in(2)' }, 2.75)
      .to(pink, { drawSVG: '100% 100%', strokeWidth: 1000, duration: 1.1, ease: 'power3.inOut' }, 3.0)
      .to(orange, { drawSVG: '100% 100%', strokeWidth: 1000, duration: 1.1, ease: 'power3.inOut' }, 3.25)
      .add(fireReady, 3.55);
    setTimeout(fireReady, 9000); // never leave the page waiting
  }

  /* ------------------------------------------------------------------------
     Line split helper (SplitText lines wrapped in overflow masks)
     ------------------------------------------------------------------------ */
  function splitLines(el, lineClass, maskClass) {
    const split = new SplitText(el, { type: 'lines', linesClass: lineClass });
    split.lines.forEach((line) => {
      const mask = document.createElement('span');
      mask.className = maskClass;
      line.parentNode.insertBefore(mask, line);
      mask.appendChild(line);
    });
    return split.lines;
  }

  /* ------------------------------------------------------------------------
     Hero
     ------------------------------------------------------------------------ */
  function hero() {
    const heading = $('.hero-heading');
    const pills = $$('.hero-pill');
    const swirls = $$('.hero-swirl path');
    const lines = splitLines(heading, 'hero-line', 'hero-line-mask');
    gsap.set(heading, { opacity: 1 });
    gsap.set(lines, { y: '115%', opacity: 0 });
    gsap.set(pills, { opacity: 0, scale: 0.4, y: 20 });
    gsap.set($$('.pill-text', $('.hero')), { y: '105%', opacity: 0 });
    const widths = swirls.map((p) => parseFloat(p.getAttribute('stroke-width')) || 20);
    gsap.set(swirls, { drawSVG: '0%', strokeWidth: 0, strokeLinecap: 'round' });

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } }).timeScale(0.75);
    tl.to(lines, { y: '0%', opacity: 1, duration: 0.85, stagger: 0.12, ease: 'back.out(1.4)' }, 0);
    const linesTime = lines.length * 0.12 + 0.5;
    pills.forEach((pill, i) => {
      const at = 0.2 + (i / pills.length) * linesTime * 0.7;
      tl.to(pill, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(2.5)' }, at);
      tl.to($('.pill-text', pill), { y: '0%', opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, at + 0.15);
    });
    swirls.forEach((p, i) => {
      const at = linesTime * 0.4 + i * 0.15;
      tl.to(p, { drawSVG: '100%', duration: 0.9 }, at).to(p, { strokeWidth: widths[i], duration: 0.9 }, at);
    });
    onReady(() => tl.play());

    // the scene walks in place: legs swing, bodies bob, signs wobble
    if (!reduced) {
      $$('.walker').forEach((w, i) => {
        const legs = $$('.leg-pivot', w);
        const d = 0.42 + i * 0.04;
        gsap.fromTo(legs[0], { rotation: 16 }, { rotation: -16, duration: d, ease: 'sine.inOut', repeat: -1, yoyo: true, transformOrigin: '50% 0%' });
        gsap.fromTo(legs[1], { rotation: -16 }, { rotation: 16, duration: d, ease: 'sine.inOut', repeat: -1, yoyo: true, transformOrigin: '50% 0%' });
        gsap.to($('.walker-top', w), { y: -8, duration: d / 2, ease: 'sine.inOut', repeat: -1, yoyo: true });
        gsap.to($('.sign', w), { rotation: '+=3', duration: d, ease: 'sine.inOut', repeat: -1, yoyo: true, transformOrigin: '50% 0%' });
      });
      $$('.critter').forEach((c, i) => {
        gsap.to($('.critter-body', c), { y: -6, duration: 0.25, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.1 });
        gsap.fromTo($$('.leg', c), { rotation: 12 }, { rotation: -12, duration: 0.25, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.25, transformOrigin: '50% 0%' });
      });
    }
  }

  /* ------------------------------------------------------------------------
     Ribbon marquee (text on a curved path, drawn in on scroll)
     ------------------------------------------------------------------------ */
  function marquee() {
    const svg = $('.hero-marquee');
    const bg = $('.ribbon-bg', svg);
    const mask = $('.ribbon-mask', svg);
    const tp = $('.ribbon-tp', svg);
    const unit = $('.ribbon-unit', svg);
    gsap.set([bg, mask], { drawSVG: '100% 100%' });
    const len = unit.getComputedTextLength() || 1600;
    if (!reduced) gsap.to(tp, { attr: { startOffset: -len }, duration: len / 75, ease: 'none', repeat: -1 });
    gsap.to([bg, mask], {
      drawSVG: '0% 100%', duration: 1.3, ease: 'power2.out',
      scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
    });
  }

  /* ------------------------------------------------------------------------
     About: pinned, letters warm up to orange then settle to black
     ------------------------------------------------------------------------ */
  function about() {
    const section = $('.about');
    const para = $('.about-para', section);
    const pills = $$('.about-pill', section);
    const split = new SplitText(para, { type: 'words, chars', charsClass: 'about-char' });
    const chars = split.chars;
    gsap.set(chars, { color: 'rgba(255, 84, 0, 0.45)', transformOrigin: 'center center' });
    gsap.set(pills, { opacity: 0, scale: 0.6, y: 24 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section, start: 'top top', pin: true, scrub: true,
        end: () => '+=' + (innerWidth < 480 ? 1150 : innerHeight * 2.4),
        invalidateOnRefresh: true,
      },
    });
    const span = 85;
    chars.forEach((c, i) => {
      const at = (i / chars.length) * span;
      tl.to(c, { color: '#ff5400', scale: 1.12, rotation: () => rand(-4, 4), textShadow: '0.6px 0.6px 0 #ff5400, -0.6px -0.6px 0 #ff5400', duration: 3.5, ease: 'power1.out' }, at);
      tl.to(c, { color: '#000000', scale: 1, rotation: 0, textShadow: '0 0 0 rgba(0,0,0,0)', duration: 3.5, ease: 'power1.inOut' }, at + 3.5);
    });
    [35, 72, 96].forEach((at, i) => pills[i] && tl.to(pills[i], { opacity: 1, scale: 1, y: 0, duration: 6, ease: 'back.out(2)' }, at));
  }

  /* ------------------------------------------------------------------------
     Showcase: endless strip that follows scroll direction and speeds up
     with scroll velocity; slides shrink a touch near the centre
     ------------------------------------------------------------------------ */
  function showcase() {
    const wrap = $('.showcase');
    const track = $('.showcase-track', wrap);
    const originals = $$('.slide', track);
    const sets = 3;
    for (let s = 1; s < sets; s++) originals.forEach((sl) => {
      const c = sl.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
    const slides = $$('.slide', track);
    let setWidth = 0;
    const measure = () => { setWidth = slides[originals.length].offsetLeft - slides[0].offsetLeft; };
    measure();
    addEventListener('resize', measure);

    const BASE = 1.5;
    let x = 0, dir = -1, targetDir = -1, boost = 0, visible = false;
    ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        targetDir = self.direction === 1 ? -1 : 1;
        boost = Math.min(Math.abs(self.getVelocity() || 0) / 220, 10) * targetDir;
      },
    });
    ScrollTrigger.create({ trigger: wrap, start: 'top bottom', end: 'bottom top', onToggle: (s) => { visible = s.isActive; } });

    const setX = gsap.quickSetter(track, 'x', 'px');
    gsap.ticker.add(() => {
      if (!visible || !setWidth) return;
      dir += (targetDir - dir) * 0.06;
      boost *= 0.92;
      x += BASE * (reduced ? 0 : dir) + boost;
      while (x <= -setWidth) x += setWidth;
      while (x > 0) x -= setWidth;
      setX(x);
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const half = r.width * 0.45 || 400;
      slides.forEach((s) => {
        const b = s.getBoundingClientRect();
        if (b.right < -50 || b.left > innerWidth + 50) return;
        const n = Math.min(1, Math.abs(b.left + b.width / 2 - cx) / half);
        s.style.transform = `scale(${(0.95 + 0.05 * n).toFixed(4)})`;
      });
    });
  }

  /* ------------------------------------------------------------------------
     Magnetic double headings: the orange copy leans toward the pointer
     ------------------------------------------------------------------------ */
  function magneticHeadings() {
    if (isTouch) return;
    $$('.heading-wrap').forEach((wrapEl) => {
      const orange = $('.sec-heading.is-orange', wrapEl);
      if (!orange) return;
      const zone = wrapEl.closest('.sec-head, .faq-left') || wrapEl;
      const MAX = 4;
      zone.addEventListener('pointermove', (e) => {
        const r = wrapEl.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const maxR = Math.max(r.width, r.height) / 2 || 100;
        const k = Math.min(1, Math.hypot(dx, dy) / maxR);
        const a = Math.atan2(dy, dx);
        gsap.to(orange, { x: Math.cos(a) * k * MAX, y: Math.sin(a) * k * MAX, duration: 0.2, ease: 'power1.out', overwrite: 'auto' });
      }, { passive: true });
      zone.addEventListener('pointerleave', () => gsap.to(orange, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1.1, 0.4)', overwrite: 'auto' }));
    });
  }

  /* ------------------------------------------------------------------------
     Projects: clip-mask reveal with 3D settle, brush-stroke hover
     ------------------------------------------------------------------------ */
  function projects() {
    const cols = () => (innerWidth < 768 ? 1 : innerWidth < 992 ? 2 : 3);
    $$('.p-item').forEach((item, i) => {
      const clip = $('.p-clip', item);
      const card = $('.p-card', item);
      const col = i % cols();
      const tiltY = cols() === 1 ? 0 : col === 0 ? 15 : col === cols() - 1 ? -15 : 0;
      gsap.set(clip, { clipPath: 'inset(42.5% 42.5% 42.5% 42.5% round 36px)' });
      gsap.set(card, { scale: 1.45, rotationX: 25, rotationY: tiltY, rotation: i % 2 === 0 ? -4 : 4, transformPerspective: 800 });
      gsap.timeline({ scrollTrigger: { trigger: clip, start: 'top 85%', toggleActions: 'play none none reverse' } })
        .to(clip, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.25, ease: 'power3.out' }, 0)
        .to(card, { scale: 1, rotationX: 0, rotationY: 0, rotation: 0, duration: 1.25, ease: 'power3.out' }, 0);

      // hover: an orange brush sweeps across, the alternate image follows it
      const fg = $('.brush-fg', card);
      const mk = $('.brush-mask', card);
      const arrow = $('.p-arrow svg', card);
      gsap.set([fg, mk], { drawSVG: '100% 100%', strokeWidth: 0 });
      const hover = gsap.timeline({ paused: true, defaults: { ease: 'power1.inOut' } })
        .to(fg, { drawSVG: '0% 100%', strokeWidth: 1200, duration: 0.95 }, 0)
        .to(mk, { drawSVG: '0% 100%', strokeWidth: 1200, duration: 1.05 }, 0.35)
        .to(arrow, { rotation: -45, duration: 0.28, ease: 'power2.out' }, 0)
        .to(arrow, { rotation: 0, duration: 0.65, ease: 'elastic.out(1.15, 0.35)' }, 0.28);
      card.addEventListener('mouseenter', () => hover.timeScale(1).play());
      card.addEventListener('mouseleave', () => hover.timeScale(1.3).reverse());
    });

    // closing paragraph, pills and button
    const end = $('.projects-end');
    const lines = splitLines($('.projects-end-para', end), 'project-line', 'project-line-mask');
    const pills = $$('.pe-pill', end);
    const btn = $('.project-btn', end);
    gsap.set(lines, { y: '115%', opacity: 0 });
    gsap.set([...pills, btn], { opacity: 0, scale: 0.4, y: 20 });
    gsap.set([...pills.map((p) => $('.pill-text', p)), $('.cta-text', btn)], { opacity: 0, y: 15, display: 'inline-block' });
    const tl = gsap.timeline({ paused: true }).timeScale(0.75);
    tl.to(lines, { y: '0%', opacity: 1, duration: 0.85, stagger: 0.12, ease: 'back.out(1.4)' }, 0);
    const lt = lines.length * 0.12 + 0.5;
    pills.forEach((p, i) => {
      const at = 0.2 + (i / pills.length) * lt * 0.7;
      tl.to(p, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(2.5)' }, at)
        .to($('.pill-text', p), { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, at + 0.15);
    });
    tl.to(btn, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(2.5)' }, lt + 0.15)
      .to($('.cta-text', btn), { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, lt + 0.3);
    ScrollTrigger.create({ trigger: end, start: 'top 80%', once: true, onEnter: () => tl.play() });
  }

  /* ------------------------------------------------------------------------
     Services: a winding path through every icon, drawn by scroll; each
     icon grows open when the line reaches it and its note pops out
     ------------------------------------------------------------------------ */
  function services() {
    const body = $('.services-body');
    const svg = $('.services-path', body);
    const light = $('.sp-light', svg);
    const dark = $('.sp-dark', svg);
    const startDot = $('.sp-start', svg);
    const endDot = $('.sp-end', svg);
    const blocks = $$('.service', body);
    blocks.forEach((b) => { const ic = $('.service-icon', b); ic.innerHTML = ICONS[ic.dataset.icon] || ''; });
    let tl = null;

    function smoothPath(pts) {
      // Centripetal Catmull-Rom → cubic Béziers. The centripetal form never
      // produces cusps or self-loops, so the line always flows smoothly.
      const dist = (a, b) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-4;
      const ext = (a, b) => [2 * a[0] - b[0], 2 * a[1] - b[1]];
      let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i], p2 = pts[i + 1];
        const p0 = pts[i - 1] || ext(p1, p2);
        const p3 = pts[i + 2] || ext(p2, p1);
        const d1 = dist(p0, p1), d2 = dist(p1, p2), d3 = dist(p2, p3);
        const c1 = [0, 1].map((k) => (d1 * d1 * p2[k] - d2 * d2 * p0[k] + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1[k]) / (3 * d1 * (d1 + d2)));
        const c2 = [0, 1].map((k) => (d3 * d3 * p1[k] - d2 * d2 * p3[k] + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2[k]) / (3 * d3 * (d3 + d2)));
        d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      return d;
    }

    function build() {
      if (tl) { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); }
      const icons = blocks.map((b) => $('.service-icon', b));
      const paras = blocks.map((b) => $('.service-para', b));
      gsap.set(icons, { clearProps: 'width,scale,opacity' });
      gsap.set(paras, { clearProps: 'scale,opacity,rotation' });

      const br = body.getBoundingClientRect();
      const W = br.width, H = br.height;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const centers = icons.map((ic) => {
        const r = ic.getBoundingClientRect();
        return [r.left - br.left + r.width / 2, r.top - br.top + r.height / 2];
      });
      // route: enter at the top-right, flow through every icon and swing
      // wide between them in long, even S-curves
      const first = centers[0];
      const pts = [[W * 0.97, first[1] - H * 0.05]];
      // icons already alternate left/right, so threading them directly
      // gives one continuous, evenly curving snake
      centers.forEach((c) => pts.push(c));
      const last = centers[centers.length - 1];
      pts.push([W * 0.03, last[1] + H * 0.045]);
      const d = smoothPath(pts);
      light.setAttribute('d', d);
      dark.setAttribute('d', d);
      startDot.setAttribute('cx', pts[0][0]); startDot.setAttribute('cy', pts[0][1]);
      endDot.setAttribute('cx', pts[pts.length - 1][0]); endDot.setAttribute('cy', pts[pts.length - 1][1]);

      // where along the path each icon sits (0..1), to time its pop
      const total = dark.getTotalLength();
      const at = centers.map((c) => {
        let best = 0, bestD = Infinity;
        for (let s = 0; s <= 400; s++) {
          const p = dark.getPointAtLength((s / 400) * total);
          const dd = (p.x - c[0]) ** 2 + (p.y - c[1]) ** 2;
          if (dd < bestD) { bestD = dd; best = s / 400; }
        }
        return best;
      });

      const widths = icons.map((ic) => ic.offsetWidth);
      gsap.set(dark, { drawSVG: '0%' });
      gsap.set(icons, { width: 0, scale: 0, opacity: 0 });
      gsap.set(paras, { scale: 0, opacity: 0, transformOrigin: 'left top' });
      tl = gsap.timeline({
        scrollTrigger: { trigger: body, start: 'top 70%', end: 'bottom 70%', scrub: 1.2 },
      });
      tl.to(dark, { drawSVG: '100%', ease: 'none', duration: 1 }, 0);
      icons.forEach((ic, i) => {
        const t = Math.max(0, at[i] - 0.04);
        tl.to(ic, { width: widths[i], scale: 1, opacity: 1, duration: 0.14, ease: 'back.out(3.5)' }, t);
        tl.to(paras[i], { scale: 1, rotation: -5, opacity: 1, duration: 0.14, ease: 'back.out(3.5)' }, t + 0.02);
      });
    }
    build();
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); ScrollTrigger.refresh(); }, 250); });
  }

  /* ------------------------------------------------------------------------
     Testimonials: shuffling card stack
     ------------------------------------------------------------------------ */
  function testimonials() {
    const box = $('.t-box');
    const cards = $$('.t-card', box);
    const ticksEl = $('.t-ticks', box);
    const arrow = $('.t-arrow', box);
    const n = cards.length;
    const angles = [0, -4, 3, -2.5, 5, -6];
    const rot = cards.map((_, i) => angles[(i % (angles.length - 1)) + 1]);
    let current = 0, busy = false;

    const order = () => cards.forEach((c, i) => { c.style.zIndex = n - ((i - current + n) % n); });
    cards.forEach((c, i) => gsap.set(c, { rotation: i === current ? 0 : rot[i] }));
    order();

    const ticks = cards.map(() => { const t = document.createElement('div'); t.className = 't-tick'; ticksEl.appendChild(t); return t; });
    const updateTicks = (anim = true) => ticks.forEach((t, i) => gsap[anim ? 'to' : 'set'](t, { width: i === current ? 34 : 14, opacity: i === current ? 1 : 0.35, duration: 0.35, ease: 'power2.out' }));
    updateTicks(false);

    function next() {
      if (busy) return;
      busy = true;
      const out = cards[current];
      current = (current + 1) % n;
      gsap.to(cards[current], { rotation: 0, duration: 0.35, ease: 'power2.out' });
      gsap.to(out, {
        yPercent: -140, rotation: rot[(current - 1 + n) % n] - 8, duration: 0.38, ease: 'power2.inOut',
        onComplete: () => {
          order();
          gsap.to(out, { yPercent: 0, rotation: rot[cards.indexOf(out)], duration: 0.38, ease: 'power2.out', onComplete: () => { busy = false; } });
        },
      });
      updateTicks();
    }
    function prev() {
      if (busy) return;
      busy = true;
      const front = cards[current];
      current = (current - 1 + n) % n;
      const inc = cards[current];
      gsap.to(front, { rotation: rot[cards.indexOf(front)], duration: 0.35, ease: 'power2.out' });
      gsap.to(inc, {
        yPercent: 120, rotation: rot[current] + 8, duration: 0.38, ease: 'power2.inOut',
        onComplete: () => {
          inc.style.zIndex = n + 10;
          gsap.to(inc, { yPercent: 0, rotation: 0, duration: 0.38, ease: 'power2.out', onComplete: () => { order(); busy = false; } });
        },
      });
      updateTicks();
    }

    box.addEventListener('click', (e) => {
      const r = box.getBoundingClientRect();
      (e.clientY - r.top < r.height / 2 ? next : prev)();
    });
    let ty = 0;
    box.addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
    box.addEventListener('touchend', (e) => {
      const dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dy) > 40) (dy < 0 ? next : prev)();
    }, { passive: true });

    if (!isTouch) {
      gsap.set(arrow, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
      const ax = gsap.quickTo(arrow, 'x', { duration: 0.15, ease: 'power2.out' });
      const ay = gsap.quickTo(arrow, 'y', { duration: 0.15, ease: 'power2.out' });
      let dirRot = 0;
      const place = (e, instant) => {
        const r = box.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        if (instant) gsap.set(arrow, { x, y }); else { ax(x); ay(y); }
        const want = y < r.height / 2 ? 0 : 180;
        if (want !== dirRot) { dirRot = want; gsap.to(arrow, { rotation: want, duration: 0.25, ease: 'power2.out', overwrite: 'auto' }); }
      };
      box.addEventListener('mouseenter', (e) => { place(e, true); gsap.to(arrow, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' }); });
      box.addEventListener('mousemove', (e) => place(e, false));
      box.addEventListener('mouseleave', () => gsap.to(arrow, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' }));
    }
  }

  /* ------------------------------------------------------------------------
     FAQ accordion: speech-bubble style
     ------------------------------------------------------------------------ */
  function faq() {
    const items = $$('.faq-item');
    const openW = () => (innerWidth >= 992 ? '50%' : '75%');
    let active = null;
    const parts = (it) => ({ q: $('.faq-q', it), a: $('.faq-a', it), badge: $('.faq-badge', it), text: $('.faq-answer', it) });

    function open(it, instant) {
      const { q, a, badge, text } = parts(it);
      it.classList.add('is-open');
      q.setAttribute('aria-expanded', 'true');
      gsap.set(a, { display: 'flex', overflow: 'hidden', opacity: 1 });
      if (instant) {
        gsap.set(q, { width: openW(), borderWidth: 1 });
        gsap.set(a, { height: 'auto', scale: 1, overflow: 'visible' });
        gsap.set(badge, { scale: 1 });
        gsap.set(text, { opacity: 1, y: 0 });
        return;
      }
      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .to(q, { width: openW(), borderWidth: 1, duration: 0.45 }, 0)
        .fromTo(a, { height: 0, scale: 0 }, { height: 'auto', scale: 1, duration: 0.5, ease: 'back.out(1.6)', onComplete: () => gsap.set(a, { overflow: 'visible' }) }, 0.05)
        .fromTo(badge, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' }, 0.15)
        .fromTo(text, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 0.35);
    }
    function close(it) {
      const { q, a, badge, text } = parts(it);
      it.classList.remove('is-open');
      q.setAttribute('aria-expanded', 'false');
      gsap.set(a, { overflow: 'hidden' });
      gsap.timeline({ defaults: { ease: 'power2.inOut' } })
        .to(text, { opacity: 0, y: 15, duration: 0.22, ease: 'power2.in' }, 0)
        .to(badge, { scale: 0, duration: 0.25, ease: 'power2.in' }, 0.12)
        .to(a, { scale: 0, height: 0, opacity: 0, duration: 0.4, onComplete: () => gsap.set(a, { display: 'none' }) }, 0.15)
        .to(q, { width: '100%', borderWidth: 0, duration: 0.45, ease: 'power2.out' }, 0.18);
    }
    items.forEach((it, i) => {
      $('.faq-q', it).setAttribute('aria-expanded', 'false');
      if (i === 0) { open(it, true); active = it; }
      $('.faq-q', it).addEventListener('click', () => {
        if (active === it) { close(it); active = null; return; }
        if (active) close(active);
        open(it);
        active = it;
        setTimeout(() => ScrollTrigger.refresh(), 600);
      });
    });
    addEventListener('resize', () => { if (active) gsap.set($('.faq-q', active), { width: openW() }); });

    if (!reduced) {
      gsap.to('.zzz text', { y: -8, opacity: 0.4, duration: 1.2, stagger: 0.3, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('.faq-arrow', { y: 10, duration: 0.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }
  }

  /* ------------------------------------------------------------------------
     Wiggle letters on hover (footer + contact links)
     ------------------------------------------------------------------------ */
  function wiggleLinks(selector) {
    $$(selector).forEach((link) => {
      const text = link.textContent;
      link.setAttribute('aria-label', text);
      link.innerHTML = text.split('').map((c) => `<span class="f-char" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
      const chars = $$('.f-char', link);
      const host = link.closest('.f-social') || link;
      host.addEventListener('mouseenter', () => chars.forEach((ch, i) => {
        gsap.to(ch, {
          scale: 1.14, rotation: rand(-7, 7), textShadow: '0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor',
          duration: 0.38, delay: i * 0.035, ease: 'back.out(1.8)', overwrite: 'auto',
          onComplete: () => gsap.to(ch, { scale: 1, rotation: 0, textShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.5, ease: 'power2.out' }),
        });
      }));
      host.addEventListener('mouseleave', () => gsap.to(chars, { scale: 1, rotation: 0, textShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.35, stagger: 0.018, ease: 'power2.out', overwrite: 'auto' }));
    });
  }

  /* ------------------------------------------------------------------------
     Footer: heading lines, texture, stretchy logo that bounces into place
     ------------------------------------------------------------------------ */
  function footer() {
    const f = $('.footer');
    const lines = splitLines($('.footer-heading', f), 'footer-heading-line', 'footer-heading-mask');
    gsap.set(lines, { y: '115%', opacity: 0 });
    gsap.to(lines, { y: '0%', opacity: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.6)', scrollTrigger: { trigger: f, start: 'top 80%' } });

    // texture: one long scribble of loops
    const tex = $('.footer-texture', f);
    const drawTexture = () => {
      const W = f.offsetWidth, H = f.offsetHeight;
      tex.setAttribute('viewBox', `0 0 ${W} ${H}`);
      let d = `M${-50} ${H * 0.3}`;
      let x = -50, y = H * 0.3;
      const rnd = gsap.utils.random;
      for (let i = 0; i < 11; i++) {
        const nx = rnd(-60, W + 60), ny = rnd(-60, H + 60);
        const r = rnd(40, 110);
        d += `C${x + rnd(-200, 200)} ${y + rnd(-200, 200)} ${nx - r} ${ny + r} ${nx} ${ny}`;
        d += `a${r} ${r} 0 1 1 ${r * 0.6} ${-r * 0.4}`;
        x = nx + r * 0.6; y = ny - r * 0.4;
      }
      $('path', tex).setAttribute('d', d);
    };
    drawTexture();

    const logo = $('.footer-logo', f);
    const fitLogo = () => {
      const avail = $('.footer-btm', f).clientWidth;
      logo.style.fontSize = '100px';
      logo.style.fontSize = (100 * avail / logo.scrollWidth).toFixed(2) + 'px';
    };
    fitLogo();
    addEventListener('resize', fitLogo);
    gsap.set(logo, { scaleY: 0.15, transformOrigin: 'bottom center' });
    let bounced = false;
    const bounce = () => { bounced = true; gsap.killTweensOf(logo); gsap.to(logo, { scaleY: 1, duration: 1.4, ease: 'elastic.out(1.2, 0.35)' }); };
    ScrollTrigger.create({
      trigger: f, start: 'top bottom', end: 'bottom bottom',
      onUpdate: (self) => {
        if (bounced) return;
        const stretch = Math.min(Math.abs(self.getVelocity() || 0) / 1500, 0.25);
        const target = Math.max(0.15, Math.min(0.15 + self.progress * 0.85 + stretch, 1.4));
        if (self.progress > 0.985) { bounce(); return; }
        gsap.to(logo, { scaleY: target, duration: 0.1, ease: 'power1.out', overwrite: 'auto' });
      },
      onLeave: () => { if (!bounced) bounce(); },
      onLeaveBack: () => { bounced = false; gsap.killTweensOf(logo); gsap.to(logo, { scaleY: 0.15, duration: 0.25, ease: 'power2.out' }); },
    });
    wiggleLinks('.footer .f-link');
  }

  /* ------------------------------------------------------------------------
     Buttons: nav pill scribble fill, CTA magnetic + fill + wiggling arrow
     ------------------------------------------------------------------------ */
  function buttons() {
    $$('.nav-btn').forEach((btn) => {
      const p = $('.nav-btn-fill path', btn);
      const w = parseFloat(p.getAttribute('stroke-width')) || 36;
      gsap.set(p, { drawSVG: '0%', strokeWidth: 0, strokeLinecap: 'round' });
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power1.inOut' } }).to(p, { drawSVG: '100%', strokeWidth: w, duration: 0.5 });
      btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
      btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
    });

    $$('.cta-btn').forEach((btn) => {
      const text = $('.cta-text', btn);
      const arrow = $('.cta-arrow', btn);
      const fill = $('.cta-fill', btn);
      let loop = null;
      btn.addEventListener('mouseenter', () => {
        gsap.to(fill, { scale: 10, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
        if (loop) loop.kill();
        loop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 })
          .to(arrow, { rotation: -25, duration: 0.22, ease: 'power2.out' })
          .to(arrow, { rotation: 0, duration: 0.4, ease: 'back.out(2.5)' });
      });
      btn.addEventListener('mousemove', (e) => {
        if (isTouch) return;
        const r = btn.getBoundingClientRect();
        const cx = r.left - (gsap.getProperty(btn, 'x') || 0) + r.width / 2;
        const cy = r.top - (gsap.getProperty(btn, 'y') || 0) + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        gsap.to(btn, { x: dx * 0.35, y: dy * 0.35, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        gsap.to([text, arrow], { x: dx * 0.15, y: dy * 0.15, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      });
      btn.addEventListener('mouseleave', () => {
        if (loop) { loop.kill(); loop = null; }
        gsap.to(arrow, { rotation: 0, duration: 0.35, ease: 'power2.out' });
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1.1, 0.4)', overwrite: 'auto' });
        gsap.to([text, arrow], { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1.1, 0.4)', overwrite: 'auto' });
        gsap.to(fill, { scale: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */
  const header = $('.header');
  const markScrolled = () => header.classList.toggle('is-scrolled', (lenis ? lenis.scroll : scrollY) > 40);
  if (lenis) lenis.on('scroll', markScrolled);
  addEventListener('scroll', markScrolled, { passive: true });
  const hamBtn = $('.ham-btn');
  function closeHam() {
    if (!header.classList.contains('ham-open')) return;
    header.classList.remove('ham-open');
    hamBtn.setAttribute('aria-expanded', 'false');
    lockScroll(false);
  }
  function hamMenu() {
    hamBtn.addEventListener('click', () => {
      const open = !header.classList.contains('ham-open');
      header.classList.toggle('ham-open', open);
      hamBtn.setAttribute('aria-expanded', String(open));
      lockScroll(open);
      if (open) gsap.fromTo('.ham-menu > *', { y: 40, opacity: 0, rotation: () => rand(-6, 6) }, { y: 0, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(1.8)' });
    });
  }

  /* ------------------------------------------------------------------------
     Contact overlay
     ------------------------------------------------------------------------ */
  function contact() {
    const page = $('.contact');
    const paths = $$('.contact-transition path', page);
    const logo = $('.contact-logo', page);
    const closeBtn = $('.close-btn', page);
    const closeTxt = $('.close-text', page);
    const headings = $$('.contact-heading', page);
    const para = $('.contact-para', page);
    const heads = $$('.c-email-head', page);
    const emails = $$('.c-email-link', page);
    const socials = $$('.contact-social', page);
    const art = $('.contact-art', page);

    const chars = headings.flatMap((h) => new SplitText(h, { type: 'words, chars', charsClass: 'contact-char' }).chars);
    const paraLines = splitLines(para, 'contact-para-line', 'project-line-mask');
    const headWords = heads.flatMap((h) => {
      const s = new SplitText(h, { type: 'words', wordsClass: 'contact-word' });
      s.words.forEach((w) => { const m = document.createElement('span'); m.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top'; w.parentNode.insertBefore(m, w); m.appendChild(w); });
      return s.words;
    });
    wiggleLinks('.c-email-link');
    const lens = paths.map((p) => p.getTotalLength());
    let isOpen = false, tl = null, lastFocus = null;

    function reset() {
      paths.forEach((p, i) => gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i], strokeWidth: 0 }));
      gsap.set(logo, { scale: 0, opacity: 0 });
      gsap.set(closeBtn, { opacity: 0, scale: 0.4, y: 20 });
      gsap.set(closeTxt, { opacity: 0, y: 15, display: 'inline-block' });
      gsap.set(chars, { opacity: 0, scale: 0.5, rotation: 0 });
      gsap.set(paraLines, { y: '115%', opacity: 0 });
      gsap.set(headWords, { y: '105%', opacity: 0 });
      gsap.set(emails, { opacity: 0, y: 15 });
      gsap.set(socials, { opacity: 0, scale: 0.4, y: 20 });
      gsap.set(art, { opacity: 0, scale: 0.8, y: 60, rotation: rand(-3, 3), transformOrigin: 'bottom center' });
    }
    reset();

    function open() {
      if (isOpen) return;
      isOpen = true;
      lastFocus = document.activeElement;
      closeHam();
      lockScroll(true);
      page.classList.add('is-active');
      page.setAttribute('aria-hidden', 'false');
      reset();
      if (tl) tl.kill();
      tl = gsap.timeline();
      paths.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, strokeWidth: 1600, duration: 0.9, ease: 'power2.inOut' }, i * 0.1));
      const c = 0.45;
      tl.to(logo, { scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(2.2)' }, c)
        .to(closeBtn, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(2.5)' }, c + 0.1)
        .to(closeTxt, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }, c + 0.22);
      chars.forEach((ch, i) => {
        const at = c + 0.15 + i * 0.022;
        tl.to(ch, { opacity: 1, scale: 1.1, rotation: rand(-6, 6), textShadow: '0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor', duration: 0.45, ease: 'back.out(2)' }, at)
          .to(ch, { scale: 1, rotation: 0, textShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.6, ease: 'power2.out' }, at + 0.45);
      });
      tl.to(paraLines, { y: '0%', opacity: 1, duration: 0.85, stagger: 0.1, ease: 'back.out(1.4)' }, c + 0.3)
        .to(headWords, { y: '0%', opacity: 1, duration: 0.7, stagger: 0.06, ease: 'back.out(1.5)' }, c + 0.25)
        .to(emails, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'back.out(1.5)' }, c + 0.35)
        .to(socials, { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(2.5)' }, c + 0.45)
        .to(art, { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.9, ease: 'back.out(1.8)' }, c + 0.4);
      setTimeout(() => closeBtn.focus({ preventScroll: true }), 400);
    }
    function close() {
      if (!isOpen) return;
      isOpen = false;
      if (tl) tl.kill();
      tl = gsap.timeline({
        onComplete: () => {
          page.classList.remove('is-active');
          page.setAttribute('aria-hidden', 'true');
          lockScroll(false);
          if (lastFocus) lastFocus.focus({ preventScroll: true });
        },
      });
      tl.to([logo, closeBtn, ...socials, art], { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power2.in' }, 0)
        .to([...chars, ...paraLines, ...headWords, ...emails], { opacity: 0, y: -20, duration: 0.3, stagger: 0.004, ease: 'power2.in' }, 0)
        .to(paths, { strokeWidth: 0, duration: 0.7, stagger: 0.08, ease: 'power2.inOut' }, 0.15);
    }
    $$('.js-contact').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    closeBtn.addEventListener('click', close);
    addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); closeHam(); } });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  renderProjects();
  Promise.race([document.fonts ? document.fonts.load('400 230px Anybody') : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])
    .then(() => safe('loader', loader));
  safe('buttons', buttons);
  safe('ham', hamMenu);
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => {
    safe('hero', hero);
    safe('marquee', marquee);
    safe('about', about);
    safe('showcase', showcase);
    safe('magnetic', magneticHeadings);
    safe('projects', projects);
    safe('services', services);
    safe('testimonials', testimonials);
    safe('faq', faq);
    safe('footer', footer);
    safe('contact', contact);
    ScrollTrigger.refresh();
  });
  addEventListener('load', () => ScrollTrigger.refresh());
})();

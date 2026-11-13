document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  const wrap = document.querySelector('[data-social-callout="wrap"]');
  if (!wrap) return;
  const cards = Array.from(wrap.querySelectorAll('.callout-socials-card-w'));
  if (!cards.length) return;

  // --- base maps (unchanged) ---
  const desktop = [
    { scale: 0.80, rotation: -18, x: -20, y: 6, zIndex: 1 },
    { scale: 0.87, rotation: -12, x: -14, y: 3.5, zIndex: 2 },
    { scale: 0.95, rotation: -6, x: -7, y: 1.2, zIndex: 3 },
    { scale: 1.00, rotation: 0, x: 0, y: 0, zIndex: 10 },
    { scale: 0.95, rotation: 6, x: 7, y: 1.2, zIndex: 3 },
    { scale: 0.87, rotation: 12, x: 14, y: 3.5, zIndex: 2 },
    { scale: 0.80, rotation: 18, x: 20, y: 6, zIndex: 1 },
  ];

  const mobile = [
    { scale: 0.7756, rotation: -21, x: -15, y: 7.3, zIndex: 1 },
    { scale: 0.8498, rotation: -14, x: -11, y: 4, zIndex: 2 },
    { scale: 0.9346, rotation: -7, x: -6, y: 1.3, zIndex: 3 },
    { scale: 1.0000, rotation: 0, x: 0, y: 0, zIndex: 10 },
    { scale: 0.9346, rotation: 7, x: 6, y: 1.3, zIndex: 3 },
    { scale: 0.8498, rotation: 14, x: 11, y: 4, zIndex: 2 },
    { scale: 0.7756, rotation: 21, x: 15, y: 7.3, zIndex: 1 },
  ];

  const centerIndex = Math.floor(cards.length / 2);

  // --- compute map only when width changes (reduces work on hover/layout calls) ---
  let lastWidth = -1;
  let map = [];
  let base = [];
  function updateMapIfNeeded() {
    // Use clientWidth (cheaper than getBoundingClientRect for repeated reads)
    const w = wrap.clientWidth || window.innerWidth;
    if (w === lastWidth) return;
    lastWidth = w;

    const isMobile = window.innerWidth <= 991;
    const template = isMobile ? mobile : desktop;

    // Global scale curve
    let global = 1;
    if (w <= 340) global = 0.48;
    else if (w <= 360) global = 0.52;
    else if (w <= 380) global = 0.56;
    else if (w <= 414) global = 0.60;
    else if (w <= 480) global = 0.66;
    else if (w <= 560) global = 0.72;
    else if (w <= 640) global = 0.76;
    else if (w <= 768) global = 0.84;
    else if (w <= 896) global = 0.88;
    else if (w <= 1024) global = 0.92;
    else if (w <= 1200) global = 0.95;
    else if (w <= 1366) global = 0.98;
    else if (w <= 1536) global = 1.06;
    else if (w <= 1680) global = 1.10;
    else if (w <= 1920) global = 1.14;
    else global = 1.18;

    // Horizontal spread factor
    let spread = 1;
    if (w <= 360) spread = 0.78;
    else if (w <= 414) spread = 0.84;
    else if (w <= 560) spread = 0.90;
    else if (w <= 768) spread = 0.96;
    else if (w <= 1024) spread = 1.04;
    else if (w <= 1200) spread = 1.12;
    else if (w <= 1366) spread = 1.20;
    else if (w <= 1536) spread = 1.16;
    else if (w <= 1680) spread = 1.18;
    else spread = 1.22;

    // Rotation bump for sub-1440
    let rot = 1;
    if (w <= 1200) rot = 1.08;
    else if (w <= 1440) rot = 1.12;
    else rot = 1.0;

    map = template.map(p => ({
      scale: p.scale * global,
      rotation: p.rotation * rot,
      x: p.x * spread,
      y: p.y * global,
      zIndex: p.zIndex
    }));
    base = [...map];
  }

  updateMapIfNeeded();

  // --- initial state ---
  gsap.set(cards, {
    x: 0, y: '10rem', scale: 1, rotation: 0,
    transformOrigin: 'center center',
    opacity: 1,
    willChange: 'transform', force3D: true
  });
  // set starting z-order from map
  cards.forEach((el, i) => { el.style.zIndex = String(map[i % map.length].zIndex); });

  // --- entry animation ---
  gsap.timeline({
    scrollTrigger: { trigger: wrap, start: 'top 90%', once: true }
  })
    .to(cards, {
      y: 0, duration: 0.8, ease: 'power2.out',
      stagger: { amount: 0.5, from: 'end' }
    })
    .to(cards, {
      x: i => `${map[i % map.length].x}rem`,
      y: i => `${map[i % map.length].y}rem`,
      scale: i => map[i % map.length].scale,
      rotation: i => map[i % map.length].rotation,
      duration: 1.2,
      ease: 'elastic.out(1, 0.75)',
      stagger: { amount: 0.2, from: 'center' },
      onStart: () => { /* ensure stacking is already base before motion */ },
      onUpdate: () => { /* noop */ }
    }, '-=0.4')
    .add(() => initHover());

  // --- hover system with exact stacking behavior ---
  function initHover() {
    let activeIndex = null;
    let leaveTimer = null;

    // helpers: stack ordering
    function setZBaseOrder() {
      cards.forEach((el, i) => {
        // center highest, then step down by distance from center
        el.style.zIndex = String(100 - Math.abs(i - centerIndex));
      });
    }
    function setZHoverOrder(mid) {
      cards.forEach((el, i) => {
        const dist = Math.abs(i - mid);
        el.style.zIndex = String(99 - dist); // hovered on top, nearest below, etc.
      });
    }

    // responsive recalc (debounced via rAF)
    let resizeTimer = null;
    const onResize = () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        updateMapIfNeeded();
        if (activeIndex === null) layoutToBase();
      });
    };
    window.addEventListener('resize', onResize);

    // layout: base fan (center priority)
    function layoutToBase() {
      updateMapIfNeeded();
      setZBaseOrder();

      const tl = gsap.timeline();
      const order = cards
        .map((_, i) => ({ i, d: Math.abs(i - centerIndex) }))
        .sort((a, b) => a.d - b.d);

      order.forEach(({ i, d }) => {
        tl.to(cards[i], {
          x: `${base[i % base.length].x}rem`,
          y: `${base[i % base.length].y}rem`,
          scale: base[i % base.length].scale,
          rotation: base[i % base.length].rotation,
          duration: 0.5,
          ease: 'elastic.out(1, 0.75)',
          overwrite: 'auto',
          onStart: () => { cards[i].style.zIndex = String(100 - Math.abs(i - centerIndex)); }
        }, d * 0.02);
      });
      return tl;
    }

    // layout: hovered index with neighbor nudge & correct stacking
    function layoutForIndex(mid) {
      updateMapIfNeeded();
      setZHoverOrder(mid); // critical: set stacking BEFORE motion

      const tl = gsap.timeline();
      const ordered = cards
        .map((_, i) => ({ i, d: Math.abs(i - mid) }))
        .sort((a, b) => (a.i === mid ? -1 : b.i === mid ? 1 : a.d - b.d));

      const last = cards.length - 1;

      ordered.forEach(({ i, d }) => {
        const isLeft = i < mid;
        const isRight = i > mid;
        const isMid = i === mid;
        const isLast = i === last;

        const dist = Math.abs(i - mid);
        const rel = (i - centerIndex) / centerIndex || 0; // -1..1
        const closeness = 1 - Math.abs(rel);
        const spread = 8;
        const bias = 1 + 0.2 * Math.max(0, 3 - dist);

        let cfg = {};
        if (isMid) {
          cfg = {
            y: `${base[i].y - 2.5}rem`,
            x: `${base[i].x}rem`,
            scale: base[i].scale * 1.08,
            rotation: base[i].rotation,
            duration: 0.5,
            ease: 'elastic.out(1, 0.75)',
            overwrite: 'auto',
            onStart: () => { cards[i].style.zIndex = '99'; }
          };
        } else if (isLeft) {
          const nx = spread * closeness * bias;
          const rotBump = -3 * (1 / (dist + 1));
          cfg = {
            x: `${base[i].x - nx}rem`,
            y: `${base[i].y}rem`,
            scale: base[i].scale,
            rotation: base[i].rotation + rotBump,
            duration: 0.5,
            ease: 'elastic.out(1, 0.75)',
            overwrite: 'auto',
            onStart: () => { cards[i].style.zIndex = String(99 - dist); }
          };
        } else if (isRight) {
          const nx = isLast ? 0 : spread * closeness * bias;
          const rotBump = 3 * (1 / (dist + 1));
          cfg = {
            x: `${base[i].x + nx}rem`,
            y: `${base[i].y + (isLast ? -1 : 0)}rem`,
            scale: base[i].scale,
            rotation: base[i].rotation + rotBump,
            duration: 0.5,
            ease: 'elastic.out(1, 0.75)',
            overwrite: 'auto',
            onStart: () => { cards[i].style.zIndex = String(99 - dist); }
          };
        }
        tl.to(cards[i], cfg, d * 0.02);
      });

      return tl;
    }

    // bind events
    cards.forEach((card, idx) => {
      const enter = () => {
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        activeIndex = idx;
        layoutForIndex(idx);
      };
      const leave = () => {
        if (activeIndex === idx) {
          leaveTimer = setTimeout(() => {
            if (activeIndex === idx) { activeIndex = null; layoutToBase(); }
            leaveTimer = null;
          }, 50);
        }
      };
      card.addEventListener('mouseenter', enter);
      card.addEventListener('mouseleave', leave);
    });

    // reset when leaving the wrap
    const leaveWrap = () => {
      if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
      activeIndex = null;
      layoutToBase();
    };
    wrap.addEventListener('mouseleave', leaveWrap);

    // cleanup (if you re-render)
    wrap.cleanupSocialCallout = () => {
      cards.forEach((card) => { card.replaceWith(card.cloneNode(true)); });
      wrap.removeEventListener('mouseleave', leaveWrap);
      window.removeEventListener('resize', onResize);
      gsap.killTweensOf(cards);
      ScrollTrigger.getAll().forEach(t => { if (t.trigger === wrap) t.kill(); });
    };
  }
});
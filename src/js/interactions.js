/* ── Interactive Effects: Custom Cursor + 3D Tilt Cards ── */
(function () {
    'use strict';

    // ── Custom Cursor ─────────────────────────────────────────
    function initCursor() {
        var dot  = document.getElementById('cursorDot');
        var ring = document.getElementById('cursorRing');
        if (!dot || !ring) return;

        var mx = -200, my = -200;
        var rx = -200, ry = -200;
        var LERP = 0.1; // ring lag — 0.06 dreamy · 0.15 snappy

        document.addEventListener('mousemove', function (e) {
            mx = e.clientX;
            my = e.clientY;
        });
        document.addEventListener('mouseleave', function () {
            dot.style.opacity  = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
            dot.style.opacity  = '1';
            ring.style.opacity = '1';
        });
        document.addEventListener('mousedown', function () { dot.classList.add('is-clicking'); });
        document.addEventListener('mouseup',   function () { dot.classList.remove('is-clicking'); });

        (function tick() {
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';

            rx += (mx - rx) * LERP;
            ry += (my - ry) * LERP;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';

            requestAnimationFrame(tick);
        }());

        // ── Priority state system (card=4 > drag=3 > hovering=2 > text=1) ──
        var PRI   = { card: 4, drag: 3, hovering: 2, text: 1 };
        var STATES = ['is-card', 'is-drag', 'is-hovering', 'is-text'];

        function currentPri() {
            if (ring.classList.contains('is-card'))     return 4;
            if (ring.classList.contains('is-drag'))     return 3;
            if (ring.classList.contains('is-hovering')) return 2;
            if (ring.classList.contains('is-text'))     return 1;
            return 0;
        }

        function setState(state, opts) {
            STATES.forEach(function (s) { ring.classList.remove(s); });
            dot.classList.remove('is-text');
            ring.style.removeProperty('--cursor-color');
            ring.style.removeProperty('--cursor-text');
            ring.removeAttribute('data-label');

            if (!state) return;

            ring.classList.add('is-' + state);
            if (state === 'text') dot.classList.add('is-text');
            if (state === 'card') ring.setAttribute('data-label', 'View');
            if (state === 'drag') ring.setAttribute('data-label', 'Drag');
            if (opts && opts.color) {
                ring.style.setProperty('--cursor-color', opts.color);
                ring.style.setProperty('--cursor-text',  opts.textColor || '#000');
            }
        }

        // enter only if this state has equal-or-higher priority
        function tryEnter(state, opts) {
            if ((PRI[state] || 0) >= currentPri()) setState(state, opts);
        }

        // leave only if this state is currently active; restore fallback if given
        function tryLeave(state, fallback, fallbackOpts) {
            if ((PRI[state] || 0) === currentPri()) setState(fallback || null, fallbackOpts);
        }

        // ── Portfolio cards (brand colour) ─────────────────────
        var inSwiper = false;

        document.querySelectorAll('.tilt-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                tryEnter('card', {
                    color:     el.dataset.cursorColor || '#DDF160',
                    textColor: el.dataset.cursorText  || '#000'
                });
            });
            el.addEventListener('mouseleave', function () {
                tryLeave('card', inSwiper ? 'drag' : null);
            });
        });

        // ── Swiper "Drag" zone ─────────────────────────────────
        var swiperEl = document.querySelector('.myWorkSwiper');
        if (swiperEl) {
            swiperEl.addEventListener('mouseenter', function () {
                inSwiper = true;
                tryEnter('drag');
            });
            swiperEl.addEventListener('mouseleave', function () {
                inSwiper = false;
                tryLeave('drag');
            });
        }

        // ── Links & buttons ────────────────────────────────────
        document.querySelectorAll('a, button').forEach(function (el) {
            if (el.classList.contains('tilt-card')) return;
            el.addEventListener('mouseenter', function () { tryEnter('hovering'); });
            el.addEventListener('mouseleave', function () { tryLeave('hovering'); });
        });

        // ── Body text — thin beam cursor ──────────────────────
        document.querySelectorAll('p').forEach(function (el) {
            el.addEventListener('mouseenter', function () { tryEnter('text'); });
            el.addEventListener('mouseleave', function () { tryLeave('text'); });
        });
    }

    // ── 3D Tilt Cards ─────────────────────────────────────────
    function initTilt() {
        document.querySelectorAll('.tilt-card').forEach(function (card) {
            var inner = card.querySelector('.tilt-inner');
            if (!inner) return;

            var shine = document.createElement('div');
            shine.className = 'tilt-shine';
            inner.appendChild(shine);

            var MAX_ROT = 10;

            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var pctX = (e.clientX - rect.left) / rect.width;
                var pctY = (e.clientY - rect.top)  / rect.height;

                gsap.to(inner, {
                    duration: 0.35,
                    rotateX: (0.5 - pctY) * MAX_ROT * 2,
                    rotateY: (pctX - 0.5) * MAX_ROT * 2,
                    transformPerspective: 900,
                    ease: 'power2.out'
                });
                gsap.to(shine, {
                    duration: 0.35,
                    opacity: 1,
                    background:
                        'radial-gradient(circle at ' +
                        (pctX * 100).toFixed(1) + '% ' +
                        (pctY * 100).toFixed(1) + '%, ' +
                        'rgba(255,255,255,0.13) 0%, transparent 65%)'
                });
            });

            card.addEventListener('mouseleave', function () {
                gsap.to(inner, {
                    duration: 0.65, rotateX: 0, rotateY: 0,
                    ease: 'elastic.out(1, 0.5)'
                });
                gsap.to(shine, { duration: 0.3, opacity: 0 });
            });
        });
    }

    // ── Boot ──────────────────────────────────────────────────
    function boot() {
        if (typeof gsap === 'undefined') { setTimeout(boot, 50); return; }
        initCursor();
        initTilt();
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', boot)
        : boot();
}());

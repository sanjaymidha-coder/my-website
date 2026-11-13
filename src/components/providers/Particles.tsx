"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Background star-dust, recreated from the original particles.js config without the library:
 * ~450 particles per 500k px² area, white, 0.5–1px, random twinkle (0.1–0.5 opacity),
 * drifting slowly upward with a little random wander, wrapping at the edges.
 */
const DENSITY = 450 / 500_000; // particles per CSS px²
const MAX = 1400;

interface P {
  x: number;
  y: number;
  r: number;
  a: number;
  da: number;
  vx: number;
  vy: number;
}

export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Disabled entirely for reduced-motion users.
    if (prefersReducedMotion()) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const parts: P[] = [];
    let raf = 0;

    const make = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.35 + Math.random() * 0.65,
      a: 0.1 + Math.random() * 0.4,
      da: (Math.random() < 0.5 ? -1 : 1) * (0.002 + Math.random() * 0.006),
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(0.1 + Math.random() * 0.3),
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(MAX, Math.round(w * h * DENSITY * (w < 768 ? 0.6 : 1)));
      while (parts.length < target) parts.push(make());
      parts.length = target;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff";
      for (const p of parts) {
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (const p of parts) {
        p.x += p.vx + (Math.random() - 0.5) * 0.08;
        p.y += p.vy;
        p.a += p.da;
        if (p.a > 0.5 || p.a < 0.1) {
          p.da *= -1;
          p.a = Math.min(0.5, Math.max(0.1, p.a));
        }
        if (p.y < -2) {
          p.y = h + 2;
          p.x = Math.random() * w;
        }
        if (p.x < -2) p.x = w + 2;
        else if (p.x > w + 2) p.x = -2;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    resize();
    raf = requestAnimationFrame(step);

    const onResize = () => resize();
    // Pause while the tab is hidden.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") raf = requestAnimationFrame(step);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}

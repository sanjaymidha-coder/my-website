"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** 3D tilt + moving shine on hover (ported from the original interactions.js). */
export function TiltCard({ children, className = "", max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const inner = el.querySelector<HTMLElement>("[data-tilt-inner]");
      const shine = el.querySelector<HTMLElement>("[data-tilt-shine]");
      if (!inner) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        gsap.set(el, { perspective: 900 });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(inner, { rotateY: px * max, rotateX: -py * max, duration: 0.5, ease: "power2.out", transformPerspective: 900 });
          if (shine)
            gsap.to(shine, {
              opacity: 1,
              background: `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,0.22), transparent 55%)`,
              duration: 0.3,
            });
        };
        const leave = () => {
          gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
          if (shine) gsap.to(shine, { opacity: 0, duration: 0.3 });
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      <div data-tilt-inner className="relative h-full w-full [transform-style:preserve-3d]">
        {children}
        <div data-tilt-shine aria-hidden className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] opacity-0" />
      </div>
    </div>
  );
}

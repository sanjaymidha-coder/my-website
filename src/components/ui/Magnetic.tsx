"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** Wraps a CTA so it gently follows the pointer, with the label moving a bit further. */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const target = el.firstElementChild as HTMLElement | null;
        if (!target) return;
        const label = target.querySelector<HTMLElement>("[data-magnetic-label]");
        const xTo = gsap.quickTo(target, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(target, "y", { duration: 0.6, ease: "power3.out" });
        const lx = label ? gsap.quickTo(label, "x", { duration: 0.6, ease: "power3.out" }) : null;
        const ly = label ? gsap.quickTo(label, "y", { duration: 0.6, ease: "power3.out" }) : null;

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          xTo(x * strength);
          yTo(y * strength);
          lx?.(x * strength * 0.5);
          ly?.(y * strength * 0.5);
        };
        const leave = () => {
          gsap.to(target, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
          if (label) gsap.to(label, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
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
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-block p-3 -m-3 ${className}`}>
      {children}
    </span>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** Counts from 0 to `value` when scrolled into view. Final value is in the HTML for no-JS / reduced motion. */
export function CountUp({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => n.toFixed(decimals);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const obj = { n: 0 };
        el.textContent = format(0);
        gsap.to(obj, {
          n: value,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = format(obj.n);
          },
        });
        return () => {
          el.textContent = format(value);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span className="tabular-nums">
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  );
}

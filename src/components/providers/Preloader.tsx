"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markLoaded } from "@/lib/loaded";

/** Short 0 → 100 counter, then an upward wipe that reveals the site. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        markLoaded();
        setDone(true);
        return;
      }

      const counter = { v: 0 };
      const num = el.querySelector<HTMLElement>("[data-count]");
      const bar = el.querySelector<HTMLElement>("[data-bar]");
      document.documentElement.classList.add("is-loading");

      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.classList.remove("is-loading");
            setDone(true);
          },
        })
        .to(counter, {
          v: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        })
        .to(bar, { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0)
        .to(el.querySelectorAll("[data-fade]"), { yPercent: -120, opacity: 0, duration: 0.5, ease: "power3.in" })
        .add(markLoaded, "-=0.1")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "power4.inOut" }, "<");
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[9995] flex flex-col justify-between bg-navy p-6 md:p-10"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden
    >
      <div className="overflow-hidden">
        <p data-fade className="eyebrow">
          Codeller — digital product studio
        </p>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="overflow-hidden">
          <span
            data-count
            data-fade
            className="block font-mono text-[22vw] leading-[0.8] tracking-tighter text-lime md:text-[14vw]"
          >
            000
          </span>
        </div>
        <div className="mb-4 hidden w-1/3 md:block">
          <div className="h-px w-full bg-white/15">
            <div data-bar className="h-px origin-left scale-x-0 bg-lime" />
          </div>
        </div>
      </div>
      <noscript>
        <style>{`.preloader{display:none!important}`}</style>
      </noscript>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markLoaded } from "@/lib/loaded";

const SEEN_KEY = "codeller-intro-seen";

/**
 * Non-blocking intro: a thin lime progress bar with a small 0 → 100 counter.
 * It never covers the page (so the hero headline is painted immediately — good for LCP),
 * runs once per browser session, and is skipped for reduced motion.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      // Intro animations may start right away; nothing waits on this bar.
      markLoaded();
      const el = root.current;
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage unavailable */
      }
      if (!el || seen || prefersReducedMotion()) {
        setDone(true);
        return;
      }

      const counter = { v: 0 };
      const num = el.querySelector<HTMLElement>("[data-count]");
      gsap
        .timeline({ onComplete: () => setDone(true) })
        .to("[data-bar]", { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0)
        .to(
          counter,
          {
            v: 100,
            duration: 0.9,
            ease: "power2.inOut",
            onUpdate: () => {
              if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0,
        )
        .to(el, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[9995]">
      <div className="h-[3px] w-full bg-white/10">
        <div data-bar className="h-full origin-left scale-x-0 bg-lime" />
      </div>
      <span data-count className="absolute right-4 top-3 font-mono text-[11px] tracking-widest text-lime md:right-6">
        000
      </span>
      <noscript>
        <style>{`[data-bar]{transform:scaleX(1)}`}</style>
      </noscript>
    </div>
  );
}

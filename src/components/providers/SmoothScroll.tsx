"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/** Scroll to an element id / "top", using Lenis when available. */
export function scrollToTarget(lenis: Lenis | null, target: string | number, immediate = false) {
  const offset = -80;
  if (typeof target === "string") {
    const el = document.getElementById(target.replace(/^#/, ""));
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset, immediate });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: immediate ? "auto" : "smooth" });
    return;
  }
  if (lenis) lenis.scrollTo(target, { immediate });
  else window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // Keep ScrollTrigger in lock-step with Lenis and drive Lenis from GSAP's ticker.
    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    rafRef.current = raf;
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

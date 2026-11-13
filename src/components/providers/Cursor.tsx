"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ, prefersReducedMotion } from "@/lib/gsap";

type State = "card" | "drag" | "hovering" | "text" | null;

/**
 * Custom cursor: dot + lagging ring (mix-blend-difference).
 * States (priority card > drag > hovering > text), via event delegation:
 *  - [data-cursor="card"] (+ data-cursor-color / data-cursor-text) → "View"
 *  - [data-cursor="drag"] → "Drag"
 *  - a / button → hovering
 *  - p / li / headings → text caret
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia(MQ.finePointer).matches) return;
    const d = dot.current!;
    const r = ring.current!;
    document.documentElement.classList.add("has-cursor");
    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: -200, y: -200 });

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "none" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "none" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });

    let current: State = null;
    const setState = (state: State, el?: HTMLElement | null) => {
      if (state === current && state !== "card") return;
      current = state;
      r.classList.remove("is-card", "is-drag", "is-hovering", "is-text");
      d.classList.remove("is-text");
      r.style.removeProperty("--cursor-color");
      r.style.removeProperty("--cursor-text");
      r.removeAttribute("data-label");
      if (!state) return;
      r.classList.add(`is-${state}`);
      if (state === "text") d.classList.add("is-text");
      if (state === "card") r.setAttribute("data-label", el?.dataset.cursorLabel ?? "View");
      if (state === "drag") r.setAttribute("data-label", "Drag");
      if (el?.dataset.cursorColor) {
        r.style.setProperty("--cursor-color", el.dataset.cursorColor);
        r.style.setProperty("--cursor-text", el.dataset.cursorText ?? "#000");
      }
    };

    const onMove = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;
      const special = t.closest<HTMLElement>("[data-cursor]");
      if (special) {
        const kind = special.dataset.cursor as State;
        return setState(kind === "drag" ? "drag" : "card", special);
      }
      if (t.closest("a, button, [role='button'], label, select, summary")) return setState("hovering");
      if (t.closest("p, li, h1, h2, h3, h4, blockquote, input, textarea")) return setState("text");
      setState(null);
    };
    const onDown = () => d.classList.add("is-clicking");
    const onUp = () => d.classList.remove("is-clicking");
    const onLeave = () => gsap.to([d, r], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([d, r], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring hidden [.has-cursor_&]:grid" aria-hidden />
      <div ref={dot} className="cursor-dot hidden [.has-cursor_&]:block" aria-hidden />
    </>
  );
}

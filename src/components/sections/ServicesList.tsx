"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Marquee } from "@/components/ui/Marquee";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowRight } from "@/components/ui/Icons";
import type { ServiceItem } from "@/data/types";

interface Props {
  id?: string;
  rowA: [string, string];
  items: ServiceItem[];
}

/** Giant two-row marquee title + hover list with an image that follows the cursor. */
export function ServicesList({ id, rowA, items }: Props) {
  const root = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  // The preview is portalled to <body> (position: fixed) so no row/section can clip it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const list = root.current?.querySelector<HTMLElement>("[data-list]");
        const float = floatRef.current;
        if (!list || !float) return;
        const imgs = gsap.utils.toArray<HTMLElement>("[data-float-img]", float);
        const W = 320;
        const H = 240;
        const GAP = 36; // distance from the cursor so the title stays readable

        gsap.set(float, { x: -9999, y: -9999, autoAlpha: 0, scale: 0.85, rotation: 0 });
        gsap.set(imgs, { clipPath: "inset(100% 0% 0% 0%)", zIndex: 0 });

        const xTo = gsap.quickTo(float, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(float, "y", { duration: 0.5, ease: "power3.out" });
        const rTo = gsap.quickTo(float, "rotation", { duration: 0.7, ease: "power3.out" });
        let lastX = 0;
        let active = -1;
        let visible = false;

        const target = (e: PointerEvent) => {
          // Sit to the right of the cursor; flip to the left near the right edge.
          const right = e.clientX + GAP + W < window.innerWidth;
          return {
            x: right ? e.clientX + GAP : e.clientX - GAP - W,
            y: gsap.utils.clamp(8, window.innerHeight - H - 8, e.clientY - H / 2),
          };
        };

        const move = (e: PointerEvent) => {
          const t = target(e);
          if (!visible) {
            // First frame: jump into place instead of sliding in from the last spot.
            gsap.set(float, { x: t.x, y: t.y });
          }
          xTo(t.x);
          yTo(t.y);
          rTo(gsap.utils.clamp(-3, 3, (e.clientX - lastX) * 0.25)); // gentle tilt only
          lastX = e.clientX;
        };

        const show = () => {
          visible = true;
          gsap.to(float, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
        };

        const enterRow = (i: number) => {
          show();
          if (i === active) return;
          const prev = active;
          active = i;
          const img = imgs[i];
          gsap.killTweensOf(imgs, "clipPath");
          imgs.forEach((el, j) => gsap.set(el, { zIndex: j === i ? 2 : j === prev ? 1 : 0 }));
          // New image wipes up over the previous one; the reveal always runs to completion.
          gsap.fromTo(
            img,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.45,
              ease: "power3.out",
              onComplete: () => {
                imgs.forEach((el, j) => j !== i && gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" }));
              },
            },
          );
          if (prev === -1) imgs.forEach((el, j) => j !== i && gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" }));
        };

        const leave = () => {
          visible = false;
          active = -1;
          gsap.to(float, { autoAlpha: 0, scale: 0.85, rotation: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        };

        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", list);
        const handlers = rows.map((row, i) => {
          const h = () => enterRow(i);
          row.addEventListener("pointerenter", h);
          return () => row.removeEventListener("pointerenter", h);
        });
        list.addEventListener("pointermove", move);
        list.addEventListener("pointerleave", leave);
        return () => {
          handlers.forEach((off) => off());
          list.removeEventListener("pointermove", move);
          list.removeEventListener("pointerleave", leave);
        };
      });

      mm.add(MQ.motion, () => {
        gsap.from("[data-row]", {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-list]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [mounted], revertOnUpdate: true },
  );

  const word = (text: string, outline: boolean) => (
    <span className={`mx-6 flex items-center gap-12 font-display text-[18vw] font-semibold uppercase leading-none tracking-[-0.05em] md:mx-10 md:text-[9vw] ${outline ? "stroke-text" : "text-white"}`}>
      {outline ? text : <span><em className="accent normal-case text-lime">{text.split(" ")[0].toLowerCase()}</em> {text.split(" ").slice(1).join(" ")}</span>}
      <span className="text-[4vw] text-lime md:text-[2vw]">✶</span>
    </span>
  );

  return (
    <section ref={root} id={id} aria-labelledby={`${id ?? "services"}-heading`} className="section overflow-hidden">
      <div className="glow right-[-10%] top-10 h-[420px] w-[560px] bg-lime/30" />
      <h2 id={`${id ?? "services"}-heading`} className="sr-only">
        {rowA[1]}
      </h2>
      <div aria-hidden className="mb-16 grid gap-2 md:mb-24">
        <Marquee duration={40}>
          {word(rowA[0], true)}
          {word(rowA[1], false)}
        </Marquee>
        <Marquee duration={40} reverse>
          {word(rowA[1], true)}
          {word(rowA[0], false)}
        </Marquee>
      </div>

      <div data-list className="relative border-y border-white/10">
        <ul className="divide-y divide-white/10">
          {items.map((s, i) => (
            <li key={s.title} data-row>
              <TransitionLink href={s.href} className="group block transition-colors duration-500 hover:bg-white/[0.03]">
                <div className="container flex items-center justify-between gap-6 py-7 md:py-11">
                  <div className="flex items-baseline gap-5 md:gap-10">
                    <span className="font-mono text-xs text-lime md:text-sm">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-[clamp(1.6rem,5vw,4.5rem)] font-semibold leading-none transition-transform duration-500 ease-out group-hover:translate-x-4">
                      {s.title}
                    </h3>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 transition-all duration-500 group-hover:-rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-black md:h-16 md:w-16">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </TransitionLink>
            </li>
          ))}
        </ul>

      </div>

      {/* Cursor-following preview (fixed, portalled — never clipped by a row or section) */}
      {mounted &&
        createPortal(
          <div
            ref={floatRef}
            aria-hidden
            className="pointer-events-none invisible fixed left-0 top-0 z-[9000] h-[240px] w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
          >
            {items.map((s) => (
              <div key={s.title} data-float-img className="absolute inset-0">
                <Image src={s.image} alt="" fill sizes="320px" loading="eager" className="object-cover" />
              </div>
            ))}
          </div>,
          document.body,
        )}
    </section>
  );
}

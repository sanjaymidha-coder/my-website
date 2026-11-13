"use client";

import Image from "next/image";
import { useRef } from "react";
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const list = root.current?.querySelector<HTMLElement>("[data-list]");
        const float = root.current?.querySelector<HTMLElement>("[data-float]");
        if (!list || !float) return;
        const imgs = gsap.utils.toArray<HTMLElement>("[data-float-img]", float);
        gsap.set(float, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
        const xTo = gsap.quickTo(float, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(float, "y", { duration: 0.6, ease: "power3.out" });
        const rTo = gsap.quickTo(float, "rotation", { duration: 0.8, ease: "power3.out" });
        let lastX = 0;

        const move = (e: PointerEvent) => {
          const r = list.getBoundingClientRect();
          const x = e.clientX - r.left;
          xTo(x);
          yTo(e.clientY - r.top);
          rTo(gsap.utils.clamp(-12, 12, (x - lastX) * 0.6));
          lastX = x;
        };
        const enterRow = (i: number) => {
          gsap.to(float, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" });
          imgs.forEach((img, j) =>
            gsap.to(img, { clipPath: j === i ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", duration: 0.6, ease: "power3.inOut" }),
          );
        };
        const leave = () => gsap.to(float, { autoAlpha: 0, scale: 0.6, duration: 0.4 });

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
    { scope: root },
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

        {/* Cursor-following preview */}
        <div data-float aria-hidden className="pointer-events-none invisible absolute left-0 top-0 z-10 hidden aspect-[4/3] w-[320px] overflow-hidden rounded-2xl shadow-2xl md:block">
          {items.map((s) => (
            <div key={s.title} data-float-img className="absolute inset-0" style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
              <Image src={s.image} alt="" fill sizes="320px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

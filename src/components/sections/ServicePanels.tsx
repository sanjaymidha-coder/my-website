"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ServicePanel } from "@/data/services";

/** Stacked panels that pin on top of each other (ported from service-panels.js). */
export function ServicePanels({ panels }: { panels: ServicePanel[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1199px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-panel]");
        const baseOffset = 90;
        const gap = 110;
        items.forEach((panel, index) => {
          gsap.to(panel, {
            scrollTrigger: {
              trigger: panel,
              pin: panel,
              scrub: 1,
              start: `top ${baseOffset + index * gap}px`,
              end: "bottom 99%",
              endTrigger: "[data-panels]",
              pinSpacing: false,
            },
          });
          // Earlier panels dim slightly as the next one slides over them.
          if (index < items.length - 1)
            gsap.to(panel.querySelector("[data-panel-inner]"), {
              opacity: 0.55,
              scale: 0.97,
              ease: "none",
              scrollTrigger: { trigger: items[index + 1], start: "top bottom", end: `top ${baseOffset + (index + 1) * gap}px`, scrub: true },
            });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Our services" className="pb-24 md:pb-36">
      <div data-panels className="container grid gap-6 xl:gap-0">
        {panels.map((p, i) => (
          <article key={p.title} data-panel className="overflow-hidden rounded-[32px]" style={{ backgroundColor: p.color }}>
            <div data-panel-inner className="flex origin-top flex-col gap-10 px-6 py-10 md:px-12 md:py-14 lg:flex-row lg:gap-16 lg:px-16 lg:py-16">
              <div className="max-w-[560px] flex-1">
                <span className="mb-6 block font-mono text-sm text-white/70">{String(i + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}</span>
                <h2 className="mb-5 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.02]">{p.title}</h2>
                <p className="mb-8 text-base text-white/80 md:text-lg">{p.body}</p>
                <ul className="flex flex-wrap gap-2">
                  {p.items.map((it) => (
                    <li key={it} className="rounded-full border border-white/30 px-4 py-2 text-sm text-white/90">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-1 items-end gap-5 lg:justify-end">
                <div className="relative aspect-[314/399] w-1/2 max-w-[300px] overflow-hidden rounded-2xl">
                  <Image src={p.images[0]} alt="" fill sizes="300px" className="object-cover" />
                </div>
                <div className="relative aspect-[3/2] w-1/2 max-w-[300px] overflow-hidden rounded-2xl">
                  <Image src={p.images[1]} alt="" fill sizes="300px" className="object-cover" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

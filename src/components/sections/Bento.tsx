"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { BentoItem } from "@/data/types";

interface Props {
  id?: string;
  eyebrow: string;
  title: string;
  body?: string;
  items: BentoItem[];
  glow?: string;
}

// Layout for 4 tiles on a 6-col grid: big, tall, wide, small.
const spans = [
  "md:col-span-4 md:row-span-2 min-h-[340px] md:min-h-[520px]",
  "md:col-span-2 md:row-span-2 min-h-[300px]",
  "md:col-span-3 min-h-[260px]",
  "md:col-span-3 min-h-[260px]",
];

/** Bento grid of glass cards, used for "Design that drives growth" and the "Why" sections. */
export function Bento({ id, eyebrow, title, body, items, glow = "bg-pink/30" }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-tile]", {
          y: 80,
          opacity: 0,
          scale: 0.96,
          duration: 1.1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-grid]", start: "top 80%", once: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-tile] img").forEach((img) => {
          gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: img, scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className="section overflow-hidden">
      <div className={`glow left-1/2 top-1/3 h-[520px] w-[720px] -translate-x-1/2 ${glow}`} />
      <div className="container">
        <SectionTitle eyebrow={eyebrow} title={title} body={body} className="mb-14 md:mb-20" />
        <div data-grid className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-6 md:gap-5">
          {items.map((item, i) => (
            <article key={item.title} data-tile className={`glass group flex flex-col justify-end overflow-hidden p-6 md:p-8 ${spans[i % spans.length]}`}>
              {item.image ? (
                <div className="absolute inset-0 -z-0 overflow-hidden rounded-[inherit]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="scale-110 object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
              ) : (
                <span className="absolute right-6 top-6 font-display text-[120px] font-bold leading-none text-white/[0.04]">{i + 1}</span>
              )}
              <div className="relative">
                <span className="mb-4 inline-block font-mono text-xs text-lime">{String(i + 1).padStart(2, "0")}</span>
                <h3 className={`font-semibold leading-tight ${i === 0 ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

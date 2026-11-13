"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { partnershipFrames } from "@/data/logos";

type P = { scale: number; rotation: number; x: number; y: number; zIndex: number };

const desktop: P[] = [
  { scale: 0.8, rotation: -18, x: -20, y: 6, zIndex: 1 },
  { scale: 0.87, rotation: -12, x: -14, y: 3.5, zIndex: 2 },
  { scale: 0.95, rotation: -6, x: -7, y: 1.2, zIndex: 3 },
  { scale: 1, rotation: 0, x: 0, y: 0, zIndex: 10 },
  { scale: 0.95, rotation: 6, x: 7, y: 1.2, zIndex: 3 },
  { scale: 0.87, rotation: 12, x: 14, y: 3.5, zIndex: 2 },
  { scale: 0.8, rotation: 18, x: 20, y: 6, zIndex: 1 },
];
const mobile: P[] = [
  { scale: 0.7756, rotation: -21, x: -15, y: 7.3, zIndex: 1 },
  { scale: 0.8498, rotation: -14, x: -11, y: 4, zIndex: 2 },
  { scale: 0.9346, rotation: -7, x: -6, y: 1.3, zIndex: 3 },
  { scale: 1, rotation: 0, x: 0, y: 0, zIndex: 10 },
  { scale: 0.9346, rotation: 7, x: 6, y: 1.3, zIndex: 3 },
  { scale: 0.8498, rotation: 14, x: 11, y: 4, zIndex: 2 },
  { scale: 0.7756, rotation: 21, x: 15, y: 7.3, zIndex: 1 },
];

function step<T>(w: number, table: [number, T][], fallback: T): T {
  for (const [max, v] of table) if (w <= max) return v;
  return fallback;
}

function computeMap(w: number): P[] {
  const template = window.innerWidth <= 991 ? mobile : desktop;
  const global = step(w, [[340, 0.48], [360, 0.52], [380, 0.56], [414, 0.6], [480, 0.66], [560, 0.72], [640, 0.76], [768, 0.84], [896, 0.88], [1024, 0.92], [1200, 0.95], [1366, 0.98], [1536, 1.06], [1680, 1.1], [1920, 1.14]], 1.18);
  const spread = step(w, [[360, 0.78], [414, 0.84], [560, 0.9], [768, 0.96], [1024, 1.04], [1200, 1.12], [1366, 1.2], [1536, 1.16], [1680, 1.18]], 1.22);
  const rot = step(w, [[1200, 1.08], [1440, 1.12]], 1);
  return template.map((p) => ({ scale: p.scale * global, rotation: p.rotation * rot, x: p.x * spread, y: p.y * global, zIndex: p.zIndex }));
}

/** "Partnerships that deliver results" — fanned photo cards (ported from fanout-cards-interaction.js). */
export function FanoutCards({ title, body }: { title: string; body: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const wrap = root.current?.querySelector<HTMLElement>("[data-fan]");
      if (!wrap || !contextSafe) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-fan-card]", wrap);
      const center = Math.floor(cards.length / 2);

      const mm = gsap.matchMedia();
      mm.add(MQ.reduce, () => {
        // Static fan for reduced motion.
        const map = computeMap(wrap.clientWidth || window.innerWidth);
        cards.forEach((c, i) => gsap.set(c, { x: `${map[i].x}rem`, y: `${map[i].y}rem`, scale: map[i].scale, rotation: map[i].rotation, zIndex: map[i].zIndex }));
      });

      mm.add(MQ.motion, () => {
        let map = computeMap(wrap.clientWidth || window.innerWidth);
        let active: number | null = null;
        let leaveTimer: ReturnType<typeof setTimeout> | null = null;
        let ready = false;

        gsap.set(cards, { x: 0, y: "10rem", scale: 1, rotation: 0, transformOrigin: "center center", force3D: true });
        cards.forEach((el, i) => (el.style.zIndex = String(map[i].zIndex)));

        const toBase = () => {
          cards.forEach((el, i) => {
            el.style.zIndex = String(100 - Math.abs(i - center));
            gsap.to(el, { x: `${map[i].x}rem`, y: `${map[i].y}rem`, scale: map[i].scale, rotation: map[i].rotation, duration: 0.5, ease: "elastic.out(1, 0.75)", overwrite: "auto", delay: Math.abs(i - center) * 0.02 });
          });
        };

        const toIndex = (mid: number) => {
          const last = cards.length - 1;
          cards.forEach((el, i) => {
            const dist = Math.abs(i - mid);
            el.style.zIndex = String(99 - dist);
            const rel = (i - center) / center || 0;
            const closeness = 1 - Math.abs(rel);
            const bias = 1 + 0.2 * Math.max(0, 3 - dist);
            const b = map[i];
            let cfg: gsap.TweenVars;
            if (i === mid) cfg = { y: `${b.y - 2.5}rem`, x: `${b.x}rem`, scale: b.scale * 1.08, rotation: b.rotation };
            else if (i < mid) cfg = { x: `${b.x - 8 * closeness * bias}rem`, y: `${b.y}rem`, scale: b.scale, rotation: b.rotation - 3 / (dist + 1) };
            else {
              const isLast = i === last;
              cfg = { x: `${b.x + (isLast ? 0 : 8 * closeness * bias)}rem`, y: `${b.y + (isLast ? -1 : 0)}rem`, scale: b.scale, rotation: b.rotation + 3 / (dist + 1) };
            }
            gsap.to(el, { ...cfg, duration: 0.5, ease: "elastic.out(1, 0.75)", overwrite: "auto", delay: dist * 0.02 });
          });
        };

        gsap
          .timeline({ scrollTrigger: { trigger: wrap, start: "top 90%", once: true } })
          .to(cards, { y: 0, duration: 0.8, ease: "power2.out", stagger: { amount: 0.5, from: "end" } })
          .to(
            cards,
            {
              x: (i) => `${map[i].x}rem`,
              y: (i) => `${map[i].y}rem`,
              scale: (i) => map[i].scale,
              rotation: (i) => map[i].rotation,
              duration: 1.2,
              ease: "elastic.out(1, 0.75)",
              stagger: { amount: 0.2, from: "center" },
            },
            "-=0.4",
          )
          .add(() => (ready = true));

        const enter = contextSafe((i: number) => {
          if (!ready) return;
          if (leaveTimer) clearTimeout(leaveTimer);
          active = i;
          toIndex(i);
        });
        const leave = contextSafe((i: number) => {
          if (!ready || active !== i) return;
          leaveTimer = setTimeout(() => {
            if (active === i) {
              active = null;
              toBase();
            }
          }, 50);
        });
        const leaveWrap = contextSafe(() => {
          if (!ready) return;
          active = null;
          toBase();
        });
        const onResize = contextSafe(() => {
          map = computeMap(wrap.clientWidth || window.innerWidth);
          if (ready && active === null) toBase();
        });

        const offs = cards.map((c, i) => {
          const e = () => enter(i);
          const l = () => leave(i);
          c.addEventListener("pointerenter", e);
          c.addEventListener("pointerleave", l);
          return () => {
            c.removeEventListener("pointerenter", e);
            c.removeEventListener("pointerleave", l);
          };
        });
        wrap.addEventListener("pointerleave", leaveWrap);
        window.addEventListener("resize", onResize);
        return () => {
          offs.forEach((o) => o());
          wrap.removeEventListener("pointerleave", leaveWrap);
          window.removeEventListener("resize", onResize);
          if (leaveTimer) clearTimeout(leaveTimer);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section overflow-hidden">
      <div className="glow bottom-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 bg-cyan/30" />
      <div className="container">
        <SectionTitle eyebrow="Partnerships" title={title} body={body} align="center" className="mb-16 max-w-4xl md:mb-24" />
      </div>
      <div data-fan className="relative mx-auto flex h-[300px] items-center justify-center sm:h-[380px] md:h-[460px]">
        {partnershipFrames.map((src, i) => (
          <div
            key={i}
            data-fan-card
            className="absolute aspect-[3/4] w-[180px] overflow-hidden rounded-3xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] will-change-transform sm:w-[220px] md:w-[260px]"
          >
            <Image src={src} alt="" fill sizes="260px" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

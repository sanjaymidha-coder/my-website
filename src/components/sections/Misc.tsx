"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Marquee } from "@/components/ui/Marquee";
import { Magnetic } from "@/components/ui/Magnetic";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowUpRight } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/providers/PageTransition";
import type { NavItem, ProcessStep } from "@/data/types";

/** Glass step cards (How We Work / Book-a-call benefits). */
export function StepCards({ id, eyebrow, title, body, steps, numbered = true }: { id?: string; eyebrow: string; title: string; body?: string; steps: ProcessStep[]; numbered?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-card]", { y: 70, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: "[data-cards]", start: "top 82%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} id={id} className="section">
      <div className="glow left-[-10%] top-1/2 h-[400px] w-[520px] bg-cyan/25" />
      <div className="container">
        <SectionTitle eyebrow={eyebrow} title={title} body={body} className="mb-14 md:mb-20" />
        <div data-cards className={`grid gap-4 md:gap-5 ${steps.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {steps.map((s, i) => (
            <article key={s.title} data-card className="glass flex min-h-[260px] flex-col justify-between p-7 md:p-8">
              <span className="font-mono text-sm text-lime">{numbered ? `${String(i + 1).padStart(2, "0")}.` : "—"}</span>
              <div>
                <h3 className="mb-3 text-2xl font-semibold md:text-3xl">{s.title}</h3>
                <p className="text-white/65">{s.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkillsMarquee({ items }: { items: string[] }) {
  return (
    <section aria-label="What we do" className="relative -rotate-2 border-y border-white/10 bg-lime py-5 text-black md:py-7">
      <Marquee duration={36}>
        {items.map((s) => (
          <span key={s} className="mx-6 flex items-center gap-6 font-display text-3xl font-semibold tracking-tight md:mx-10 md:text-5xl">
            {s} <span className="text-2xl">✶</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/** Big CTA over the moon image. */
export function MoonCta({ eyebrow, title, body, cta }: { eyebrow: string; title: string; body: string[]; cta: NavItem }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo("[data-moon]", { yPercent: 25, scale: 1.25 }, { yPercent: -10, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className="relative isolate overflow-hidden py-32 md:py-48">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div data-moon className="absolute inset-0">
          <Image src="/assets/images/moon.webp" alt="" fill sizes="100vw" className="object-cover opacity-70" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
      </div>
      <div className="container text-center">
        <SectionTitle eyebrow={eyebrow} title={title} align="center" className="max-w-5xl" titleClassName="!text-[clamp(2.6rem,7.5vw,7rem)]" />
        <div className="mx-auto mt-8 max-w-2xl space-y-3 text-white/70 md:text-lg">
          {body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-12">
          <Magnetic>
            <TransitionLink href={cta.href} className="btn-primary !px-9 !py-5 text-base">
              <span data-magnetic-label className="flex items-center gap-2">
                {cta.label} <ArrowUpRight />
              </span>
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

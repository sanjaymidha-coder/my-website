"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Check } from "@/components/ui/Icons";
import { ServiceVisual } from "@/components/sections/ServiceVisual";
import type { ServicePage } from "@/data/servicePages";

/** Body of a single service page: hero visual, outcome, what's included, process, deliverables. */
export function ServiceDetail({ service: s }: { service: ServicePage }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(10% 6% 10% 6% round 32px)" },
            { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 40%", scrub: true } },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-group]").forEach((group) => {
          gsap.from(group.querySelectorAll("[data-up]"), {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          });
        });
        gsap.from("[data-visual]", { y: 40, rotate: -3, opacity: 0, duration: 1.2, delay: 0.4, ease: "power4.out" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero image with the service illustration on top */}
      <div className="container">
        <div data-clip className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 md:aspect-[16/8]">
          <Image src={s.heroImage} alt={s.heroAlt} fill priority sizes="(max-width: 1400px) 100vw, 1400px" className="object-cover opacity-60" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${s.color}cc 0%, transparent 55%), linear-gradient(to top, #050505 0%, transparent 60%)` }} />
          <div data-visual className="absolute bottom-6 right-6 w-[58%] max-w-[460px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] md:bottom-10 md:right-10">
            <ServiceVisual slug={s.slug} color={s.color} />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <section aria-label={`${s.name} at a glance`} data-group className="container mt-10 md:mt-14">
        <dl className="grid gap-4 md:grid-cols-3">
          {s.highlights.map((h) => (
            <div key={h.label} data-up className="glass p-6 md:p-8">
              <dt className="sr-only">{h.label}</dt>
              <dd>
                <span className="block font-display text-4xl font-semibold text-lime md:text-5xl">{h.value}</span>
                <span className="mt-2 block text-white/70">{h.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Outcome + gallery */}
      <section className="section">
        <div className="glow right-[-10%] top-1/3 h-[420px] w-[560px]" style={{ backgroundColor: s.color }} />
        <div className="container grid items-center gap-12 lg:grid-cols-12">
          <SectionTitle eyebrow="The outcome" title={s.outcome.title} body={s.outcome.body} className="lg:col-span-6" titleClassName="!text-[clamp(2.2rem,4.5vw,4.25rem)]" />
          <div data-group className="flex items-end gap-4 lg:col-span-6 lg:justify-end">
            <div data-up className="relative aspect-[4/5] w-1/2 max-w-[300px] overflow-hidden rounded-2xl border border-white/10">
              <Image src={s.gallery[0].src} alt={s.gallery[0].alt} fill sizes="(max-width: 768px) 50vw, 300px" className="object-cover" />
            </div>
            <div data-up className="relative aspect-[4/3] w-1/2 max-w-[300px] overflow-hidden rounded-2xl border border-white/10">
              <Image src={s.gallery[1].src} alt={s.gallery[1].alt} fill sizes="(max-width: 768px) 50vw, 300px" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section !pt-0">
        <div className="container">
          <SectionTitle eyebrow="What's included" title={`Everything you get with *${s.name.toLowerCase()}*`} className="mb-14 md:mb-20" />
          <div data-group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {s.included.map((it, i) => (
              <article key={it.title} data-up className="glass flex min-h-[240px] flex-col justify-between p-7 md:p-8">
                <span className="grid h-10 w-10 place-items-center rounded-full font-mono text-sm text-white" style={{ backgroundColor: s.color }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-3 text-2xl font-semibold">{it.title}</h3>
                  <p className="text-white/65">{it.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section !pt-0">
        <div className="container grid gap-12 lg:grid-cols-12">
          <SectionTitle eyebrow="Our process" title="How we get you *there*" className="lg:col-span-4 lg:self-start lg:sticky lg:top-32" />
          <ol data-group className="border-t border-white/10 lg:col-span-8">
            {s.process.map((p, i) => (
              <li key={p.title} data-up className="group grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-b border-white/10 py-7 md:grid-cols-[80px_1fr_1.4fr] md:items-baseline md:py-9">
                <span className="font-mono text-sm text-lime">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl font-semibold transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">{p.title}</h3>
                <p className="col-start-2 text-white/65 md:col-start-3">{p.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section !pt-0">
        <div className="container">
          <div className="glass overflow-hidden p-8 md:p-14">
            <div className="glow -left-20 -top-20 h-[300px] w-[400px]" style={{ backgroundColor: s.color }} />
            <div className="grid gap-10 lg:grid-cols-12">
              <SectionTitle eyebrow="Deliverables" title="What you'll *walk away* with" className="lg:col-span-5" titleClassName="!text-[clamp(2rem,4vw,3.75rem)]" />
              <ul data-group className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-7">
                {s.deliverables.map((d) => (
                  <li key={d} data-up className="flex items-start gap-3 text-white/85">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-black">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

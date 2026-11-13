"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Check } from "@/components/ui/Icons";
import type { Project } from "@/data/types";
import type { CaseStudyExtras } from "@/data/projects";

/** Body of a case-study page: hero image, overview, challenge, what we did, results, gallery. */
export function CaseStudyBody({ project: p, extras }: { project: Project; extras: CaseStudyExtras }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(12% 8% 12% 8% round 32px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 90%", end: "top 35%", scrub: true },
            },
          );
          const img = el.querySelector("img");
          if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.from("[data-up]", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-up]", start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const services = p.services.split(",").map((s) => s.trim()).filter(Boolean);
  const gallery = [p.image, ...extras.gallery];

  return (
    <div ref={root}>
      {/* Hero image */}
      <div className="container">
        <div data-clip className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10">
          <Image
            src={p.image}
            alt={`${p.name} website — ${p.industry}`}
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Facts */}
      <section aria-label="Project facts" className="container mt-10 md:mt-14">
        <dl className="grid gap-4 md:grid-cols-3">
          {[
            ["Industry", p.industry],
            ["Services", p.services],
            ["Audience", p.audience],
          ].map(([k, v]) => (
            <div key={k} data-up className="glass p-6">
              <dt className="eyebrow mb-3">{k}</dt>
              <dd className="text-white/85">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Overview */}
      <section className="section">
        <div className="glow left-[-10%] top-1/3 h-[420px] w-[520px] bg-cyan/25" />
        <div className="container grid gap-10 lg:grid-cols-12">
          <SectionTitle eyebrow="Overview" title="The *project*" className="lg:col-span-5" />
          <p data-up className="text-lg leading-relaxed text-white/75 md:text-xl lg:col-span-7">
            {p.about}
          </p>
        </div>
      </section>

      {/* Challenge / goals */}
      <section className="section pt-0">
        <div className="container grid gap-10 lg:grid-cols-12">
          <SectionTitle eyebrow="The challenge" title="What we set out to *solve*" className="lg:col-span-5" />
          <ul className="grid gap-4 lg:col-span-7">
            {p.details.map((d, i) => (
              <li key={d} data-up className="glass flex gap-5 p-6">
                <span className="font-mono text-sm text-lime">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-white/80">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we did */}
      <section className="section pt-0">
        <div className="container grid gap-10 lg:grid-cols-12">
          <SectionTitle eyebrow="What we did" title="Our *approach*" className="lg:col-span-5" />
          <ul className="flex flex-wrap content-start gap-3 lg:col-span-7">
            {services.map((s) => (
              <li key={s} data-up className="flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-white/85">
                <Check className="h-4 w-4 text-lime" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Results — only shown once real data is added in src/data/projects.ts */}
      {extras.results.length > 0 && (
        <section className="section pt-0">
          <div className="container grid gap-10 lg:grid-cols-12">
            <SectionTitle eyebrow="Results" title="The *outcome*" className="lg:col-span-5" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {extras.results.map((r) => (
                <li key={r} data-up className="glass p-6 text-lg text-white/85">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {extras.testimonial && (
        <section className="section pt-0">
          <figure className="container max-w-4xl text-center">
            <blockquote className="h-display text-[clamp(1.8rem,4vw,3.25rem)] font-medium leading-[1.15]">
              “{extras.testimonial.quote}”
            </blockquote>
            <figcaption className="eyebrow mt-8">
              {extras.testimonial.author} — {extras.testimonial.role}
            </figcaption>
          </figure>
        </section>
      )}

      {/* Gallery */}
      <section aria-label={`${p.name} screenshots`} className="section pt-0">
        <div className={`container grid gap-5 ${gallery.length > 1 ? "md:grid-cols-2" : ""}`}>
          {gallery.map((src, i) => (
            <div key={src + i} data-clip className={`relative overflow-hidden rounded-3xl border border-white/10 ${gallery.length > 1 && i === 0 ? "md:col-span-2 aspect-[16/8]" : "aspect-[4/3] md:aspect-[16/8]"}`}>
              <Image src={src} alt={`${p.name} screenshot ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 1400px" className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

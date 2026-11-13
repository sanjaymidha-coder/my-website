"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowRight } from "@/components/ui/Icons";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { ProjectModal } from "./ProjectModal";
import { TransitionLink } from "@/components/providers/PageTransition";

/**
 * A project card. With `href` it's a real, crawlable link to the case-study page;
 * otherwise (DecoStorePros page) it opens the details modal.
 */
export function ProjectCard({ p, index, onOpen, href }: { p: Project; index: number; onOpen?: (p: Project) => void; href?: string }) {
  const inner = (
    <>
        <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
          <Image
            src={p.image}
            alt={`${p.name} website designed by Codeller`}
            fill
            sizes="(max-width: 768px) 85vw, 42vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85" />
          <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
            <div>
              <h3 className="text-2xl font-semibold md:text-4xl">{p.name}</h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-white/60">{p.tags.join(" · ")}</p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime text-black transition-transform duration-300 group-hover:-rotate-45">
              <ArrowRight />
            </span>
          </div>
        </div>
    </>
  );
  const common = {
    "data-cursor": "card",
    "data-cursor-color": p.cursorColor,
    "data-cursor-text": p.cursorText,
    className: "group block h-full w-full text-left",
  } as const;
  return (
    <TiltCard className="h-full">
      {href ? (
        <TransitionLink href={href} {...common} aria-label={`${p.name} case study`}>
          {inner}
        </TransitionLink>
      ) : (
        <button type="button" onClick={() => onOpen?.(p)} {...common} aria-label={`View ${p.name} project details`}>
          {inner}
        </button>
      )}
    </TiltCard>
  );
}

/**
 * Latest projects.
 * Desktop: pinned horizontal scroll, each card's image revealed with a clip-path as it enters.
 * Mobile / reduced motion: a Swiper carousel.
 */
export function Projects({
  id,
  eyebrow,
  title,
  body,
  caseStudies = false,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body?: string;
  /** Link cards to /work/[slug] (Codeller) instead of opening the modal. */
  caseStudies?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Project | null>(null);
  const close = useCallback(() => setActive(null), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const pin = root.current?.querySelector<HTMLElement>("[data-pin]");
        const track = root.current?.querySelector<HTMLElement>("[data-htrack]");
        if (!pin || !track) return;
        const distance = () => track.scrollWidth - window.innerWidth;

        const scroller = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-hcard]").forEach((card) => {
          const media = card.querySelector("[data-reveal]");
          gsap.fromTo(
            media,
            { clipPath: "inset(0% 0% 0% 100% round 24px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              ease: "power2.out",
              scrollTrigger: { trigger: card, containerAnimation: scroller, start: "left 95%", end: "left 45%", scrub: true },
            },
          );
          gsap.from(card.querySelector("img"), {
            scale: 1.3,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: scroller, start: "left right", end: "right left", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} aria-labelledby={`${id ?? "projects"}-heading`} className="relative">
      <div className="glow left-[-10%] top-40 h-[480px] w-[480px] bg-cyan/40" />

      {/* Desktop pinned horizontal */}
      <div data-pin className="hidden h-[100svh] flex-col justify-center overflow-hidden lg:flex motion-reduce:!hidden">
        <div data-htrack className="flex w-max items-center gap-8 pl-[max(2rem,calc((100vw-1400px)/2+2rem))] pr-[8vw]">
          <div className="w-[34vw] shrink-0 pr-10">
            <SectionTitle id={`${id ?? "projects"}-heading`} eyebrow={eyebrow} title={title} body={body} />
            <p className="eyebrow mt-10 flex items-center gap-3">
              Scroll <ArrowRight />
            </p>
          </div>
          {projects.map((p, i) => (
            <div key={p.id} data-hcard className={`w-[42vw] max-w-[720px] shrink-0 ${i % 2 ? "mt-24" : "-mt-24"}`}>
              <ProjectCard p={p} index={i} onOpen={setActive} href={caseStudies ? `/work/${p.id}` : undefined} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile + reduced motion: Swiper */}
      <div className="py-24 lg:hidden motion-reduce:!block">
        <div className="container mb-10">
          <SectionTitle eyebrow={eyebrow} title={title} body={body} />
        </div>
        <div data-cursor="drag">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.15}
            spaceBetween={16}
            centeredSlides
            loop
            grabCursor
            pagination={{ clickable: true }}
            breakpoints={{ 640: { slidesPerView: 1.6, spaceBetween: 20 }, 1024: { slidesPerView: 2.6, spaceBetween: 24 } }}
            className="!pb-12"
          >
            {projects.map((p, i) => (
              <SwiperSlide key={p.id}>
                <ProjectCard p={p} index={i} onOpen={setActive} href={caseStudies ? `/work/${p.id}` : undefined} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <ProjectModal project={active} onClose={close} />
    </section>
  );
}

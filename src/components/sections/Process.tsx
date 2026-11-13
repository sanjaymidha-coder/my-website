"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ProcessStep } from "@/data/types";

/** Desktop-only ambient video (the 7MB file never loads on mobile). */
function AmbientVideo() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MQ.desktop);
    setShow(mq.matches);
    const on = () => setShow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  if (!show) return null;
  return (
    <video
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12] mix-blend-screen"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      <source src="/assets/images/artistic-video.mp4" type="video/mp4" />
    </video>
  );
}

/**
 * Process: left column (title + live step counter) is pinned on desktop while the steps scroll;
 * a progress line is drawn with the scroll and each step lights up as it passes.
 */
export function Process({ id, eyebrow, title, body, steps }: { id?: string; eyebrow: string; title: string; body: string; steps: ProcessStep[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const steps$ = gsap.utils.toArray<HTMLElement>("[data-step]");
      const counter = root.current?.querySelector<HTMLElement>("[data-counter]");

      mm.add(MQ.desktop, () => {
        ScrollTrigger.create({
          trigger: "[data-steps]",
          start: "top 20%",
          end: "bottom 70%",
          pin: "[data-aside]",
          pinSpacing: false,
        });
      });

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-line]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 60%", end: "bottom 60%", scrub: true } },
        );
        steps$.forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => {
              el.classList.toggle("is-active", self.isActive || self.progress === 1);
              if (self.isActive && counter) counter.textContent = String(i + 1).padStart(2, "0");
            },
            onLeave: () => el.classList.add("is-done"),
            onEnterBack: () => el.classList.remove("is-done"),
          });
        });
      });

      mm.add(MQ.reduce, () => {
        steps$.forEach((el) => el.classList.add("is-active"));
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className="section isolate overflow-hidden">
      <AmbientVideo />
      <div className="glow right-[-15%] top-1/3 h-[520px] w-[520px] bg-lime/25" />
      <div className="container grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div data-aside>
            <SectionTitle eyebrow={eyebrow} title={title} body={body} />
            <div className="mt-12 hidden items-end gap-4 lg:flex" aria-hidden>
              <span data-counter className="font-mono text-[120px] leading-[0.8] text-lime">
                01
              </span>
              <span className="mb-2 font-mono text-sm text-white/40">/ {String(steps.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        <ol data-steps className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10" />
          <span aria-hidden data-line className="absolute bottom-0 left-[19px] top-0 w-px origin-top bg-gradient-to-b from-lime via-lime to-cyan" />
          {steps.map((s, i) => (
            <li
              key={s.title}
              data-step
              className="group relative pb-16 pl-16 last:pb-0 md:pb-24 [&.is-active_.dot]:bg-lime [&.is-active_.dot]:text-black [&.is-active_.dot]:shadow-glow [&.is-active_.body]:opacity-100 [&.is-done_.dot]:bg-lime/80 [&.is-done_.dot]:text-black [&.is-done_.body]:opacity-60"
            >
              <span className="dot absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#0d0d10] font-mono text-sm transition-all duration-500">
                {i + 1}
              </span>
              <div className="body opacity-35 transition-opacity duration-500">
                <h3 className="mb-3 flex flex-wrap items-center gap-3 text-2xl font-semibold md:text-4xl">
                  {s.title}
                  {s.badge && (
                    <span className="rounded-full border border-pink/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-pink">{s.badge}</span>
                  )}
                </h3>
                <p className="max-w-md text-white/65">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

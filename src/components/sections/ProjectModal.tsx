"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { ArrowUpRight, Close } from "@/components/ui/Icons";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { Project } from "@/data/types";

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, lenis, onClose]);

  useGSAP(
    () => {
      if (!project || prefersReducedMotion()) return;
      gsap.from("[data-modal-backdrop]", { opacity: 0, duration: 0.4 });
      gsap.from("[data-modal-card]", { yPercent: 8, opacity: 0, duration: 0.7, ease: "power4.out" });
      gsap.from("[data-modal-image]", { clipPath: "inset(100% 0% 0% 0%)", duration: 1, ease: "power4.inOut" });
    },
    { scope: root, dependencies: [project?.id] },
  );

  if (!project) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90] flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div data-modal-backdrop className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div
        data-modal-card
        data-lenis-prevent
        className="relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0b0b0f] md:m-6 md:rounded-3xl"
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/60 backdrop-blur hover:bg-lime hover:text-black"
        >
          <Close />
        </button>
        <div data-modal-image className="relative aspect-[16/9] overflow-hidden">
          <Image src={project.image} alt={project.name} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
        </div>
        <div className="p-6 md:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 id="modal-title" className="text-4xl font-semibold md:text-5xl">
              {project.name}
            </h2>
            <a href={project.url} target="_blank" rel="noreferrer" className="btn-primary !py-3">
              Visit Site <ArrowUpRight />
            </a>
          </div>
          <div className="mb-8 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
                {t}
              </span>
            ))}
          </div>
          <p className="eyebrow mb-3">01 — About the project</p>
          <p className="mb-8 text-white/75">{project.about}</p>
          <dl className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              ["Industry", project.industry],
              ["Services", project.services],
              ["Audience", project.audience],
            ].map(([k, v]) => (
              <div key={k} className="glass p-5">
                <dt className="eyebrow mb-2">{k}</dt>
                <dd className="text-sm text-white/80">{v}</dd>
              </div>
            ))}
          </dl>
          <h4 className="mb-3 text-xl font-semibold">Project Details</h4>
          <ul className="grid gap-2 text-white/75">
            {project.details.map((d) => (
              <li key={d} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

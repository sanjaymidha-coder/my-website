"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { useSiteLoaded } from "@/lib/loaded";

import { Magnetic } from "@/components/ui/Magnetic";
import { CountUp } from "@/components/ui/CountUp";
import { ArrowUpRight } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/providers/PageTransition";
import type { NavItem, Stat } from "@/data/types";

interface Props {
  eyebrow: string;
  title: string;
  body: string;
  primary: NavItem;
  secondary?: NavItem;
  stats?: Stat[];
  /** Smaller hero for inner pages */
  compact?: boolean;
  children?: React.ReactNode;
}

/**
 * Headline split into words at render time (server HTML), each rising in with a short,
 * staggered CSS animation that starts from a visible state. Supports *accent* words.
 */
function HeroWords({ text }: { text: string }) {
  let i = 0;
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).filter(Boolean).map((part, pi) => {
        const accent = part.startsWith("*") && part.endsWith("*");
        const words = (accent ? part.slice(1, -1) : part).split(/(\s+)/);
        const nodes = words.map((w, wi) =>
          /^\s+$/.test(w) || !w ? (
            w
          ) : (
            <span key={wi} className="hero-word" style={{ ["--i" as string]: i++ }}>
              {w}
            </span>
          ),
        );
        return accent ? (
          <em key={pi} className="accent">
            {nodes}
          </em>
        ) : (
          <span key={pi}>{nodes}</span>
        );
      })}
    </>
  );
}

/** Grainy gradient-mesh hero with a CSS word-by-word headline reveal. */
export function Hero({ eyebrow, title, body, primary, secondary, stats, compact = false, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const loaded = useSiteLoaded();

  // Mesh blobs drift on their own and lean toward the pointer.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const blobs = gsap.utils.toArray<HTMLElement>("[data-blob]");
        blobs.forEach((b, i) => {
          gsap.to(b, {
            xPercent: gsap.utils.random(-18, 18),
            yPercent: gsap.utils.random(-14, 14),
            scale: gsap.utils.random(0.9, 1.15),
            duration: gsap.utils.random(7, 11),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.4,
          });
        });
        const mesh = root.current?.querySelector<HTMLElement>("[data-mesh]");
        if (!mesh) return;
        const xTo = gsap.quickTo(mesh, "x", { duration: 1.6, ease: "power3.out" });
        const yTo = gsap.quickTo(mesh, "y", { duration: 1.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * 60);
          yTo((e.clientY / window.innerHeight - 0.5) * 40);
        };
        window.addEventListener("pointermove", move, { passive: true });

        // Parallax the mesh away as you scroll past the hero.
        gsap.to(mesh, { yPercent: 20, opacity: 0.4, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Supporting copy intro. The headline itself is animated with pure CSS (see HeroWords)
  // so it is painted with the very first HTML — no JS re-render, good for LCP.
  useGSAP(
    () => {
      if (!loaded) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-hero-fade]", { y: 20, opacity: 0.25, duration: 0.6, stagger: 0.06, delay: 0.15 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [loaded] },
  );

  return (
    <section ref={root} className={`relative isolate overflow-hidden ${compact ? "pb-16 pt-40 md:pt-48" : "min-h-[100svh] pb-16 pt-36 md:pt-44"}`}>
      {/* Gradient mesh */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-90">
        <div data-mesh className="absolute inset-[-15%]">
          <div data-blob className="absolute left-[8%] top-[10%] h-[42vw] w-[42vw] rounded-full bg-[#2536DE]/60 blur-[100px]" />
          <div data-blob className="absolute right-[2%] top-[0%] h-[36vw] w-[36vw] rounded-full bg-cyan/50 blur-[110px]" />
          <div data-blob className="absolute bottom-[8%] left-[30%] h-[30vw] w-[30vw] rounded-full bg-lime/35 blur-[110px]" />
          <div data-blob className="absolute bottom-[18%] right-[18%] h-[22vw] w-[22vw] rounded-full bg-pink/30 blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,5,0.55)_88%)]" />
        <div className="absolute inset-0 bg-grain bg-[length:160px] opacity-[0.18] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--bg)]" />
      </div>

      <div className="container flex h-full flex-col">
        <p data-hero-fade className="eyebrow mb-8 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          {eyebrow}
        </p>

        <h1
          className={`h-display max-w-[16ch] ${
            compact ? "text-[clamp(2.6rem,7vw,6.5rem)]" : "text-[clamp(3rem,10vw,10.5rem)]"
          } leading-[0.92]`}
        >
          <HeroWords text={title} />
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <p data-hero-fade className="max-w-xl text-base text-white/70 md:text-xl lg:col-span-6">
            {body}
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-4 lg:col-span-6 lg:justify-end">
            <Magnetic>
              <TransitionLink href={primary.href} className="btn-primary">
                <span data-magnetic-label className="flex items-center gap-2">
                  {primary.label} <ArrowUpRight />
                </span>
              </TransitionLink>
            </Magnetic>
            {secondary && (
              <Magnetic>
                <TransitionLink href={secondary.href} className="btn-ghost">
                  <span data-magnetic-label>{secondary.label}</span>
                </TransitionLink>
              </Magnetic>
            )}
          </div>
        </div>

        {stats && (
          <dl data-hero-fade className="mt-14 grid grid-cols-3 gap-3 md:mt-20 md:max-w-3xl md:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="glass px-4 py-5 md:px-6 md:py-7">
                <dt className="eyebrow mb-2 !text-[10px] md:!text-xs">{s.label}</dt>
                <dd className="font-display text-3xl font-semibold text-lime md:text-6xl">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        )}

        {children}
      </div>
    </section>
  );
}

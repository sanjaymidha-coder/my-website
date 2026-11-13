"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";

interface Props {
  children: ReactNode;
  /** seconds for one full loop at rest */
  duration?: number;
  reverse?: boolean;
  /** react to scroll velocity (speed boost + skew) */
  velocity?: boolean;
  className?: string;
}

/**
 * Infinite marquee. The track holds two copies of the content; GSAP moves it by -50%.
 * When `velocity` is on, scroll speed temporarily boosts timeScale and skews the row.
 */
export function Marquee({ children, duration = 30, reverse = false, velocity = true, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>("[data-track]");
      if (!track) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const dir = reverse ? 1 : -1;
        const tween = gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 },
        );
        if (!velocity) return;
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
        let resetCall: gsap.core.Tween | null = null;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 300);
            // Scrolling up briefly runs the marquee backwards.
            gsap.to(tween, { timeScale: v < 0 ? -boost : boost, duration: 0.2, overwrite: true });
            skewTo(gsap.utils.clamp(-12, 12, (v / -120) * -dir));
            resetCall?.kill();
            resetCall = gsap.delayedCall(0.15, () => {
              gsap.to(tween, { timeScale: 1, duration: 1.2, ease: "power2.out", overwrite: true });
              skewTo(0);
            });
          },
        });
        return () => {
          st.kill();
          resetCall?.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div data-track className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

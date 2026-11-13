"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, SplitText, MQ } from "@/lib/gsap";
import { Accent } from "./Accent";

interface Props {
  eyebrow?: string;
  title: string;
  body?: string;
  as?: ElementType;
  id?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

/** Section heading with a masked line-by-line reveal on scroll. */
export function SectionTitle({ eyebrow, title, body, as: Tag = "h2", id, align = "left", className = "", titleClassName = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const heading = root.current?.querySelector<HTMLElement>("[data-title]");
        if (!heading) return;
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.09,
              ease: "power4.out",
              scrollTrigger: { trigger: heading, start: "top 88%", once: true },
            }),
        });
        gsap.from(root.current!.querySelectorAll("[data-fade]"), {
          y: 24,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <p data-fade className={`eyebrow mb-5 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          {eyebrow}
        </p>
      )}
      <Tag id={id} data-title className={`h-display text-[clamp(2.4rem,6vw,5.5rem)] ${titleClassName}`}>
        <Accent text={title} />
      </Tag>
      {body && (
        <p data-fade className={`mt-6 max-w-2xl text-base text-white/65 md:text-lg ${align === "center" ? "mx-auto" : ""}`}>
          {body}
        </p>
      )}
    </div>
  );
}

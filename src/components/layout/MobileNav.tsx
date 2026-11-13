"use client";

import { useEffect, useRef } from "react";
import { TransitionLink } from "@/components/providers/PageTransition";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Close } from "@/components/ui/Icons";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useBrand } from "@/lib/useBrand";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { brand } = useBrand();
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis, onClose]);

  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return;
      gsap.from("[data-mnav-item]", { yPercent: 110, duration: 0.7, stagger: 0.05, ease: "power4.out", delay: 0.15 });
    },
    { scope: root, dependencies: [open] },
  );

  const items = [...brand.nav, brand.cta];

  return (
    <div
      ref={root}
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] bg-navy/95 backdrop-blur-xl transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] lg:hidden ${
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
      }`}
    >
      <div className="container flex h-full flex-col pb-10 pt-6">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Menu</span>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full border border-white/15" aria-label="Close menu">
            <Close />
          </button>
        </div>
        <nav className="mt-14 flex flex-1 flex-col gap-2" aria-label="Mobile">
          {items.map((item, i) => (
            <div key={item.href + i} className="overflow-hidden">
              <TransitionLink
                href={item.href}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                data-mnav-item
                className="flex items-baseline gap-4 py-1 font-display text-[11vw] font-semibold leading-[1.05] tracking-tight sm:text-6xl"
              >
                <span className="font-mono text-xs text-lime">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </TransitionLink>
            </div>
          ))}
        </nav>
        <div className="space-y-1 text-sm text-white/60">
          <a href={`mailto:${brand.email}`} className="block hover:text-lime">
            {brand.email}
          </a>
          <a href={`tel:${brand.phone.replace(/[^+\d]/g, "")}`} className="block hover:text-lime">
            {brand.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

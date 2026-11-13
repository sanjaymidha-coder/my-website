"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/providers/PageTransition";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowUpRight } from "@/components/ui/Icons";
import { useBrand } from "@/lib/useBrand";
import { MobileNav } from "./MobileNav";

/** Sticky header: hides on scroll down, reappears on scroll up, glassy once scrolled. */
export function Header() {
  const { brand } = useBrand();
  const [hidden, setHidden] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 24);
      if (Math.abs(y - last.current) > 6) {
        setHidden(y > last.current && y > 160);
        last.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-black">
        Skip to main content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`container mt-3 flex h-[64px] items-center justify-between gap-6 rounded-full px-4 transition-all duration-500 md:px-6 ${
            stuck ? "border border-white/10 bg-black/40 backdrop-blur-xl" : "border border-transparent"
          }`}
        >
          <TransitionLink href={brand.home} aria-label={`${brand.name} home`} className="shrink-0">
            {brand.name === "Codeller" ? (
              <Image src={brand.logo} alt={brand.name} width={150} height={28} priority className="h-6 w-auto md:h-7" />
            ) : (
              <span className="font-display text-xl font-semibold tracking-tight">
                Deco<em className="accent text-lime">Store</em>Pros
              </span>
            )}
          </TransitionLink>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {brand.nav.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                data-cursor-small
                className="group rounded-full px-4 py-2 text-sm text-white/75 transition-colors hover:text-white"
              >
                {/* Clip only the text line (not the padding) so just one label is ever visible. */}
                <span className="relative block overflow-hidden leading-5">
                  <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                    {item.label}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 block translate-y-full text-lime transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0"
                  >
                    {item.label}
                  </span>
                </span>
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:inline-block">
              <TransitionLink href={brand.cta.href} className="btn-primary !px-5 !py-3 text-sm">
                <span data-magnetic-label className="flex items-center gap-2">
                  {brand.cta.label} <ArrowUpRight />
                </span>
              </TransitionLink>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span className="h-px w-full bg-white" />
                <span className="h-px w-3/4 bg-white" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}

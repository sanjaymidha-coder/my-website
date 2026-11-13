"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowRight, Plus } from "@/components/ui/Icons";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { useBrand } from "@/lib/useBrand";

function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("cookie:open"));
}

export function Footer() {
  const { brand } = useBrand();
  const root = useRef<HTMLElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-wordmark] span", {
          yPercent: 100,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-wordmark]", start: "top 95%" },
        });
      });
      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root, dependencies: [brand.wordmark], revertOnUpdate: true },
  );

  // Newsletter has no backend in the original site; keep the UI and confirm locally.
  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) setSubscribed(true);
  };

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-white/10 bg-black pt-20 md:pt-28">
      <div aria-hidden className="absolute inset-0 -z-0 bg-footer-bg bg-cover bg-center opacity-30" />
      <div className="glow -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 bg-lime/40" />

      <div className="container relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {brand.name === "Codeller" ? (
            <Image src={brand.logo} alt={brand.name} width={183} height={34} className="mb-8 h-8 w-auto" />
          ) : (
            <span className="mb-8 block font-display text-2xl font-semibold">
              Deco<em className="accent text-lime">Store</em>Pros
            </span>
          )}
          <h3 className="mb-3 max-w-md text-2xl font-medium md:text-3xl">{brand.newsletter.title}</h3>
          <p className="mb-6 max-w-md text-white/60">{brand.newsletter.body}</p>
          {subscribed ? (
            <p className="glass inline-block px-5 py-4 text-lime" role="status">
              Thanks — you&apos;re on the list.
            </p>
          ) : (
            <form onSubmit={onSubscribe} className="grid max-w-md gap-3 sm:grid-cols-2" aria-label="Newsletter signup">
              <label className="sr-only" htmlFor="nl-first">First Name</label>
              <input id="nl-first" name="firstName" placeholder="First Name" className="input" autoComplete="given-name" />
              <label className="sr-only" htmlFor="nl-last">Last Name</label>
              <input id="nl-last" name="lastName" placeholder="Last Name" className="input" autoComplete="family-name" />
              <label className="sr-only" htmlFor="nl-email">Email Address</label>
              <div className="relative sm:col-span-2">
                <input id="nl-email" name="email" type="email" required placeholder="Email Address" className="input pr-16" autoComplete="email" />
                <button type="submit" aria-label="Subscribe" className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-lime text-black transition hover:bg-white">
                  <ArrowRight />
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-3 sm:gap-10 lg:col-span-7">
          {brand.footerColumns.map((col, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={col.title} className="border-b border-white/10 sm:border-0">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 text-left sm:pointer-events-none sm:py-0"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                >
                  <span className="eyebrow">{col.title}</span>
                  <Plus className={`h-4 w-4 transition-transform sm:hidden ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <ul className={`grid gap-3 overflow-hidden text-white/70 transition-all duration-500 sm:mt-5 sm:max-h-none sm:pb-0 ${isOpen ? "max-h-96 pb-5" : "max-h-0 sm:max-h-none"}`}>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <TransitionLink href={l.href} data-cursor-small className="transition-colors hover:text-lime">
                        {l.label}
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="pt-6 sm:pt-0">
            <span className="eyebrow">Get in Touch</span>
            <ul className="mt-5 grid gap-3 text-white/70">
              <li>
                <a href={`mailto:${brand.email}`} data-cursor-small className="hover:text-lime">{brand.email}</a>
              </li>
              <li>
                <a href={`tel:${brand.phone.replace(/[^+\d]/g, "")}`} data-cursor-small className="hover:text-lime">{brand.phone}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container relative mt-20 flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          Copyright © {brand.year} {brand.name} - All Rights Reserved.
        </p>
        <button type="button" onClick={openCookieSettings} className="font-mono hover:text-lime">
          Cookie Settings
        </button>
      </div>

      <div data-wordmark aria-hidden className="relative select-none overflow-hidden px-2 pb-2 leading-[0.78]">
        <p className="flex justify-center whitespace-nowrap font-display font-bold tracking-[-0.06em] text-white/[0.92]" style={{ fontSize: `${Math.min(19, 160 / brand.wordmark.length)}vw` }}>
          {brand.wordmark.split("").map((ch, i) => (
            <span key={i} className="inline-block">
              {ch}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}

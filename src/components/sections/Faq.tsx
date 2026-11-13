"use client";

import { useState } from "react";
import { Plus } from "@/components/ui/Icons";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Faq as FaqItem } from "@/data/types";

export function Faq({ id, title, body, items }: { id?: string; title: string; body: string; items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id={id} className="section">
      <div className="glow right-0 top-20 h-[360px] w-[460px] bg-pink/25" />
      <div className="container grid gap-12 lg:grid-cols-12">
        <SectionTitle eyebrow="FAQ" title={title} body={body} className="lg:col-span-5" />
        <div className="lg:col-span-7">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.question} className={`glass mb-3 overflow-hidden !rounded-2xl ${isOpen ? "!border-lime/40" : ""}`}>
                <h3 className="!font-sans !tracking-normal">
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-medium md:text-lg"
                  >
                    {f.question}
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-500 ${isOpen ? "rotate-45 border-lime bg-lime text-black" : ""}`}>
                      <Plus />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-white/65">{f.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

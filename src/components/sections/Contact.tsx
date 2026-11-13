import { SectionTitle } from "@/components/ui/SectionTitle";
import { Check } from "@/components/ui/Icons";
import type { BrandConfig } from "@/data/site";
import { ContactForm } from "./ContactForm";

export function Contact({ brandKey, brand, defaultSubject, title }: { brandKey: string; brand: BrandConfig; defaultSubject?: string; title?: string }) {
  const c = brand.contact;
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section">
      <div className="glow left-[-10%] top-1/4 h-[520px] w-[520px] bg-lime/25" />
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle id="contact-heading" eyebrow="Contact" title={title ?? c.title} body={c.body} />
          <ul className="mt-10 grid gap-4">
            {c.bullets.map((b) => (
              <li key={b} className="flex items-center gap-4 text-white/80">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime/15 text-lime">
                  <Check />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <ContactForm subjects={c.subjects} budgets={c.budgets} brand={brandKey} defaultSubject={defaultSubject} />
        </div>
      </div>
    </section>
  );
}

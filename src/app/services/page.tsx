import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/Hero";
import { Bento } from "@/components/sections/Bento";
import { ServicePanels } from "@/components/sections/ServicePanels";
import { MoonCta } from "@/components/sections/Misc";
import { servicesWhyItems } from "@/data/site";
import { servicePanels } from "@/data/services";

export const metadata: Metadata = {
  title: { absolute: "UX & Digital Product Design Services | Codeller" },
  description:
    "Our services combine senior-level UX expertise with practical design that improves usability, engagement, and conversion.",
};

export default function ServicesPage() {
  return (
    <>
      <Hero
        compact
        eyebrow="Services"
        title="Clarity, usability, and design that *performs*"
        body="Codeller helps organisations experiences that feel effortless to use and meaningful to the business. Our services combine senior-level UX expertise with practical design that improves usability, engagement, and conversion."
        primary={{ label: "Book a Call", href: "/book-a-call" }}
        secondary={{ label: "Contact Us", href: "/#contact" }}
      >
        <div className="glass relative mt-16 aspect-video overflow-hidden md:mt-24">
          <Image src="/assets/images/webdev.webp" alt="Web design work by Codeller" fill priority sizes="(max-width: 1400px) 100vw, 1400px" className="object-cover" />
        </div>
      </Hero>

      <Bento eyebrow="Benefits" title="Why teams work with *Codeller*" items={servicesWhyItems} glow="bg-[#6224D0]/40" />

      <ServicePanels panels={servicePanels} />

      <MoonCta
        eyebrow="Let’s talk"
        title="UX design that turns complexity into *clarity*"
        body={["Let’s talk about how Codeller can help improve usability, increase engagement, and drive measurable outcomes."]}
        cta={{ label: "Book a Call", href: "/book-a-call" }}
      />
    </>
  );
}

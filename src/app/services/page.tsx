import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/Hero";
import { Bento } from "@/components/sections/Bento";
import { ServicePanels } from "@/components/sections/ServicePanels";
import { MoonCta } from "@/components/sections/Misc";
import { servicesWhyItems } from "@/data/site";
import { servicePanels } from "@/data/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "UX Design & Product Design Services",
  description:
    "Senior UX design, design systems and ongoing product design support for startups and growing teams. Improve usability, engagement and conversion.",
  path: "/services",
});

const servicesJsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]),
  ...servicePanels.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.body,
    serviceType: s.items.join(", "),
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "Country", name: "United States" },
    url: absoluteUrl("/services"),
  })),
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesJsonLd} />
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

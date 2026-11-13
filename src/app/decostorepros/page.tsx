import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Projects } from "@/components/sections/Projects";
import { ServicesList } from "@/components/sections/ServicesList";
import { Bento } from "@/components/sections/Bento";
import { FanoutCards } from "@/components/sections/FanoutCards";
import { Process } from "@/components/sections/Process";
import { StepCards, SkillsMarquee, MoonCta } from "@/components/sections/Misc";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { brands, decoStats, decoWhyItems } from "@/data/site";
import { decoServices, decoSkills } from "@/data/services";
import { decoProcess, howWeWork } from "@/data/process";
import { decoFaqs } from "@/data/faqs";

// Separate business from Codeller: keep it out of Codeller's search presence.
export const metadata: Metadata = {
  title: { absolute: "DecoStorePros - Custom Apparel Website Experts" },
  robots: { index: false, follow: false },
  openGraph: { siteName: "DecoStorePros", title: "DecoStorePros - Custom Apparel Website Experts" },
  description:
    "Specialising in DecoNetwork-powered stores — we design, build, and optimise custom apparel websites that look professional, convert visitors, and help your business dominate online.",
};

export default function DecoStoreProsPage() {
  const brand = brands.deco;
  return (
    <>
      <Hero
        eyebrow="DecoNetwork specialists"
        title="We Build Custom Apparel Websites That *Compete* With Custom Ink."
        body="Specialising in DecoNetwork-powered stores — we design, build, and optimise custom apparel websites that look professional, convert visitors, and help your business dominate online."
        primary={{ label: "Get Your Free Audit", href: "/decostorepros#contact" }}
        secondary={{ label: "View Our Work", href: "/decostorepros#results" }}
        stats={decoStats}
      >
        <LogoMarquee label="Trusted by apparel businesses across the globe" />
      </Hero>

      <Projects
        id="results"
        eyebrow="Results"
        title="Real Clients. *Real* Results."
        body="Custom apparel stores we've designed and built — each one built to sell."
      />

      <ServicesList id="services" rowA={["What We Build", "Our Services"]} items={decoServices} />

      <Bento
        id="why-us"
        eyebrow="Why us"
        title="Not Just Another Freelancer. Your *Growth* Partner."
        body="We specialise exclusively in custom apparel websites. That means deep expertise, faster builds, and stores that are optimised to compete — and win."
        items={decoWhyItems}
        glow="bg-cyan/25"
      />

      <FanoutCards
        title="Partnerships that deliver *results*"
        body="DecoStorePros works with apparel businesses who want to dominate online. From new stores to full redesigns, we turn DecoNetwork into a high-performing sales machine."
      />

      <Process
        id="process"
        eyebrow="Process"
        title="A Proven Process. *Predictable* Results."
        body="From kickoff to go-live, every step is designed to move fast, stay on brief, and deliver a store that actually performs."
        steps={decoProcess}
      />

      <StepCards
        id="how-we-work"
        eyebrow="How We Work"
        title="A clear process, designed for *real* progress"
        body="We believe the best partnerships are built on focus and trust. Our process keeps projects moving without losing depth or detail."
        steps={howWeWork}
      />

      <SkillsMarquee items={decoSkills} />

      <MoonCta
        eyebrow="Ready to dominate online?"
        title="Your Competitors Have Custom Ink Envy. Now You Can *Too.*"
        body={["Stop losing customers to polished competitors. Let’s build you a custom apparel store that looks premium, sells harder, and runs on DecoNetwork."]}
        cta={{ label: "Get Your Free Audit", href: "/decostorepros#contact" }}
      />

      <Faq id="faq" title="Frequently Asked *Questions*" body="Everything you need to know before getting started." items={decoFaqs} />

      <Contact brandKey="deco" brand={brand} />
    </>
  );
}

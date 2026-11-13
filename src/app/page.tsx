import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Projects } from "@/components/sections/Projects";
import { ServicesList } from "@/components/sections/ServicesList";
import { Bento } from "@/components/sections/Bento";
import { FanoutCards } from "@/components/sections/FanoutCards";
import { Process } from "@/components/sections/Process";
import { StepCards, SkillsMarquee, MoonCta } from "@/components/sections/Misc";
import { Contact } from "@/components/sections/Contact";
import { brands, growthItems } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, pageMetadata, professionalServiceJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Codeller | UX & Web Design Agency for Startups",
  absoluteTitle: true,
  description:
    "Codeller is a UX and web design agency helping startups and growing teams turn complex ideas into clear, high-converting websites and digital products.",
  path: "/",
});
import { codellerServices, codellerSkills } from "@/data/services";
import { codellerProcess, howWeWork } from "@/data/process";

export default function HomePage() {
  const brand = brands.codeller;
  return (
    <>
      <JsonLd data={[organizationJsonLd, websiteJsonLd, professionalServiceJsonLd]} />
      <Hero
        eyebrow="Digital product agency"
        title="We design and build products people *instantly* understand."
        body="We help startups and growing teams turn complex ideas into clear, high-performing digital experiences — from UX strategy to production-ready development."
        primary={{ label: "Start a project", href: "/#contact" }}
        secondary={{ label: "Book a Call", href: "/book-a-call" }}
      >
        <LogoMarquee label="Previously worked with" />
      </Hero>

      <Projects id="work" eyebrow="Selected work" title="Our *Latest* projects" caseStudies />

      <ServicesList id="services" rowA={["What We Do", "Our Services"]} items={codellerServices} />

      <Bento
        id="growth"
        eyebrow="Why Codeller"
        title="Design That Drives *Measurable* Growth"
        body="We help teams make design work harder for the business — faster decisions, stronger outcomes, and user experiences that scale with you."
        items={growthItems}
      />

      <FanoutCards
        title="Partnerships that deliver *results*"
        body="Codeller works with businesses who view design as a driver of growth. From early-stage startups to established brands, we turn strategy into design that performs and creates lasting impact."
      />

      <Process
        id="process"
        eyebrow="Our process"
        title="Our *process*"
        body="From concept to launch, we craft user-friendly, visually striking websites tailored to your brand."
        steps={codellerProcess}
      />

      <StepCards
        id="how-we-work"
        eyebrow="How We Work"
        title="A clear process, designed for *real* progress"
        body="We believe the best partnerships are built on focus and trust. Our process keeps projects moving without losing depth or detail."
        steps={howWeWork}
      />

      <SkillsMarquee items={codellerSkills} />

      <MoonCta
        eyebrow="Have a project in mind?"
        title="Let’s build something that works in the *real* world."
        body={[
          "We help teams design and develop websites and digital products that are clear, scalable, and ready for real users.",
          "From first concept to launch, we focus on making things simple, usable, and built to last.",
        ]}
        cta={{ label: "Start a project", href: "/#contact" }}
      />

      <Contact brandKey="codeller" brand={brand} />
    </>
  );
}

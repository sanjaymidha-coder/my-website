import { Hero } from "@/components/sections/Hero";
import { MoonCta } from "@/components/sections/Misc";
import { ProjectCard } from "@/components/sections/Projects";
import { JsonLd } from "@/components/seo/JsonLd";
import { projects } from "@/data/projects";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Case Studies: Web Design & UX Projects",
  description:
    "See how Codeller designs and builds high-converting websites and digital products for SaaS, B2B, Web3, travel and consumer brands. Browse our case studies.",
  path: "/work",
});

export default function WorkPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Codeller case studies",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/work/${p.id}`),
        name: p.name,
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero
        compact
        eyebrow="Our work"
        title="Websites and products that *perform*"
        body="A selection of brand sites, SaaS platforms and Web3 products we've designed and built for startups and growing teams."
        primary={{ label: "Start a project", href: "/#contact" }}
        secondary={{ label: "Book a Call", href: "/book-a-call" }}
      />
      <section aria-label="Case studies" className="container grid gap-6 pb-24 md:grid-cols-2 md:gap-8 md:pb-36">
        {projects.map((p, i) => (
          <div key={p.id} className={i % 2 ? "md:mt-24" : ""}>
            <ProjectCard p={p} index={i} href={`/work/${p.id}`} />
          </div>
        ))}
      </section>
      <MoonCta
        eyebrow="Have a project in mind?"
        title="Your project could be *next*."
        body={["We help teams design and develop websites and digital products that are clear, scalable, and ready for real users."]}
        cta={{ label: "Start a project", href: "/#contact" }}
      />
    </>
  );
}

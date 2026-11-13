import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { CaseStudyBody } from "@/components/sections/CaseStudy";
import { MoonCta } from "@/components/sections/Misc";
import { JsonLd } from "@/components/seo/JsonLd";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowRight } from "@/components/ui/Icons";
import { caseStudyExtras, caseStudyMeta, getProject, projects } from "@/data/projects";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.id }));
}
export const dynamicParams = false;

const shortIndustry = (industry: string) => industry.split("/")[0].trim();

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  // Keep the full title (with " | Codeller") within ~60 characters.
  const long = `${p.name} Case Study: ${p.tags[0]} Website`;
  const title = long.length + 11 > 60 ? `${p.name} Case Study: ${p.tags[0]}` : long;
  const description = caseStudyMeta[p.id] ?? p.about.slice(0, 150);
  return pageMetadata({ title, description, path: `/work/${p.id}` });
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.findIndex((x) => x.id === p.id);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const extras = caseStudyExtras[p.id] ?? { results: [], testimonial: null, gallery: [] };

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
      { name: p.name, path: `/work/${p.id}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: `${p.name} website`,
      headline: `${p.name} Case Study`,
      description: p.about,
      url: absoluteUrl(`/work/${p.id}`),
      image: absoluteUrl(p.image),
      genre: p.industry,
      keywords: p.tags.join(", "),
      inLanguage: "en-US",
      creator: { "@id": `${SITE_URL}/#organization` },
      audience: { "@type": "Audience", audienceType: p.audience },
      sameAs: p.url,
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero
        compact
        eyebrow={`Case study — ${p.tags.join(" · ")}`}
        title={`${p.name}: *${shortIndustry(p.industry)}*`}
        body={p.details[0]}
        primary={{ label: "Visit site", href: p.url }}
        secondary={{ label: "All work", href: "/work" }}
      />

      <CaseStudyBody project={p} extras={extras} />

      {/* Prev / next */}
      <nav aria-label="More case studies" className="container grid gap-4 pb-24 md:grid-cols-2">
        {[
          { label: "Previous project", item: prev },
          { label: "Next project", item: next },
        ].map(({ label, item }) => (
          <TransitionLink
            key={label}
            href={`/work/${item.id}`}
            className="glass group flex items-center gap-5 overflow-hidden p-4 pr-6"
            data-cursor="card"
            data-cursor-color={item.cursorColor}
            data-cursor-text={item.cursorText}
          >
            <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl">
              <Image src={item.image} alt="" fill sizes="112px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
            </span>
            <span className="flex-1">
              <span className="eyebrow block">{label}</span>
              <span className="mt-1 block text-2xl font-semibold">{item.name}</span>
            </span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </TransitionLink>
        ))}
      </nav>

      <MoonCta
        eyebrow="Have a project in mind?"
        title="Let’s build something that works in the *real* world."
        body={["Tell us what you're working on, and a senior designer will get back to you within 24 hours."]}
        cta={{ label: "Start a project", href: "/#contact" }}
      />
    </>
  );
}

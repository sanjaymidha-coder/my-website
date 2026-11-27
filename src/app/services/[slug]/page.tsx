import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { Faq } from "@/components/sections/Faq";
import { MoonCta } from "@/components/sections/Misc";
import { JsonLd } from "@/components/seo/JsonLd";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowRight } from "@/components/ui/Icons";
import { getServicePage, servicePages } from "@/data/servicePages";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return servicePages.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getServicePage(slug);
  if (!s) return {};
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getServicePage(slug);
  if (!s) notFound();
  const others = servicePages.filter((x) => x.slug !== s.slug);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: s.name, path: `/services/${s.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.name,
      description: s.metaDescription,
      serviceType: s.included.map((i) => i.title).join(", "),
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: { "@type": "Country", name: "United States" },
      url: absoluteUrl(`/services/${s.slug}`),
      image: absoluteUrl(s.heroImage),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero
        compact
        eyebrow={`Services — ${s.name}`}
        title={s.headline}
        body={s.intro}
        primary={{ label: "Book a Call", href: "/book-a-call" }}
        secondary={{ label: "All services", href: "/services" }}
      />

      <ServiceDetail service={s} />

      <Faq id="faq" title={`${s.name} *questions*`} body={`Quick answers about our ${s.name.toLowerCase()} service. Still unsure? Book a call and ask us directly.`} items={s.faqs} />

      {/* Other services */}
      <nav aria-label="Other services" className="container pb-24">
        <p className="eyebrow mb-6">Explore other services</p>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((o) => (
            <TransitionLink key={o.slug} href={`/services/${o.slug}`} className="glass group flex items-center gap-5 overflow-hidden p-4 pr-6">
              <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl">
                <Image src={o.heroImage} alt="" fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="flex-1 text-2xl font-semibold">{o.name}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </TransitionLink>
          ))}
        </div>
      </nav>

      <MoonCta eyebrow="Let’s talk" title={s.cta.title} body={[s.cta.body]} cta={{ label: "Book a Call", href: "/book-a-call" }} />
    </>
  );
}

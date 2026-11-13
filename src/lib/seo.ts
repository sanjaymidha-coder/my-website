import type { Metadata } from "next";
import { brands } from "@/data/site";

/** Canonical origin of the Codeller site (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://codeller.com").replace(/\/+$/, "");
export const SITE_NAME = "Codeller";

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Per-page metadata with canonical URL, Open Graph and Twitter cards (US English). */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

const codeller = brands.codeller;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl(codeller.logo),
  email: codeller.email,
  telephone: codeller.phone,
};

export const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  image: absoluteUrl("/opengraph-image"),
  logo: absoluteUrl(codeller.logo),
  email: codeller.email,
  telephone: codeller.phone,
  description:
    "UX design, web design and product design agency helping startups and growing teams build clear, high-performing websites and digital products.",
  areaServed: { "@type": "Country", name: "United States" },
  knowsAbout: ["UX design", "Web design", "Web development", "Product design", "Design systems", "Branding"],
  parentOrganization: { "@id": `${SITE_URL}/#organization` },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

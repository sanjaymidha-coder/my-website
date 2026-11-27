import { getServicePage, servicePages } from "@/data/servicePages";
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Codeller service";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getServicePage(slug);
  return renderOg({ eyebrow: "Services", title: s ? s.name : "Our services", accent: s ? "by Codeller" : undefined });
}

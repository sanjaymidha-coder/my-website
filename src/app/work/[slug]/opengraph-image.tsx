import { getProject, projects } from "@/data/projects";
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Codeller case study";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return renderOg({
    eyebrow: "Case study",
    title: p ? p.name : "Our work",
    accent: p ? p.industry.split("/")[0].trim() : undefined,
  });
}

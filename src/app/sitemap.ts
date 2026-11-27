import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { servicePages } from "@/data/servicePages";
import { absoluteUrl } from "@/lib/seo";

// /decostorepros is a separate business and is intentionally not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...servicePages.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    { url: absoluteUrl("/work"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/work/${p.id}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/book-a-call"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];
}

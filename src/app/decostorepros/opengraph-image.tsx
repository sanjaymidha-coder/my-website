import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "DecoStorePros — custom apparel website experts";

// Separate brand: no Codeller branding on this share card.
export default function Image() {
  return renderOg({
    eyebrow: "DecoNetwork specialists",
    title: "Custom apparel websites that",
    accent: "compete",
    brand: "DECOSTOREPROS",
    tagline: "Design · Build · Optimize",
  });
}

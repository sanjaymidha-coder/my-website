import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Codeller case studies";

export default function Image() {
  return renderOg({ eyebrow: "Case studies", title: "Websites and products that", accent: "perform" });
}

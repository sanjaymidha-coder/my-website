import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Codeller UX and web design services";

export default function Image() {
  return renderOg({ eyebrow: "Services", title: "UX & web design that", accent: "performs" });
}

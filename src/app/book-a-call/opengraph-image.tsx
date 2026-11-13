import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Book a call with Codeller";

export default function Image() {
  return renderOg({ eyebrow: "Book a call", title: "Let's talk about your", accent: "project" });
}

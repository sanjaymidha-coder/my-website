import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Codeller — UX and web design agency";

export default function Image() {
  return renderOg({ eyebrow: "UX & web design agency", title: "We design products people", accent: "instantly understand" });
}

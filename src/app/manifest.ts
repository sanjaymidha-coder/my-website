import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Codeller — UX & Web Design Agency",
    short_name: "Codeller",
    description: "UX, web and product design for startups and growing teams.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [{ src: "/assets/images/logo.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

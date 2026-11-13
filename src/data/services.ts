import type { ServiceItem } from "./types";

export const codellerServices: ServiceItem[] = [
  { title: "Web design", image: "/assets/images/webdev.webp", href: "/services" },
  { title: "Logo design", image: "/assets/images/kickoff-img1.webp", href: "/services" },
  { title: "SEO", image: "/assets/images/dashboard.webp", href: "/services" },
  { title: "Marketing", image: "/assets/images/design-growth/higher-conversion.webp", href: "/services" },
];

export const decoServices: ServiceItem[] = [
  { title: "Custom Apparel Website Design", image: "/assets/images/webdev.webp", href: "/decostorepros#contact" },
  { title: "DecoNetwork Setup & Integration", image: "/assets/images/dashboard.webp", href: "/decostorepros#contact" },
  { title: "eCommerce & Checkout Optimisation", image: "/assets/images/design-growth/higher-conversion.webp", href: "/decostorepros#contact" },
  { title: "SEO & Performance Optimisation", image: "/assets/images/design-growth/design-systems.webp", href: "/decostorepros#contact" },
  { title: "Third-Party App Integrations", image: "/assets/images/kickoff-img2.webp", href: "/decostorepros#contact" },
  { title: "Ongoing Support & Maintenance", image: "/assets/images/design-growth/senior-designers.webp", href: "/decostorepros#contact" },
];

export const codellerSkills = [
  "Web Design",
  "Web Development",
  "Product Design",
  "Mobile Apps Design",
  "Branding Identity",
  "Web Optimizations",
  "Email Marketing",
  "Digital Marketing",
];

export const decoSkills = [
  "Custom Apparel Websites",
  "DecoNetwork Setup",
  "eCommerce Design",
  "App Integrations",
  "SEO Optimisation",
  "Custom Ink Competitor",
  "Checkout Optimisation",
  "Ongoing Support",
];

export interface ServicePanel {
  title: string;
  body: string;
  items: string[];
  color: string;
  images: [string, string];
}

/** Services page — pinned stacked panels */
export const servicePanels: ServicePanel[] = [
  {
    title: "UX and Experience Design",
    body: "We design digital experiences that are intuitive, clear, and grounded in user needs. Our UX work helps organisations remove friction, reduce confusion, and create pathways that convert.",
    items: ["User Experience", "User-Centred Design", "Usability & Clarity", "Conversion-Focused UX", "Usability & Testing"],
    color: "#2536DE",
    images: ["/assets/images/webdev.webp", "/assets/images/kickoff-img1.webp"],
  },
  {
    title: "Design Systems and Interface Clarity",
    body: "Codeller builds and refines design systems that make design faster and more consistent. From UI libraries to scalable design standards, we help organisations stay aligned and ready to grow.",
    items: ["Design Systems", "UI Libraries", "Reusable Components", "Interface Clarity", "Scalable Design"],
    color: "#513CE7",
    images: ["/assets/images/design-growth/design-systems.webp", "/assets/images/dashboard.webp"],
  },
  {
    title: "Ongoing UX Partnership and Delivery Support",
    body: "We provide ongoing UX and design support for organisations that need flexibility and senior oversight. This gives you access to consistent design quality without expanding internal headcount",
    items: [
      "User Journeys & Flows",
      "Behaviour Tracking & Insights",
      "Data-driven UX Decisions",
      "UX/CRO Optimisation & Iteration",
      "Research & Validation",
    ],
    color: "#7A68FF",
    images: ["/assets/images/design-growth/senior-designers.webp", "/assets/images/kickoff-img2.webp"],
  },
];

import type { Brand, NavItem, BentoItem, Stat } from "./types";

export interface BrandConfig {
  name: string;
  wordmark: string;
  logo: string;
  email: string;
  phone: string;
  year: number;
  home: string;
  nav: NavItem[];
  cta: NavItem;
  footerColumns: { title: string; links: NavItem[] }[];
  newsletter: { title: string; body: string };
  contact: {
    title: string;
    body: string;
    bullets: string[];
    subjects: string[];
    budgets: string[];
  };
}

export const brands: Record<Brand, BrandConfig> = {
  codeller: {
    name: "Codeller",
    wordmark: "CODELLER",
    logo: "/assets/images/logo.svg",
    email: "hi@codeller.com",
    phone: "+44 1902 410 109",
    year: 2025,
    home: "/",
    nav: [
      { label: "Why Codeller", href: "/#growth" },
      { label: "Work", href: "/work" },
      { label: "How We Work", href: "/#how-we-work" },
      { label: "Services", href: "/services" },
      { label: "Contact Us", href: "/#contact" },
    ],
    cta: { label: "Book a Call", href: "/book-a-call" },
    footerColumns: [
      {
        title: "Services",
        links: [
          { label: "UX/UI Design", href: "/services" },
          { label: "Brand Design", href: "/services" },
          { label: "Website Design & Development", href: "/services" },
          { label: "eCommerce Development", href: "/services" },
          { label: "Bespoke Development", href: "/services" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/#growth" },
          { label: "Case Studies", href: "/work" },
          { label: "Contact Us", href: "/#contact" },
        ],
      },
    ],
    newsletter: {
      title: "Want to get involved? Or just having a nosey?",
      body: "Get yourself on the list to be the first to know about our free resource drops and updates.",
    },
    contact: {
      title: "Ready to Move Your Business *Forward?*",
      body: "Every Codeller partnership is led by senior designers focused on clarity, speed, and results. Book a call to see how we can help.",
      bullets: [
        "We'll respond to you within 24 hours",
        "Your information is kept confidential",
        "No mailing lists or spam — ever",
        "We're happy to sign a NDA before a call",
      ],
      subjects: ["Website Design", "Branding", "Development", "Consultation"],
      budgets: ["Less than £5k", "£5k - £10k", "£10k - £25k", "£25k+"],
    },
  },
  deco: {
    name: "DecoStorePros",
    wordmark: "DECOSTOREPROS",
    logo: "/assets/images/logo.svg",
    email: "hi@decostorepros.com",
    phone: "+1 (800) 000-0000",
    year: 2026,
    home: "/decostorepros",
    nav: [
      { label: "Why Us", href: "/decostorepros#why-us" },
      { label: "Services", href: "/decostorepros#services" },
      { label: "Process", href: "/decostorepros#process" },
      { label: "Results", href: "/decostorepros#results" },
      { label: "FAQ", href: "/decostorepros#faq" },
      { label: "Contact Us", href: "/decostorepros#contact" },
    ],
    cta: { label: "Get Started", href: "/decostorepros#contact" },
    footerColumns: [
      {
        title: "Services",
        links: [
          { label: "Custom Apparel Websites", href: "/decostorepros#services" },
          { label: "eCommerce Optimisation", href: "/decostorepros#services" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/decostorepros#why-us" },
          { label: "Contact Us", href: "/decostorepros#contact" },
        ],
      },
    ],
    newsletter: {
      title: "Want tips on growing your apparel store?",
      body: "Join our list for free DecoNetwork tips, conversion strategies, and store growth updates.",
    },
    contact: {
      title: "Ready to Unlock Your DecoNetwork's *Full Potential?*",
      body: "Tell us about your store and we'll put together a free audit showing exactly what we'd fix and how we'd grow it.",
      bullets: [
        "Free audit — no commitment required",
        "We'll respond within 24 hours",
        "Your information is kept confidential",
        "No spam, no mailing lists — ever",
      ],
      subjects: ["New Store Build", "Store Redesign", "DecoNetwork Setup", "App Integrations", "SEO & Performance", "Free Consultation"],
      budgets: ["Less than $1,000", "$1,000 - $3,000", "$3,000 - $5,000", "$5,000+"],
    },
  },
};

export const growthItems: BentoItem[] = [
  { title: "Faster product delivery and fewer reworks", image: "/assets/images/design-growth/faster-product-delivery.webp" },
  { title: "Higher conversion across key touchpoints", image: "/assets/images/design-growth/higher-conversion.webp" },
  { title: "Senior designers who work like part of your team", image: "/assets/images/design-growth/senior-designers.webp" },
  { title: "Design systems that scale with your roadmap", image: "/assets/images/design-growth/design-systems.webp" },
];

export const decoWhyItems: BentoItem[] = [
  { title: "Stores built to convert, not just look good", image: "/assets/images/design-growth/higher-conversion.webp" },
  { title: "DecoNetwork experts — not generalists", image: "/assets/images/design-growth/senior-designers.webp" },
  { title: "Faster delivery, less back-and-forth", image: "/assets/images/design-growth/faster-product-delivery.webp" },
  { title: "Revenue-focused — every decision tied to growth", image: "/assets/images/design-growth/design-systems.webp" },
];

export const servicesWhyItems: BentoItem[] = [
  { title: "Clearer design direction and faster decision-making" },
  { title: "Scalable design systems that grow with your roadmap" },
  { title: "Improved usability and user satisfaction" },
  { title: "Senior designers who integrate seamlessly with your organisation" },
];

export const decoStats: Stat[] = [
  { value: 80, suffix: "+", label: "Stores Built" },
  { value: 4.8, decimals: 1, suffix: "×", label: "Avg. Revenue Growth" },
  { value: 90, suffix: "+", label: "Happy Clients" },
];

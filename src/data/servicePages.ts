import type { Faq, ProcessStep } from "./types";

export type ServiceSlug = "web-design" | "logo-design" | "seo" | "marketing";

export interface ServicePage {
  slug: ServiceSlug;
  /** Short name used in the services list and nav */
  name: string;
  /** SEO <title> (without " | Codeller") */
  metaTitle: string;
  metaDescription: string;
  /** Hero headline; wrap a word in *asterisks* for the italic accent */
  headline: string;
  intro: string;
  /** Accent colour for glows and the hero visual */
  color: string;
  /** Hero image + two supporting images */
  heroImage: string;
  heroAlt: string;
  gallery: [{ src: string; alt: string }, { src: string; alt: string }];
  /** Short outcome statement + 3 quick facts shown under the hero */
  outcome: { title: string; body: string };
  highlights: { value: string; label: string }[];
  included: ProcessStep[];
  process: ProcessStep[];
  deliverables: string[];
  faqs: Faq[];
  cta: { title: string; body: string };
}

export const servicePages: ServicePage[] = [
  {
    slug: "web-design",
    name: "Web design",
    metaTitle: "Web Design & Development Services",
    metaDescription:
      "Custom, conversion-focused websites designed and built for speed. Strategy, UX, UI design and development for startups and growing businesses.",
    headline: "Websites that look sharp and *convert*",
    intro:
      "We design and build custom websites that tell your story clearly, load fast, and turn visitors into enquiries. Every page is planned around your goals, then crafted pixel by pixel and developed to be easy for your team to update.",
    color: "#2536DE",
    heroImage: "/assets/images/webdev.webp",
    heroAlt: "Custom website design and development by Codeller",
    gallery: [
      { src: "/assets/images/work/followthecamino-thumbnail.webp", alt: "Follow the Camino website design" },
      { src: "/assets/images/work/firmable-thumbnail.webp", alt: "Firmable website design" },
    ],
    outcome: {
      title: "A website that works as hard as *you do*",
      body: "No templates and no guesswork. We start with your audience and what you need them to do, then design a site structure, visual style and content flow that guides them there on every device.",
    },
    highlights: [
      { value: "100%", label: "Custom designed, no templates" },
      { value: "<2s", label: "Target page load time" },
      { value: "All", label: "Devices and browsers tested" },
    ],
    included: [
      { title: "UX & site structure", description: "Sitemaps, user journeys and wireframes so every page has a clear job." },
      { title: "UI design", description: "A distinctive visual design in Figma, built on your brand and a reusable component set." },
      { title: "Responsive development", description: "Clean, fast code or CMS builds that look right on phones, tablets and desktops." },
      { title: "CMS & integrations", description: "Easy content editing plus forms, analytics, booking and the tools you already use." },
    ],
    process: [
      { title: "Discovery", description: "We align on goals, audience, competitors and the pages you need." },
      { title: "Wireframes", description: "Low-fidelity layouts lock in structure and content before visuals." },
      { title: "Visual design", description: "High-fidelity designs for desktop and mobile, refined with your feedback." },
      { title: "Build", description: "We develop the site, connect your CMS and integrations, and add content." },
      { title: "Test & launch", description: "Cross-browser QA, speed and SEO checks, then a smooth go-live." },
    ],
    deliverables: [
      "Sitemap and wireframes",
      "Desktop and mobile designs in Figma",
      "Fully developed, responsive website",
      "CMS setup and content entry",
      "Contact forms and analytics tracking",
      "On-page SEO basics (titles, meta, schema)",
      "Speed and accessibility checks",
      "1-hour training session for your team",
    ],
    faqs: [
      { question: "How long does a website project take?", answer: "Most marketing websites take 4 to 8 weeks from kick-off to launch, depending on page count, content readiness and integrations." },
      { question: "Can I update the website myself?", answer: "Yes. We build on a CMS that suits your team and include a training session so you can edit pages, posts and images without a developer." },
      { question: "Do you redesign existing websites?", answer: "Absolutely. We audit what you have, keep what works, and redesign the rest so you keep your SEO value while improving look and conversion." },
      { question: "Will my site be mobile friendly?", answer: "Every page is designed mobile-first and tested on real phones, tablets and desktop browsers before launch." },
    ],
    cta: {
      title: "Ready for a website that *works*?",
      body: "Tell us about your project and we'll come back within 24 hours with ideas, a timeline and a clear quote.",
    },
  },
  {
    slug: "logo-design",
    name: "Logo design",
    metaTitle: "Logo Design & Brand Identity Services",
    metaDescription:
      "Memorable, custom logo design and brand identity. Logo concepts, colour palettes, typography and brand guidelines that make your business stand out.",
    headline: "A logo people *remember*",
    intro:
      "Your logo is the first thing people recognise about your business. We design distinctive, timeless marks that capture who you are, work at any size, and come with the colours, fonts and rules to use them consistently everywhere.",
    color: "#C2410C",
    heroImage: "/assets/images/work/jannah-thumbnail.webp",
    heroAlt: "Brand identity and logo design by Codeller",
    gallery: [
      { src: "/assets/images/work/treedefi-thumbnail.webp", alt: "Treedefi wordmark and brand identity" },
      { src: "/assets/images/work/plannerdao-thumnail.webp", alt: "PlannerDAO brand identity" },
    ],
    outcome: {
      title: "A mark that's simple, bold and *yours*",
      body: "Great logos are built on strategy, not trends. We research your market, define your personality, then sketch and refine until we land on a mark that is unique, legible and versatile.",
    },
    highlights: [
      { value: "3", label: "Initial logo concepts" },
      { value: "∞", label: "Scales from favicon to billboard" },
      { value: "100%", label: "Full ownership of final files" },
    ],
    included: [
      { title: "Brand discovery", description: "A short workshop to define your values, audience, tone and competitors." },
      { title: "Logo concepts", description: "Three distinct creative directions, each shown in real-world mockups." },
      { title: "Colour & type", description: "A matching colour palette and font pairing that extends the logo into a full look." },
      { title: "Brand guidelines", description: "A concise guide showing how to use your logo, colours and type correctly." },
    ],
    process: [
      { title: "Brief & research", description: "We learn your story, audience and market, and gather references you love." },
      { title: "Sketching", description: "Dozens of rough ideas explored on paper before anything goes digital." },
      { title: "Concepts", description: "Three refined directions presented with mockups and our reasoning." },
      { title: "Refinement", description: "We polish your chosen concept through focused revision rounds." },
      { title: "Brand kit", description: "Final logo files, variations, palette, fonts and guidelines delivered." },
    ],
    deliverables: [
      "Primary logo plus horizontal and stacked versions",
      "Icon / logomark and favicon",
      "Colour, black and white (reversed) versions",
      "Vector files: SVG, EPS, PDF and AI",
      "Web-ready PNG and JPG exports",
      "Colour palette with HEX, RGB and CMYK values",
      "Typography pairing",
      "Brand guidelines PDF",
    ],
    faqs: [
      { question: "How many logo concepts will I see?", answer: "You'll see three distinct concepts, each presented in context on things like business cards, signage and social profiles." },
      { question: "How many revisions are included?", answer: "Two focused revision rounds on your chosen concept are included, which is enough for nearly every project." },
      { question: "Do I own the final logo?", answer: "Yes. Once the project is complete you own full rights to your logo and all of the source files." },
      { question: "Can you refresh my existing logo?", answer: "Yes. If your brand has equity, we can modernise your existing mark rather than starting from scratch." },
    ],
    cta: {
      title: "Let's design a logo that *lasts*",
      body: "Share a little about your business and we'll send over a brief and timeline for your new identity.",
    },
  },
  {
    slug: "seo",
    name: "SEO",
    metaTitle: "SEO Services: Technical, On-Page & Local SEO",
    metaDescription:
      "Get found on Google. Technical SEO audits, keyword research, on-page optimisation, local SEO and monthly reporting that grows organic traffic.",
    headline: "Get found when customers *search*",
    intro:
      "Ranking on Google means steady, free traffic from people already looking for what you offer. We fix the technical issues holding your site back, target the keywords that bring buyers, and track every gain in clear monthly reports.",
    color: "#047857",
    heroImage: "/assets/images/dashboard.webp",
    heroAlt: "SEO analytics dashboard showing organic growth",
    gallery: [
      { src: "/assets/images/design-growth/higher-conversion.webp", alt: "Page testing and on-page optimisation" },
      { src: "/assets/images/design-growth/design-systems.webp", alt: "Structured, search-friendly page layouts" },
    ],
    outcome: {
      title: "More rankings, more traffic, more *leads*",
      body: "SEO is not a one-off trick. We build a solid technical foundation, create and optimise pages around real search intent, and keep improving month after month based on data.",
    },
    highlights: [
      { value: "Audit", label: "Full technical review before any work" },
      { value: "Monthly", label: "Ranking and traffic reports" },
      { value: "White-hat", label: "Google-friendly methods only" },
    ],
    included: [
      { title: "Technical SEO", description: "Site speed, Core Web Vitals, indexing, crawl errors, schema and site structure." },
      { title: "Keyword research", description: "The search terms your buyers use, mapped to the right pages on your site." },
      { title: "On-page optimisation", description: "Titles, meta descriptions, headings, internal links and content improvements." },
      { title: "Local SEO", description: "Google Business Profile, local citations and reviews to win the map pack." },
    ],
    process: [
      { title: "Audit", description: "A full technical and content audit of your site and your top competitors." },
      { title: "Strategy", description: "Keyword map and a prioritised 90-day roadmap focused on quick wins first." },
      { title: "Fix & optimise", description: "We resolve technical issues and optimise existing pages for target terms." },
      { title: "Content & links", description: "New pages and articles plus quality backlinks to build authority." },
      { title: "Report & refine", description: "Monthly reporting on rankings, traffic and leads, then the next priorities." },
    ],
    deliverables: [
      "Technical SEO audit report",
      "Keyword research and page mapping",
      "On-page optimisation of key pages",
      "Schema markup and XML sitemap setup",
      "Google Search Console and Analytics setup",
      "Google Business Profile optimisation",
      "Content plan with SEO briefs",
      "Monthly ranking and traffic report",
    ],
    faqs: [
      { question: "How long does SEO take to work?", answer: "Technical fixes can show results within weeks, but meaningful ranking and traffic growth usually builds over 3 to 6 months." },
      { question: "Do you guarantee first place on Google?", answer: "No honest agency can guarantee a position. We guarantee transparent work, proven methods and clear reporting on progress." },
      { question: "Do I need SEO if I run ads?", answer: "Ads stop when you stop paying. SEO builds long-term traffic that keeps coming, and lowers your cost per lead over time." },
      { question: "Can you do SEO for a site you didn't build?", answer: "Yes. We work on WordPress, Webflow, Shopify, Next.js and most other platforms." },
    ],
    cta: {
      title: "Let's get you to the *top* of Google",
      body: "Request a free SEO snapshot and we'll show you the biggest opportunities for your site.",
    },
  },
  {
    slug: "marketing",
    name: "Marketing",
    metaTitle: "Digital Marketing Services: Ads, Social & Email",
    metaDescription:
      "Data-driven digital marketing: paid ads, social media, email campaigns and conversion optimisation that turn clicks into customers.",
    headline: "Marketing that turns clicks into *customers*",
    intro:
      "We plan and run campaigns across search, social and email that reach the right people with the right message. Every campaign is tracked from first click to sale, so you always know what's working and where your budget goes.",
    color: "#BE185D",
    heroImage: "/assets/images/design-growth/higher-conversion.webp",
    heroAlt: "Marketing campaign performance and conversion growth",
    gallery: [
      { src: "/assets/images/design-growth/faster-product-delivery.webp", alt: "Campaign planning and launch" },
      { src: "/assets/images/work/syance-thumbnail.webp", alt: "Digital marketing campaign creative" },
    ],
    outcome: {
      title: "Campaigns measured by *results*",
      body: "Likes and impressions are nice, but revenue pays the bills. We set clear goals, build campaigns around them, and optimise weekly so your marketing spend keeps getting more efficient.",
    },
    highlights: [
      { value: "3", label: "Channels: search, social, email" },
      { value: "Weekly", label: "Campaign optimisation" },
      { value: "ROI", label: "Tracked from click to sale" },
    ],
    included: [
      { title: "Paid advertising", description: "Google Ads and Meta campaigns with sharp targeting, creative and budgets." },
      { title: "Social media", description: "Content calendars, post design and community management for your channels." },
      { title: "Email marketing", description: "Newsletters and automated flows that nurture leads and bring customers back." },
      { title: "Landing pages & CRO", description: "High-converting landing pages and A/B tests that lift conversion rates." },
    ],
    process: [
      { title: "Goals & audience", description: "We define targets, budgets and the customers you want to reach." },
      { title: "Strategy", description: "Channel mix, messaging and a campaign calendar built around your goals." },
      { title: "Creative", description: "Ad copy, visuals, emails and landing pages designed to stop the scroll." },
      { title: "Launch", description: "Campaigns go live with full conversion tracking in place." },
      { title: "Optimise & report", description: "Weekly tweaks, A/B tests and a clear monthly performance report." },
    ],
    deliverables: [
      "Marketing strategy and campaign calendar",
      "Google Ads and Meta Ads setup and management",
      "Ad creative: copy, graphics and short video",
      "Social media content calendar and posts",
      "Email newsletter templates and automations",
      "Landing page design and A/B testing",
      "Conversion tracking and analytics dashboards",
      "Monthly performance report with next steps",
    ],
    faqs: [
      { question: "What budget do I need for ads?", answer: "It depends on your market, but we usually recommend starting from a modest monthly test budget, then scaling the campaigns that prove profitable." },
      { question: "Which channels are right for me?", answer: "We pick channels based on where your customers spend time. B2B often starts with Google and LinkedIn, consumer brands with Meta and email." },
      { question: "How do you measure success?", answer: "We track leads, sales, cost per acquisition and return on ad spend, not just clicks and impressions." },
      { question: "Is there a long-term contract?", answer: "No. We work month to month after an initial setup period, because results should keep you with us, not a contract." },
    ],
    cta: {
      title: "Let's grow your business with *smarter* marketing",
      body: "Tell us your goals and we'll put together a campaign plan built around your budget.",
    },
  },
];

export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug);

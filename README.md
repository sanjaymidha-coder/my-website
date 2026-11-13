# Codeller / DecoStorePros — Next.js site

Marketing site rebuilt from the original static HTML/Tailwind/jQuery pages into
**Next.js 15 (App Router) + TypeScript + Tailwind CSS**, with GSAP + Lenis motion.

| Route            | Was                   |
| ---------------- | --------------------- |
| `/`              | `index.html`          |
| `/services`      | `services.html`       |
| `/book-a-call`   | `book-a-call.html`    |
| `/decostorepros` | `decostorepros.html`  |
| `/api/contact`   | `contact.php`         |

Old `*.html` URLs redirect permanently to the new routes.

## Requirements

- Node.js 20+ (tested with Node 24) and npm

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                   | What it does                                      |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Dev server on port 3000                           |
| `npm run build`           | Production build (also type-checks and lints)     |
| `npm start`               | Serve the production build on port 3000           |
| `npm run typecheck`       | TypeScript only                                   |
| `npm run lint`            | ESLint                                            |

## Environment variables

See [`.env.example`](.env.example). Never commit real values.

| Variable                         | Where   | Purpose                                                          |
| -------------------------------- | ------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | browser | reCAPTCHA v3 site key. If empty, the widget isn't loaded.        |
| `RECAPTCHA_SECRET_KEY`           | server  | reCAPTCHA v3 secret. If empty, verification is skipped (dev).    |
| `RESEND_API_KEY`                 | server  | [Resend](https://resend.com) API key used to send enquiries.     |
| `CONTACT_TO_EMAIL`               | server  | Where enquiries are delivered (comma-separate for several).      |
| `CONTACT_FROM_EMAIL`             | server  | Sender on a Resend-verified domain, e.g. `Codeller <no-reply@…>` |
| `NEXT_PUBLIC_GA_ID`              | browser | Optional GA4 ID — only loaded after analytics cookie consent.    |
| `NEXT_PUBLIC_SITE_URL`           | both    | Optional canonical URL used for metadata.                        |

## Project structure

```
src/
  app/                 routes, root layout (fonts, providers), API route
  components/
    providers/         Lenis smooth scroll, page-transition curtain, preloader, custom cursor
    layout/            Header, MobileNav, Footer, CookieBanner
    sections/          Hero, Projects (+ modal), ServicesList, Bento, FanoutCards,
                       Process, ServicePanels, Faq, Contact (+ form), misc CTAs
    ui/                SectionTitle, Marquee, Magnetic, TiltCard, CountUp, Accent, icons
  data/                typed content: projects, services, process steps, FAQs, logos, brand config
  lib/                 GSAP registration, helpers
public/assets/images   all site imagery (WebP)
```

Content lives in `src/data/*` — edit those files to change copy, projects, FAQs, etc.
In headings, wrap a word in `*asterisks*` to render it in the italic serif accent.

## Motion

- GSAP 3 (`ScrollTrigger`, `SplitText`) via `@gsap/react`'s `useGSAP`; Lenis smooth
  scroll is driven from `gsap.ticker`.
- Every animation is set up inside `gsap.matchMedia()` and is skipped under
  `prefers-reduced-motion: reduce`; heavier effects (pinned horizontal projects,
  pinned process column, ambient video, cursor/magnetic/tilt) are desktop or
  fine-pointer only.

## Deploying

Any host that supports Next.js 15 works (e.g. Vercel or Netlify — both detect
Next.js automatically, no extra config file needed). Set the environment
variables above in the host's dashboard before deploying.

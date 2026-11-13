import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "swiper/css";
import "swiper/css/pagination";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageTransition } from "@/components/providers/PageTransition";
import { Preloader } from "@/components/providers/Preloader";
import { Cursor } from "@/components/providers/Cursor";
import { ParticlesLoader } from "@/components/providers/ParticlesLoader";
import { Header } from "@/components/layout/Header";
import { SITE_URL } from "@/lib/seo";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic", "normal"], variable: "--font-serif", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Codeller | UX & Web Design Agency for Startups",
    template: "%s | Codeller",
  },
  description:
    "Codeller is a UX and web design agency helping startups and growing teams turn complex ideas into clear, high-converting websites and digital products.",
  applicationName: "Codeller",
  icons: { icon: "/assets/images/logo.svg", apple: "/assets/images/logo.svg" },
  openGraph: { type: "website", locale: "en_US", siteName: "Codeller" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll>
          <PageTransition>
            <ParticlesLoader />
            <Preloader />
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <CookieBanner />
            <Cursor />
            <div className="grain" aria-hidden />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}

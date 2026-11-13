import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: { DEFAULT: "#DDF160", 300: "#DDF160", 400: "#DDF160" },
        pink: { DEFAULT: "#FFB0C2" },
        cyan: { DEFAULT: "#00D4FF" },
        navy: { DEFAULT: "#050A2E", deep: "#00004B" },
        ink: "#162323",
        dark: "#161616",
        muted: { 600: "#666666", 500: "#8F8F8F", 400: "#BCBCBC", 200: "#A3A3A3" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      container: {
        center: true,
        padding: { DEFAULT: "1.25rem", md: "2rem" },
        screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1400px" },
      },
      backgroundImage: {
        grain: "url('/assets/images/img_grain.png')",
        "grid-pattern": "url('/assets/images/grid-pattren.webp')",
        "footer-bg": "url('/assets/images/footer-bg.webp')",
        "gradient-1": "url('/assets/images/gradient-img-1.webp')",
        "gradient-2": "url('/assets/images/gradient-img-2.webp')",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(221,241,96,0.55), 0 0 32px -6px rgba(221,241,96,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;

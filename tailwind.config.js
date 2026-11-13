/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html"
  ],
  safelist: [
    'input-global',
    'select-global'
  ],
  theme: {
    extend: {
      colors: {
        'green': '#DDF160',
        'pink': '#FFB0C2',
        'blue': '#00D4FF',
        'blue2': '#00004B',
        'dark-blue': '#050A2E',
        'dark-gray': '#1A1A1A',
        'light-blue': '#3B82F6',
        'ink': '#162323',
        'text-gray-600': '#666666',
        'dark': '#161616',
        'text-gray-500': '#8F8F8F',
        'text-gray-400': '#BCBCBC',
        'text-gray-200': '#A3A3A3',
      },
      fontFamily: {
        'heading': ['Yeseva One', 'serif'],
        'body': ['Roboto', 'sans-serif'],
        'sans': ['Roboto', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: "marquee 80s linear infinite",
        "marquee-reverse": "marquee 80s linear infinite reverse",
      },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1340px',
        },
      },

      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
      },

      backgroundImage: {
        'body-pattren': "url('../assets/images/img_grain.png')",
        'grid-pattren': "url('../assets/images/grid-pattren.webp')",
        'hero-pattern': "url('../assets/images/hero-pattren.webp')",
        'footer-bg': "url('../assets/images/footer-bg.webp')",
        'kickoff-grid': "url('../assets/images/kickoff-grid.webp')",
        'gradient-img-1': "url('../assets/images/gradient-img-1.webp')",
        'gradient-img-2': "url('../assets/images/gradient-img-2.webp')",
        'benefits-bg': "url('../assets/images/benefits.svg')",
        'contact-bg': "url('../assets/images/contact-bg.svg')",
      },

      backgroundPosition: {
        'center-bottom': 'center bottom',
      },
    },
  },
  plugins: [],
}

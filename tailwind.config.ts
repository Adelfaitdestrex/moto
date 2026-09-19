import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background, #09090b)",
        foreground: "var(--foreground, #f4f4f5)",
        surface: {
          50: "#18181b",
          100: "#27272a",
          200: "#3f3f46",
          300: "#52525b",
          800: "#09090b",
          900: "#040405",
        },
        brand: {
          DEFAULT: "var(--brand-accent, #ef4444)", // Red by default, configurable
          hover: "var(--brand-accent-hover, #dc2626)",
          light: "var(--brand-accent-light, #fca5a5)",
          dark: "var(--brand-accent-dark, #991b1b)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px var(--brand-glow, rgba(239, 68, 68, 0.4))",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(9, 9, 11, 0.4) 0%, rgba(9, 9, 11, 0.95) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(39, 39, 42, 0.6) 0%, rgba(24, 24, 27, 0.9) 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, var(--brand-glow, rgba(239, 68, 68, 0.15)) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
};
export default config;

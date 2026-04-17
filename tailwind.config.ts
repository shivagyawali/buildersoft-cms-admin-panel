import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans:    ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Bebas Neue'", "ui-sans-serif", "sans-serif"],
        mono:    ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        orange: {
          50:  "#fff7ed",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea6c10",
        },
      },
      backgroundImage: {
        "hazard": "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(251,146,60,0.15) 8px, rgba(251,146,60,0.15) 16px)",
        "hazard-dark": "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(251,146,60,0.08) 8px, rgba(251,146,60,0.08) 16px)",
      },
      animation: {
        "fade-up":   "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in":  "slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-slow":"pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-8px)" }, to: { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50:  "#fdfaf4",
          100: "#f7f0df",
          200: "#eedfc0",
          300: "#e2c898",
          400: "#d4ad70",
          500: "#c4944e",
        },
        forest: {
          50:  "#f0f5f0",
          100: "#d6e8d6",
          200: "#a8ccaa",
          300: "#72a876",
          400: "#4a8a50",
          500: "#2d6b34",
          600: "#1e5224",
          700: "#143a19",
          800: "#0c2710",
          900: "#071508",
        },
        terra: {
          100: "#f5e6df",
          200: "#e8c4b4",
          300: "#d49a80",
          400: "#bc6e4e",
          500: "#9a4e32",
          600: "#7a3520",
        },
      },
      fontFamily: {
        serif:  ["var(--font-playfair)", "Georgia", "serif"],
        sans:   ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono:   ["var(--font-dm-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up":  "fade-up 0.5s ease forwards",
        "fade-in":  "fade-in 0.4s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

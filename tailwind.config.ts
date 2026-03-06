import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm beige backgrounds (CompaNanny style)
        cream: {
          50: "#FDFBF7",
          100: "#F7F3EC",
          200: "#F0EADF",
          300: "#E8DFD0",
          400: "#DDD2C0",
          500: "#D1C4AD",
        },
        // Deep forest green (headings, nav text)
        forest: {
          50: "#EDF3F1",
          100: "#D4E2DD",
          200: "#A8C5BA",
          300: "#7DA898",
          400: "#517B6E",
          500: "#2D5A4A",
          600: "#264D3F",
          700: "#1E3F33",
          800: "#173028",
          900: "#10221D",
        },
        // Terracotta/copper orange (CTA buttons)
        terracotta: {
          50: "#FDF5F0",
          100: "#FAEADE",
          200: "#F3D1B8",
          300: "#ECB892",
          400: "#D9956A",
          500: "#C67B4B",
          600: "#B56A3B",
          700: "#955530",
          800: "#754325",
          900: "#5A331D",
        },
        // Teal accent (decorative elements)
        teal: {
          50: "#EEF7F5",
          100: "#D5EDEA",
          200: "#ABDBD4",
          300: "#82C9BF",
          400: "#6BB8AD",
          500: "#5BA89D",
          600: "#4D8E84",
          700: "#3E736B",
          800: "#305952",
          900: "#213F3A",
        },
        // Keep navy for dark backgrounds / text shades
        navy: {
          50: "#F7F3EC",
          100: "#F0EADF",
          200: "#E0D6C8",
          300: "#C5B8A5",
          400: "#9E9182",
          500: "#6B6155",
          600: "#514A40",
          700: "#3A352E",
          800: "#2A2621",
          900: "#1A1815",
        },
        primary: {
          50: "#EDF3F1",
          100: "#D4E2DD",
          200: "#A8C5BA",
          300: "#7DA898",
          400: "#517B6E",
          500: "#2D5A4A",
          600: "#264D3F",
          700: "#1E3F33",
          800: "#173028",
          900: "#10221D",
        },
        secondary: {
          50: "#FDF5F0",
          100: "#FAEADE",
          200: "#F3D1B8",
          300: "#ECB892",
          400: "#D9956A",
          500: "#C67B4B",
          600: "#B56A3B",
          700: "#955530",
          800: "#754325",
          900: "#5A331D",
        },
        success: "#10b981",
        error: "#ef4444",
        warning: "#C67B4B",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

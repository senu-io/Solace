import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0c0d12",
        surface: "#14161f",
        surfaceHover: "#1b1e2b",
        border: "#232638",
        brand: {
          50: "#f3f0ff",
          100: "#e9e5ff",
          200: "#d4cdfe",
          300: "#b3a3fc",
          400: "#8e6efa",
          500: "#6c5ce7",
          600: "#5b44db",
          700: "#4c34c4",
          800: "#3f2c9f",
          900: "#352782",
        },
      },
    },
  },
  plugins: [],
};

export default config;

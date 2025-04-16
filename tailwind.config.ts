import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00A884",
          hover: "#009775",
        },
        accent: {
          DEFAULT: "#FFD75C",
          hover: "#FFE17F",
        },
        card: {
          DEFAULT: "#FFFFFF",
          hover: "#F5F5F5",
        },
        background: "#E8F1F8",
      },
    },
  },
  plugins: [],
};

export default config;

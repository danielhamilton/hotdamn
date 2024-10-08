import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        "2/24": "8.333333%",
        "16/24": "66.666667%",
        "6/24": "25%",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;

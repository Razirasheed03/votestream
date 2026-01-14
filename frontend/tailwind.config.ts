import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e",      // light green
        primarySoft: "#dcfce7",  // very light green
      },
    },
  },
  plugins: [],
};

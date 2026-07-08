/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amber: { warm: "#d99a4e" },
        tavern: {
          wood: "#3d2817",
          woodLight: "#5c3d22",
          velvet: "#6b1f2a",
          gold: "#c9a24b",
          candle: "#ffcf6e",
          moss: "#5a6b3c",
          stone: "#7d756a",
          shadow: "#1a1009",
        },
      },
      fontFamily: {
        medieval: ['"Cinzel"', "Georgia", "serif"],
        body: ['"EB Garamond"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

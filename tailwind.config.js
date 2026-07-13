/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amber: { warm: "#8a6a2e" },
        // Sepia / parchment palette. `candle` is the primary ink used for
        // body text, so it must stay dark on the cream ground.
        tavern: {
          wood: "#7a5a3a",
          woodLight: "#9c7a4e",
          velvet: "#9a5a52",
          gold: "#7a5a2e", // bronze accent / borders / subtle bg tints
          candle: "#4a3721", // primary sepia ink (text)
          moss: "#5a6b3c",
          stone: "#6b5f4a", // muted ink for secondary text
          shadow: "#2a1f12", // deep sepia for the few dark chips (tooltips)
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

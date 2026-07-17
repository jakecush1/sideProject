/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amber: { warm: "#a8741f" },
        // TECHNOFEUDAL palette — old-master chiaroscuro warms (brass, oxblood,
        // linen) clashing with machine colds (ultramarine, verdigris), executed
        // neobrutalist: hard ink borders + offset block shadows.
        tavern: {
          wood: "#7a5a3a",
          woodLight: "#9c7a4e",
          velvet: "#8f2b22", // vermilion/oxblood — the robe red
          gold: "#c68a2c", // brass — frames, lutes, halos
          candle: "#1d1409", // near-black warm ink (text on linen panels)
          moss: "#3a7d74", // verdigris — the museum-wall cold green
          stone: "#63563f", // muted ink for secondary text on linen
          shadow: "#120d06", // deepest ebony (grounds, hard shadows)
          cobalt: "#2a4fd0", // ultramarine — the Vermeer-dress cold clash
          linen: "#e9dcbe", // cream linen (light text on dark grounds)
          ice: "#d8e2df", // pale cold highlight
        },
      },
      fontFamily: {
        medieval: ['"Cinzel"', "Georgia", "serif"],
        body: ['"EB Garamond"', "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0 0 #120d06",
        "brutal-cobalt": "4px 4px 0 0 #2a4fd0",
        "brutal-blood": "4px 4px 0 0 #8f2b22",
        "brutal-gold": "4px 4px 0 0 #c68a2c",
      },
    },
  },
  plugins: [],
};

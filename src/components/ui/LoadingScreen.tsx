// LOADING SCREEN
// Shown briefly on first mount (parchment-style). Purely cosmetic timing in
// this MVP since geometry is procedural; kept for when real assets are added.

export default function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-tavern-shadow">
      <h1 className="font-medieval gold-text text-3xl sm:text-4xl font-bold mb-6">
        Side Proj
      </h1>
      <div className="w-48 h-1 bg-tavern-gold/20 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-tavern-gold animate-[fadeIn_1.5s_ease] w-full origin-left" />
      </div>
      <p className="font-body text-tavern-candle/70 text-sm italic animate-flicker">
        Tuning lutes… polishing goblets… summoning bottles…
      </p>
    </div>
  );
}

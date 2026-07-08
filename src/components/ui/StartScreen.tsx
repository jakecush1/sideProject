import { useGameStore } from "../../lib/useGameStore";
import { audioManager } from "../../lib/audioManager";

// START SCREEN
// Browsers require a user gesture before audio. This gate unlocks the audio
// context, starts ambient sound, and reveals the experience.

export default function StartScreen() {
  const start = useGameStore((s) => s.start);

  const handleEnter = () => {
    audioManager.init();
    audioManager.startAmbient();
    start();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-tavern-shadow">
      {/* atmospheric backdrop */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(217,154,78,0.25), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(107,31,42,0.3), transparent 70%)",
        }}
      />
      <div className="relative max-w-lg px-8 text-center animate-fade-in">
        <p className="font-medieval text-tavern-gold/70 text-sm tracking-[0.3em] uppercase mb-4">
          Pull up a stool
        </p>
        <h1 className="font-medieval gold-text text-5xl sm:text-6xl font-bold mb-5 leading-tight">
          The Gilded Minstrels
        </h1>
        <p className="text-tavern-candle/80 text-lg mb-10 italic">
          A strange little medieval band waiting for your command.
        </p>
        <button
          onClick={handleEnter}
          className="btn-tavern font-medieval text-lg px-10 py-4 rounded-lg tracking-wide"
          autoFocus
        >
          Enter the Tavern
        </button>
        <p className="mt-8 text-tavern-stone text-xs">
          Best enjoyed with sound on. Click glowing objects to play songs —
          click the room to summon suspiciously fancy beer bottles.
        </p>
      </div>
    </div>
  );
}

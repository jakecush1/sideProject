import { useGameStore } from "../../lib/useGameStore";
import { audioManager } from "../../lib/audioManager";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

// HEADER
// Top overlay: band name, anchor nav, mute toggle, reset camera.

const navItems = [
  { label: "The Band", target: "about" },
  { label: "Songs", target: "songs" },
  { label: "Shows", target: "shows" },
  { label: "Contact", target: "contact" },
];

export default function Header() {
  const muted = useGameStore((s) => s.muted);
  const toggleMute = useGameStore((s) => s.toggleMute);

  const handleMute = () => {
    const next = !muted;
    audioManager.setMuted(next);
    toggleMute();
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="pointer-events-none absolute top-0 inset-x-0 z-40 px-4 sm:px-6 py-4">
      <div className="pointer-events-auto mx-auto max-w-6xl flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-medieval gold-text text-lg sm:text-xl font-bold">
            Side Proj
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => scrollTo(item.target)}
              className="font-medieval text-sm text-tavern-candle/80 hover:text-tavern-candle px-3 py-1.5 rounded-md hover:bg-tavern-gold/10 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event("reset-camera"))}
            className="btn-tavern p-2 rounded-md"
            aria-label="Reset camera view"
            title="Reset camera"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleMute}
            className="btn-tavern p-2 rounded-md"
            aria-label={muted ? "Unmute audio" : "Mute audio"}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

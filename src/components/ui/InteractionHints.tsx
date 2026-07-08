import { useEffect, useState } from "react";
import { useGameStore } from "../../lib/useGameStore";

// INTERACTION HINTS
// A small dismissable hint, bottom-center. Auto-hides after the first
// meaningful interaction (song selected or bottles spawned).

export default function InteractionHints() {
  const currentSongId = useGameStore((s) => s.currentSongId);
  const bottleNonce = useGameStore((s) => s.bottleSpawnNonce);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (currentSongId || bottleNonce > 0) {
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentSongId, bottleNonce]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-30 hidden sm:block">
      <div className="parchment rounded-full px-5 py-2.5">
        <p className="text-tavern-candle/85 text-xs sm:text-sm text-center">
          Click <span className="text-tavern-gold">glowing objects</span> to change songs ·
          Click the <span className="text-tavern-gold">room</span> to drop beer bottles
        </p>
      </div>
    </div>
  );
}

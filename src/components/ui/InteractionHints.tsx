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
    // Mobile: under the header, full-width band (bottom is the song panel's).
    // sm–lg: bottom band right of the 300px song panel. xl+: true center.
    <div className="pointer-events-none absolute z-30 flex justify-center top-16 left-3 right-3 sm:top-auto sm:bottom-4 sm:left-[336px] sm:right-28 xl:left-1/2 xl:right-auto xl:-translate-x-1/2">
      <div className="placard px-4 py-2 sm:px-5 sm:py-2.5">
        <p className="font-mono text-[10px] sm:text-xs text-center tracking-wide">
          Click <span className="text-tavern-gold font-semibold">glowing objects</span> to change songs ·
          Click the <span className="text-tavern-gold font-semibold">room</span> to drop beer bottles
        </p>
      </div>
    </div>
  );
}

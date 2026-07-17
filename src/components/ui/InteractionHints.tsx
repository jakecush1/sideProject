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
      <div className="placard px-5 py-2.5">
        <p className="font-mono text-[11px] sm:text-xs text-center tracking-wide">
          Click <span className="text-tavern-gold font-semibold">glowing objects</span> to change songs ·
          Click the <span className="text-tavern-gold font-semibold">room</span> to drop beer bottles
        </p>
      </div>
    </div>
  );
}

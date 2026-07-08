import { useEffect, useState } from "react";
import { useGameStore } from "./lib/useGameStore";
import { audioManager } from "./lib/audioManager";
import Experience from "./components/Experience";
import StartScreen from "./components/ui/StartScreen";
import LoadingScreen from "./components/ui/LoadingScreen";
import Header from "./components/ui/Header";
import SongPanel from "./components/ui/SongPanel";
import BandMemberPanel from "./components/ui/BandMemberPanel";
import InteractionHints from "./components/ui/InteractionHints";
import FooterOverlay from "./components/ui/FooterOverlay";

export default function App() {
  const started = useGameStore((s) => s.started);
  const setReducedMotion = useGameStore((s) => s.setReducedMotion);
  const [loading, setLoading] = useState(true);

  // Respect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setReducedMotion]);

  // Brief loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  // Keep audio volume in sync if changed externally
  useEffect(() => {
    audioManager.setVolume(useGameStore.getState().volume);
  }, []);

  return (
    <div className="relative w-full h-full overflow-x-hidden overflow-y-auto">
      {/* Fixed full-screen canvas */}
      <div className="fixed inset-0 w-full h-full">
        <Experience />
      </div>

      {/* Overlays (only after entering) */}
      {started && (
        <>
          <div className="fixed inset-0 pointer-events-none z-30">
            <div className="relative w-full h-full">
              <div className="pointer-events-auto">
                <Header />
                <SongPanel />
                <BandMemberPanel />
                <InteractionHints />
              </div>
            </div>
          </div>

          {/* Spacer to push content below the 100vh canvas */}
          <div className="relative">
            <div className="h-screen pointer-events-none" />
            <FooterOverlay />
          </div>
        </>
      )}

      {/* Gates */}
      {loading && <LoadingScreen />}
      {!loading && !started && <StartScreen />}
    </div>
  );
}

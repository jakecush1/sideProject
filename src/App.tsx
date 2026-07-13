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

      {/* Aged-paper overlay: bleached worn edges + fine grain, over the canvas */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 48%, rgba(236,226,203,0.5) 82%, rgba(228,216,186,0.85) 100%)",
        }}
      />
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          mixBlendMode: "multiply",
          opacity: 0.5,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

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

          {/* Spacer to push content below the 100vh canvas.
              pointer-events-none so the transparent 100vh region over the
              canvas stays click-through; FooterOverlay re-enables events on
              its own interactive content. */}
          <div className="relative pointer-events-none">
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

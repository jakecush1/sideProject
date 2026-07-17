import { bandMembers } from "../../data/bandMembers";
import { songs } from "../../data/songs";
import { useGameStore } from "../../lib/useGameStore";
import { ChevronDown } from "lucide-react";
import Portrait from "./Portrait";

// FOOTER OVERLAY
// Scrollable content sections that double as the accessible, non-3D fallback:
// band info, song list, shows, contact. Reachable by scrolling or header nav.
// Styled as a dark gallery wall hung with linen placards.

export default function FooterOverlay() {
  const selectSong = useGameStore((s) => s.selectSong);

  const scrollToContent = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll affordance */}
      <button
        onClick={scrollToContent}
        className="pointer-events-auto absolute bottom-4 right-4 z-30 hidden md:flex items-center gap-1.5 font-mono uppercase tracking-wider text-tavern-linen/60 hover:text-tavern-gold text-[11px]"
        aria-label="Scroll to band information"
      >
        Learn more <ChevronDown size={14} className="animate-bounce" />
      </button>

      {/* Content sections live below the fold (canvas is 100vh) */}
      <div className="pointer-events-auto relative z-20 bg-gradient-to-b from-transparent to-[#17110b]">
        <div
          className="bg-[#17110b]"
          style={{
            // Gallery-wall texture: etching crosshatch over the ebony ground
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(233,220,190,0.03) 0 1px, transparent 1px 7px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.35) 0 1px, transparent 1px 9px), radial-gradient(ellipse at 50% 0%, rgba(198,138,44,0.07), transparent 60%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
            {/* ABOUT */}
            <section id="about" className="scroll-mt-24">
              <p className="font-mono text-tavern-moss text-xs tracking-[0.3em] uppercase mb-3">
                ⌘ The Band
              </p>
              <h2 className="font-medieval gold-text text-3xl sm:text-4xl font-black mb-5">
                Side Proj
              </h2>
              <p className="text-tavern-linen/85 text-lg leading-relaxed max-w-2xl mb-10">
                Side Proj are a wandering renaissance tavern band specializing
                in candlelit jigs, suspicious ballads, and songs best performed near a
                barrel. They have played for kings, peasants, and at least one very
                confused goat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bandMembers.map((m) => (
                  <div
                    key={m.id}
                    className="parchment p-4 flex items-start gap-3"
                  >
                    <Portrait member={m} className="w-20 h-20" />
                    <div>
                      <h3 className="font-medieval text-tavern-candle text-base font-bold leading-tight">
                        {m.name}
                      </h3>
                      <p className="font-mono text-tavern-cobalt text-[11px] uppercase tracking-wider mb-1">
                        {m.instrument}
                      </p>
                      <p className="text-tavern-stone text-sm italic leading-snug">
                        {m.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SONGS */}
            <section id="songs" className="scroll-mt-24">
              <p className="font-mono text-tavern-moss text-xs tracking-[0.3em] uppercase mb-3">
                ♪ The Repertoire
              </p>
              <h2 className="font-medieval gold-text text-3xl font-black mb-8">Songs</h2>
              <div className="space-y-5">
                {songs.map((s) => (
                  <div
                    key={s.id}
                    className="parchment p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-medieval text-tavern-candle text-lg font-bold leading-tight">
                        {s.title}
                      </h3>
                      <p className="text-tavern-stone text-sm mt-1">{s.description}</p>
                    </div>
                    <button
                      onClick={() => selectSong(s.id)}
                      className="btn-tavern font-medieval text-sm px-5 py-2 uppercase shrink-0"
                    >
                      Play
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* SHOWS */}
            <section id="shows" className="scroll-mt-24">
              <p className="font-mono text-tavern-moss text-xs tracking-[0.3em] uppercase mb-3">
                ☗ On the Road
              </p>
              <h2 className="font-medieval gold-text text-3xl font-black mb-6">Shows</h2>
              <div className="parchment p-8 text-center">
                <p className="text-tavern-candle/85 text-lg italic">
                  Upcoming performances coming soon.
                </p>
                <p className="font-mono text-tavern-stone text-xs mt-2">
                  The minstrels are currently resting their lutes (and livers).
                </p>
              </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="scroll-mt-24">
              <p className="font-mono text-tavern-moss text-xs tracking-[0.3em] uppercase mb-3">
                ✉ Summon Them
              </p>
              <h2 className="font-medieval gold-text text-3xl font-black mb-6">Contact</h2>
              <div className="parchment p-8">
                <p className="text-tavern-candle/85 mb-2">
                  Booking inquiries:{" "}
                  <a
                    href="mailto:booking@example.com"
                    className="font-mono text-sm text-tavern-cobalt underline decoration-2 underline-offset-2 hover:text-tavern-velvet"
                  >
                    booking@example.com
                  </a>
                </p>
                <p className="text-tavern-stone text-sm">
                  Replace this placeholder with real contact details in
                  <code className="font-mono text-tavern-velvet"> FooterOverlay.tsx</code>.
                </p>
              </div>
            </section>

            <footer className="text-center font-mono text-tavern-linen/40 text-[11px] tracking-wide pb-8">
              Side Proj · A playful interactive 3D tavern · Built with React
              Three Fiber
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

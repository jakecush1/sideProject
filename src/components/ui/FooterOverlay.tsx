import { bandMembers } from "../../data/bandMembers";
import { songs } from "../../data/songs";
import { useGameStore } from "../../lib/useGameStore";
import { ChevronDown } from "lucide-react";

// FOOTER OVERLAY
// Scrollable content sections that double as the accessible, non-3D fallback:
// band info, song list, shows, contact. Reachable by scrolling or header nav.

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
        className="pointer-events-auto absolute bottom-4 right-4 z-30 hidden md:flex items-center gap-1.5 text-tavern-candle/60 hover:text-tavern-candle text-xs"
        aria-label="Scroll to band information"
      >
        Learn more <ChevronDown size={14} className="animate-bounce" />
      </button>

      {/* Content sections live below the fold (canvas is 100vh) */}
      <div className="pointer-events-auto relative z-20 bg-gradient-to-b from-transparent to-tavern-shadow">
        <div className="bg-tavern-shadow">
          <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
            {/* ABOUT */}
            <section id="about" className="scroll-mt-24">
              <p className="font-medieval text-tavern-gold/70 text-sm tracking-[0.25em] uppercase mb-3">
                The Band
              </p>
              <h2 className="font-medieval gold-text text-3xl sm:text-4xl font-bold mb-5">
                The Gilded Minstrels
              </h2>
              <p className="text-tavern-candle/80 text-lg leading-relaxed max-w-2xl mb-10">
                The Gilded Minstrels are a wandering renaissance tavern band specializing
                in candlelit jigs, suspicious ballads, and songs best performed near a
                barrel. They have played for kings, peasants, and at least one very
                confused goat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bandMembers.map((m) => (
                  <div
                    key={m.id}
                    className="parchment rounded-xl p-4 flex items-start gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-full border border-tavern-gold/40 shrink-0"
                      style={{ background: m.color }}
                    />
                    <div>
                      <h3 className="font-medieval text-tavern-candle text-base leading-tight">
                        {m.name}
                      </h3>
                      <p className="text-tavern-gold/70 text-xs mb-1">{m.instrument}</p>
                      <p className="text-tavern-candle/60 text-sm italic leading-snug">
                        {m.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SONGS */}
            <section id="songs" className="scroll-mt-24">
              <p className="font-medieval text-tavern-gold/70 text-sm tracking-[0.25em] uppercase mb-3">
                The Repertoire
              </p>
              <h2 className="font-medieval gold-text text-3xl font-bold mb-8">Songs</h2>
              <div className="space-y-3">
                {songs.map((s) => (
                  <div
                    key={s.id}
                    className="parchment rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-medieval text-tavern-candle text-lg leading-tight">
                        {s.title}
                      </h3>
                      <p className="text-tavern-candle/60 text-sm mt-1">{s.description}</p>
                    </div>
                    <button
                      onClick={() => selectSong(s.id)}
                      className="btn-tavern font-medieval text-sm px-5 py-2 rounded-lg shrink-0"
                    >
                      Play
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* SHOWS */}
            <section id="shows" className="scroll-mt-24">
              <p className="font-medieval text-tavern-gold/70 text-sm tracking-[0.25em] uppercase mb-3">
                On the Road
              </p>
              <h2 className="font-medieval gold-text text-3xl font-bold mb-6">Shows</h2>
              <div className="parchment rounded-xl p-8 text-center">
                <p className="text-tavern-candle/80 text-lg italic">
                  Upcoming performances coming soon.
                </p>
                <p className="text-tavern-candle/50 text-sm mt-2">
                  The minstrels are currently resting their lutes (and livers).
                </p>
              </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="scroll-mt-24">
              <p className="font-medieval text-tavern-gold/70 text-sm tracking-[0.25em] uppercase mb-3">
                Summon Them
              </p>
              <h2 className="font-medieval gold-text text-3xl font-bold mb-6">Contact</h2>
              <div className="parchment rounded-xl p-8">
                <p className="text-tavern-candle/80 mb-2">
                  Booking inquiries:{" "}
                  <a
                    href="mailto:booking@example.com"
                    className="text-tavern-gold hover:underline"
                  >
                    booking@example.com
                  </a>
                </p>
                <p className="text-tavern-candle/50 text-sm">
                  Replace this placeholder with real contact details in
                  <code className="text-tavern-gold/80"> FooterOverlay.tsx</code>.
                </p>
              </div>
            </section>

            <footer className="text-center text-tavern-stone text-xs pb-8">
              The Gilded Minstrels · A playful interactive 3D tavern · Built with React
              Three Fiber
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

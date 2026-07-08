import { useGameStore } from "../../lib/useGameStore";
import { getBandMember } from "../../data/bandMembers";
import { getSong } from "../../data/songs";
import { X } from "lucide-react";

// BAND MEMBER PANEL
// Appears (top-right) when a member is clicked. Shows name, instrument, bio,
// and live state (Idle / Playing / Featured).

export default function BandMemberPanel() {
  const focusedMemberId = useGameStore((s) => s.focusedMemberId);
  const focusMember = useGameStore((s) => s.focusMember);
  const isPlaying = useGameStore((s) => s.isPlaying);
  const currentSongId = useGameStore((s) => s.currentSongId);

  const member = focusedMemberId ? getBandMember(focusedMemberId) : null;
  if (!member) return null;

  const song = getSong(currentSongId);
  const state = isPlaying && song ? "Playing" : "Featured";

  return (
    <div className="pointer-events-auto absolute top-20 right-4 z-40 w-[290px] max-w-[calc(100vw-2rem)] animate-fade-in">
      <div className="parchment rounded-xl p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full border-2 border-tavern-gold/50 shrink-0"
              style={{ background: member.color }}
            />
            <div>
              <h3 className="font-medieval gold-text text-base leading-tight">
                {member.name}
              </h3>
              <p className="text-tavern-candle/60 text-xs">{member.instrument}</p>
            </div>
          </div>
          <button
            onClick={() => focusMember(null)}
            className="text-tavern-candle/50 hover:text-tavern-candle"
            aria-label="Close band member info"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-tavern-candle/80 text-sm leading-relaxed italic mb-4">
          “{member.bio}”
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-tavern-gold/60">
            Status
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              state === "Playing"
                ? "bg-tavern-gold/20 text-tavern-candle"
                : "bg-tavern-velvet/40 text-tavern-candle/80"
            }`}
          >
            {state === "Playing" ? `Playing ${song?.title}` : "Featured"}
          </span>
        </div>
      </div>
    </div>
  );
}

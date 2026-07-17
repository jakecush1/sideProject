import { useState } from "react";
import type { BandMember } from "../../data/bandMembers";

// PORTRAIT
// Oil-painting-treated photo of a band member, framed like a tiny gallery
// piece. Falls back to the member's heraldic color swatch until the photo
// file exists in /public/band (or if it fails to load).

type Props = {
  member: BandMember;
  className?: string;
  shadow?: string; // brutal shadow utility, e.g. "shadow-brutal-blood"
};

export default function Portrait({ member, className = "", shadow = "shadow-brutal-blood" }: Props) {
  const [failed, setFailed] = useState(false);
  const showPhoto = member.photo && !failed;

  if (!showPhoto) {
    return (
      <div
        className={`border-2 border-tavern-shadow ${shadow} shrink-0 ${className}`}
        style={{ background: member.color }}
      />
    );
  }

  return (
    <div className={`oil-portrait ${shadow} shrink-0 ${className}`}>
      <img
        src={member.photo}
        alt={`Portrait of ${member.name}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

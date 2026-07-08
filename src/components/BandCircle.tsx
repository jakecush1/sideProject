import { bandMembers } from "../data/bandMembers";
import BandMember from "./BandMember";

export default function BandCircle() {
  return (
    <group>
      {bandMembers.map((member, i) => (
        <BandMember key={member.id} member={member} index={i} />
      ))}
    </group>
  );
}

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { TextureLoader, SRGBColorSpace } from "three";
import type { Group, Texture } from "three";
import type { BandMember as BandMemberData } from "../data/bandMembers";
import { useGameStore } from "../lib/useGameStore";
import { getSong } from "../data/songs";
import Instrument from "./Instrument";

// BAND MEMBER
// A charming primitive-built character. Idle = gentle breathing/sway.
// Playing = rhythmic arm + body motion scaled by song mood & bpm.
//
// To use a real GLB later: replace the body/head/arm meshes with your model
// (keep the outer <group> and the animation refs to drive bone rotations).

type Props = {
  member: BandMemberData;
  index: number;
};

const MOOD_ENERGY: Record<string, number> = {
  warm: 0.7,
  rowdy: 1.0,
  mysterious: 0.4,
  melancholy: 0.3,
};

// Loads the member's photo as a face texture, center-cropped square (biased
// toward the top of portrait shots, where faces live). Resolves to null if
// the file doesn't exist yet, so members render faceless rather than crash.
function useFaceTexture(url?: string) {
  const [tex, setTex] = useState<Texture | null>(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    new TextureLoader().load(
      url,
      (t) => {
        if (!alive) return;
        t.colorSpace = SRGBColorSpace;
        const img = t.image as HTMLImageElement;
        const aspect = img.width / img.height;
        if (aspect < 1) {
          t.repeat.set(1, aspect);
          t.offset.set(0, (1 - aspect) * 0.8);
        } else {
          t.repeat.set(1 / aspect, 1);
          t.offset.set((1 - 1 / aspect) / 2, 0);
        }
        setTex(t);
      },
      undefined,
      () => {}
    );
    return () => {
      alive = false;
    };
  }, [url]);
  return tex;
}

export default function BandMember({ member, index }: Props) {
  const group = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const head = useRef<Group>(null);

  const [hovered, setHovered] = useState(false);
  const faceTexture = useFaceTexture(member.photo);

  const isPlaying = useGameStore((s) => s.isPlaying);
  const currentSongId = useGameStore((s) => s.currentSongId);
  const focusedMemberId = useGameStore((s) => s.focusedMemberId);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const focusMember = useGameStore((s) => s.focusMember);

  const song = getSong(currentSongId);
  const energy = song ? MOOD_ENERGY[song.mood] ?? 0.6 : 0;
  const bpmRate = song ? song.bpm / 60 : 1;
  const offset = index * 1.3; // desync members
  const isFocused = focusedMemberId === member.id;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const motion = reducedMotion ? 0.3 : 1;

    if (isPlaying && song) {
      // body sway with the beat
      const beat = t * bpmRate * Math.PI;
      group.current.position.y =
        member.position[1] + Math.abs(Math.sin(beat + offset)) * 0.06 * energy * motion;
      group.current.rotation.z = Math.sin(beat * 0.5 + offset) * 0.04 * energy * motion;

      // arms move rhythmically (instrument-appropriate)
      if (leftArm.current && rightArm.current) {
        const armSwing = Math.sin(beat + offset) * (0.4 + energy * 0.5) * motion;
        if (member.instrumentType === "drum" || member.instrumentType === "organ") {
          // alternating hands: drum taps / organ keys + chain rattles
          leftArm.current.rotation.x = -0.6 - Math.abs(Math.sin(beat + offset)) * 0.5 * motion;
          rightArm.current.rotation.x = -0.6 - Math.abs(Math.sin(beat + offset + 1.5)) * 0.5 * motion;
        } else if (member.instrumentType === "fiddle") {
          // bowing: one arm saws back and forth
          rightArm.current.rotation.x = -0.5 + Math.sin(beat * 2 + offset) * 0.4 * motion;
          leftArm.current.rotation.x = -0.7;
        } else if (member.instrumentType === "flute") {
          leftArm.current.rotation.x = -0.9;
          rightArm.current.rotation.x = -0.9 + Math.sin(beat + offset) * 0.08 * motion;
        } else {
          // lute strum
          rightArm.current.rotation.x = -0.5 + armSwing * 0.3;
          leftArm.current.rotation.x = -0.6;
        }
      }

      // head bob
      if (head.current) {
        head.current.rotation.x = Math.sin(beat + offset) * 0.08 * energy * motion;
      }
    } else {
      // idle: breathing
      const breathe = Math.sin(t * 1.4 + offset) * 0.015 * motion;
      group.current.position.y = member.position[1] + breathe;
      group.current.rotation.z = Math.sin(t * 0.6 + offset) * 0.01 * motion;
      if (leftArm.current) leftArm.current.rotation.x = -0.55 + Math.sin(t + offset) * 0.02;
      if (rightArm.current) rightArm.current.rotation.x = -0.55 + Math.cos(t + offset) * 0.02;
      if (head.current) head.current.rotation.x = Math.sin(t * 0.8 + offset) * 0.03 * motion;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    focusMember(isFocused ? null : member.id);
  };

  const highlight = hovered || isFocused;

  return (
    <group
      ref={group}
      position={member.position}
      rotation={member.rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Stool */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.36, 12]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>

      {/* Body / torso */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.32, 6, 12]} />
        <meshStandardMaterial
          color={member.color}
          roughness={0.7}
          emissive={highlight ? member.color : "#000000"}
          emissiveIntensity={highlight ? 0.35 : 0}
        />
      </mesh>

      {/* Head (group so the face decal bobs with it) */}
      <group ref={head} position={[0, 1.08, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color="#e8c9a0" roughness={0.6} />
        </mesh>
        {/* Face decal — the member's photo as a round portrait medallion */}
        {faceTexture && (
          <mesh position={[0, 0.01, 0.135]}>
            <circleGeometry args={[0.115, 24]} />
            <meshStandardMaterial map={faceTexture} roughness={0.85} />
          </mesh>
        )}
      </group>

      {/* Hat (cap) */}
      <mesh position={[0, 1.22, 0]} castShadow>
        <coneGeometry args={[0.2, 0.22, 12]} />
        <meshStandardMaterial color={member.hatColor} roughness={0.7} />
      </mesh>
      {/* hat feather */}
      <mesh position={[0.12, 1.32, 0]} rotation={[0, 0, -0.6]}>
        <coneGeometry args={[0.02, 0.22, 6]} />
        <meshStandardMaterial color="#c9a24b" />
      </mesh>

      {/* Arms (pivot at shoulder) */}
      <group ref={leftArm} position={[-0.22, 0.82, 0.05]}>
        <mesh position={[0, -0.18, 0.05]} castShadow>
          <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
          <meshStandardMaterial color={member.color} roughness={0.7} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.22, 0.82, 0.05]}>
        <mesh position={[0, -0.18, 0.05]} castShadow>
          <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
          <meshStandardMaterial color={member.color} roughness={0.7} />
        </mesh>
      </group>

      {/* Instrument held in front */}
      <group position={[0, 0.55, 0.2]}>
        <Instrument
          type={member.instrumentType}
          playing={isPlaying && !!song}
          intensity={energy}
        />
      </group>

      {/* Hover tooltip */}
      {hovered && !isFocused && (
        <Html position={[0, 1.6, 0]} center distanceFactor={8} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap border-2 border-tavern-gold bg-tavern-shadow/95 px-2.5 py-1 text-[11px] text-tavern-linen font-mono uppercase tracking-wider shadow-brutal-cobalt">
            Meet {member.name}
          </div>
        </Html>
      )}

      {/* Focus ring on ground */}
      {isFocused && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.42, 24]} />
          <meshBasicMaterial color="#e7c66a" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

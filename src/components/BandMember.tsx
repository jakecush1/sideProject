import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
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

export default function BandMember({ member, index }: Props) {
  const group = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const head = useRef<Group>(null);

  const [hovered, setHovered] = useState(false);

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

  // Body proportions — "lanky" is ~1.5x the standard height, much skinnier,
  // long-armed, and hunched forward like a goblin (torsoTilt pitches the
  // torso, headZ/shoulderZ jut the head and shoulders forward over it).
  const P =
    member.build === "lanky"
      ? {
          torsoR: 0.14,
          torsoLen: 0.85,
          torsoY: 0.88,
          torsoZ: 0.08,
          torsoTilt: 0.38,
          headY: 1.46,
          headZ: 0.32,
          featherY: 1.7,
          shoulderX: 0.15,
          shoulderY: 1.3,
          shoulderZ: 0.24,
          armR: 0.042,
          armLen: 0.6,
          armOffY: -0.34,
          instrY: 0.85,
          tipY: 2.0,
        }
      : {
          torsoR: 0.24,
          torsoLen: 0.32,
          torsoY: 0.62,
          torsoZ: 0,
          torsoTilt: 0,
          headY: 1.08,
          headZ: 0,
          featherY: 1.32,
          shoulderX: 0.22,
          shoulderY: 0.82,
          shoulderZ: 0.05,
          armR: 0.06,
          armLen: 0.28,
          armOffY: -0.18,
          instrY: 0.55,
          tipY: 1.6,
        };

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
      <mesh position={[0, P.torsoY, P.torsoZ]} rotation={[P.torsoTilt, 0, 0]} castShadow>
        <capsuleGeometry args={[P.torsoR, P.torsoLen, 6, 12]} />
        <meshStandardMaterial
          color={member.color}
          roughness={0.7}
          emissive={highlight ? member.color : "#000000"}
          emissiveIntensity={highlight ? 0.35 : 0}
        />
      </mesh>

      {/* Head (hat rides inside so it follows the goblin jut) */}
      <group ref={head} position={[0, P.headY, P.headZ]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshStandardMaterial color="#e8b48c" roughness={0.6} />
        </mesh>
        {/* eyeballs — mostly hidden behind the shades, but they're in there */}
        {[-0.06, 0.06].map((x) => (
          <group key={x} position={[x, 0.03, 0.13]}>
            <mesh>
              <sphereGeometry args={[0.026, 10, 10]} />
              <meshStandardMaterial color="#f5f2ea" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.018]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshStandardMaterial color="#2a1c10" roughness={0.3} />
            </mesh>
          </group>
        ))}
        {/* wayfarer-style shades: chunky dark lenses, browline bar, temple
            arms hooking back over the ears — very un-medieval, very cool */}
        <group position={[0, 0.035, 0]}>
          {[-0.063, 0.063].map((x) => (
            <mesh key={x} position={[x, 0, 0.165]} castShadow>
              <boxGeometry args={[0.095, 0.07, 0.03]} />
              <meshStandardMaterial color="#101010" roughness={0.15} metalness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, 0.04, 0.163]}>
            <boxGeometry args={[0.225, 0.022, 0.034]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.012, 0.168]}>
            <boxGeometry args={[0.04, 0.014, 0.02]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.4} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.135, 0.035, 0.075]}
              rotation={[0, side * -0.34, 0]}
            >
              <boxGeometry args={[0.014, 0.018, 0.19]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.4} />
            </mesh>
          ))}
        </group>
        {/* Hat (cap) + feather — children of the head so they bob and jut with it */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <coneGeometry args={[0.2, 0.22, 12]} />
          <meshStandardMaterial color={member.hatColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.12, 0.24, 0]} rotation={[0, 0, -0.6]}>
          <coneGeometry args={[0.02, 0.22, 6]} />
          <meshStandardMaterial color="#c9a24b" />
        </mesh>
        {/* Long hair hanging from under the hat, down past the shoulders */}
        {member.hairColor && (
          <group>
            {/* back curtain */}
            <mesh position={[0, -0.14, -0.12]} rotation={[0.12, 0, 0]} castShadow>
              <boxGeometry args={[0.26, 0.46, 0.07]} />
              <meshStandardMaterial color={member.hairColor} roughness={0.9} />
            </mesh>
            {/* side strands framing the face */}
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                position={[side * 0.155, -0.16, 0.02]}
                rotation={[0, 0, side * -0.08]}
                castShadow
              >
                <boxGeometry args={[0.07, 0.42, 0.11]} />
                <meshStandardMaterial color={member.hairColor} roughness={0.9} />
              </mesh>
            ))}
            {/* crown fringe peeking out under the hat brim */}
            <mesh position={[0, 0.05, -0.05]}>
              <sphereGeometry args={[0.175, 12, 10, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.35]} />
              <meshStandardMaterial color={member.hairColor} roughness={0.9} />
            </mesh>
          </group>
        )}
      </group>

      {/* Arms (pivot at shoulder) */}
      <group ref={leftArm} position={[-P.shoulderX, P.shoulderY, P.shoulderZ]}>
        <mesh position={[0, P.armOffY, 0.05]} castShadow>
          <capsuleGeometry args={[P.armR, P.armLen, 4, 8]} />
          <meshStandardMaterial color={member.color} roughness={0.7} />
        </mesh>
      </group>
      <group ref={rightArm} position={[P.shoulderX, P.shoulderY, P.shoulderZ]}>
        <mesh position={[0, P.armOffY, 0.05]} castShadow>
          <capsuleGeometry args={[P.armR, P.armLen, 4, 8]} />
          <meshStandardMaterial color={member.color} roughness={0.7} />
        </mesh>
      </group>

      {/* Instrument held in front. The organ is furniture, not part of the
          player — swallow its pointer events so only Joan himself is
          clickable, not the whole console. */}
      <group
        position={[0, P.instrY, 0.2]}
        {...(member.instrumentType === "organ"
          ? {
              onClick: (e: { stopPropagation: () => void }) => e.stopPropagation(),
              onPointerOver: (e: { stopPropagation: () => void }) => e.stopPropagation(),
            }
          : {})}
      >
        <Instrument
          type={member.instrumentType}
          playing={isPlaying && !!song}
          intensity={energy}
        />
      </group>

      {/* Hover tooltip */}
      {hovered && !isFocused && (
        <Html position={[0, P.tipY, 0]} center distanceFactor={8} zIndexRange={[10, 0]}>
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

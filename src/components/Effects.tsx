import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useGameStore } from "../lib/useGameStore";

// EFFECTS
// Floating musical notes that rise from the band when a song plays.
// Built from primitive geometry (note head + stem + flag) so there is NO
// font fetch and nothing can suspend the canvas. Lightweight fixed pool.

const NOTE_COUNT = 10;

type NoteSeed = {
  x: number;
  z: number;
  speed: number;
  phase: number;
  color: string;
  flag: boolean;
};

function Note({ color, flag }: { color: string; flag: boolean }) {
  return (
    <group>
      {/* note head */}
      <mesh rotation={[0, 0, -0.4]}>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* stem */}
      <mesh position={[0.08, 0.16, 0]}>
        <boxGeometry args={[0.02, 0.32, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* flag (eighth-note tail) */}
      {flag && (
        <mesh position={[0.13, 0.28, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.08, 0.12, 0.015]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

export default function Effects() {
  const isPlaying = useGameStore((s) => s.isPlaying);
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  const seeds = useMemo<NoteSeed[]>(
    () =>
      Array.from({ length: NOTE_COUNT }).map((_, i) => ({
        x: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 3 - 0.5,
        speed: 0.4 + Math.random() * 0.4,
        phase: (i / NOTE_COUNT) * Math.PI * 2,
        color: ["#e7c66a", "#d99a4e", "#f3e6cf"][i % 3],
        flag: i % 2 === 0,
      })),
    []
  );

  const refs = useRef<(Group | null)[]>([]);

  useFrame((state) => {
    if (!isPlaying) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((seed, i) => {
      const node = refs.current[i];
      if (!node) return;
      const cycle = (t * seed.speed + seed.phase) % (Math.PI * 2);
      const progress = cycle / (Math.PI * 2);
      node.position.y = 1.2 + progress * 2.2;
      node.position.x = seed.x + Math.sin(t * seed.speed * 2 + seed.phase) * 0.3;
      node.position.z = seed.z;
      node.rotation.y = t * seed.speed;
      const scale = Math.sin(progress * Math.PI) * (reducedMotion ? 0.6 : 1);
      node.scale.setScalar(Math.max(0.001, scale));
    });
  });

  if (!isPlaying) return null;

  return (
    <group>
      {seeds.map((seed, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <Note color={seed.color} flag={seed.flag} />
        </group>
      ))}
    </group>
  );
}

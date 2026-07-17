import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import type { ClickableObject as ClickableObjectData } from "../data/clickableObjects";
import { useGameStore } from "../lib/useGameStore";

// CLICKABLE OBJECT
// Glowing interactive props that trigger songs. Each kind renders different
// primitive geometry. Hover = scale bounce + glow + tooltip.

type Props = { object: ClickableObjectData };

export default function ClickableObject({ object }: Props) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectSong = useGameStore((s) => s.selectSong);
  const currentSongId = useGameStore((s) => s.currentSongId);
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  const isActive = object.songId === currentSongId;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const targetScale = hovered ? 1.18 : 1;
    const base = object.scale ?? 1;
    // smooth scale
    const cur = group.current.scale.x / base;
    const next = cur + (targetScale - cur) * 0.15;
    group.current.scale.setScalar(next * base);

    // gentle float for glowing trigger props (not tapestry)
    if (object.kind !== "tapestry" && !reducedMotion) {
      group.current.position.y =
        object.position[1] + Math.sin(t * 2 + object.position[0]) * 0.03;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (object.action === "play-song" && object.songId) {
      selectSong(object.songId);
    }
  };

  const glow = hovered || isActive;
  const glowColor = isActive ? "#ffd97a" : "#e7c66a";

  return (
    <group
      ref={group}
      position={object.position}
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
      {renderKind(object, glow, glowColor)}

      {/* glow halo */}
      {glow && object.kind !== "tapestry" && (
        <pointLight color={glowColor} intensity={1.2} distance={1.6} />
      )}

      {hovered && (
        <Html position={[0, object.kind === "tapestry" ? 1.6 : 0.5, 0]} center distanceFactor={9}>
          <div className="pointer-events-none whitespace-nowrap border-2 border-tavern-gold bg-tavern-shadow/95 px-2.5 py-1 text-[11px] text-tavern-linen font-mono uppercase tracking-wider shadow-brutal-cobalt">
            {object.label}
          </div>
        </Html>
      )}
    </group>
  );
}

function renderKind(
  object: ClickableObjectData,
  glow: boolean,
  glowColor: string
) {
  const emissiveIntensity = glow ? 0.7 : 0.25;

  switch (object.kind) {
    case "scroll":
      return (
        <group rotation={[0, 0.3, 0]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.34, 12]} />
            <meshStandardMaterial
              color="#e8d8a8"
              emissive={glowColor}
              emissiveIntensity={emissiveIntensity}
              roughness={0.6}
            />
          </mesh>
          {/* ribbon */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.062, 0.012, 8, 16]} />
            <meshStandardMaterial color="#6b1f2a" />
          </mesh>
        </group>
      );
    case "goblet":
      return (
        <group>
          {/* cup */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.05, 0.16, 12]} />
            <meshStandardMaterial
              color="#c9a24b"
              metalness={0.6}
              roughness={0.3}
              emissive={glowColor}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* stem */}
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshStandardMaterial color="#9a7d35" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* base */}
          <mesh position={[0, -0.09, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
            <meshStandardMaterial color="#9a7d35" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      );
    case "barrel":
      return (
        <group scale={0.9}>
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.4, 1.0, 16]} />
            <meshStandardMaterial
              color="#5a3a1d"
              roughness={0.8}
              emissive={glowColor}
              emissiveIntensity={glow ? 0.4 : 0}
            />
          </mesh>
          {[-0.3, 0, 0.3].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <torusGeometry args={[0.46, 0.025, 8, 24]} />
              <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.5} />
            </mesh>
          ))}
          {/* glowing tap */}
          <mesh position={[0, -0.1, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
            <meshStandardMaterial
              color="#c9a24b"
              emissive={glowColor}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        </group>
      );
    case "tapestry":
      return (
        <mesh castShadow>
          <planeGeometry args={[2.2, 3.0]} />
          <meshStandardMaterial
            color="#2f4a6b"
            roughness={0.9}
            side={2}
            emissive={glowColor}
            emissiveIntensity={glow ? 0.3 : 0.05}
          />
        </mesh>
      );
    case "candle":
      return (
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.24, 8]} />
          <meshStandardMaterial
            color="#e8dcc0"
            emissive={glowColor}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      );
  }
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, PointLight } from "three";
import { useGameStore } from "../lib/useGameStore";

// TAVERN ENVIRONMENT
// All static set dressing: floor, walls, table, barrels, fireplace, window,
// candles, rug, hanging banners. Built from primitives for performance.

function Candle({ position }: { position: [number, number, number] }) {
  const flame = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const isPlaying = useGameStore((s) => s.isPlaying);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = reducedMotion
      ? 1
      : 0.8 + Math.sin(t * 12 + position[0]) * 0.1 + Math.random() * 0.08;
    const energy = isPlaying ? 1.3 : 1;
    if (flame.current) {
      flame.current.scale.y = flicker * energy;
      flame.current.scale.x = (0.9 + Math.sin(t * 9) * 0.05) * energy;
    }
    if (light.current) {
      light.current.intensity = flicker * energy * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* candle body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.22, 8]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.6} />
      </mesh>
      {/* flame */}
      <mesh ref={flame} position={[0, 0.18, 0]}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshBasicMaterial color="#ffce6b" />
      </mesh>
      <pointLight
        ref={light}
        position={[0, 0.22, 0]}
        color="#ffb347"
        intensity={0.8}
        distance={3.5}
        decay={2}
      />
    </group>
  );
}

function Barrel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.4, 1.0, 16]} />
        <meshStandardMaterial color="#5a3a1d" roughness={0.8} />
      </mesh>
      {/* metal bands */}
      {[-0.3, 0, 0.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.46, 0.025, 8, 24]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function TavernEnvironment() {
  const fireLight = useRef<PointLight>(null);
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  useFrame((state) => {
    if (fireLight.current && !reducedMotion) {
      const t = state.clock.elapsedTime;
      fireLight.current.intensity = 1.6 + Math.sin(t * 8) * 0.3 + Math.random() * 0.2;
    }
  });

  return (
    <group>
      {/* FLOOR — wooden planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>
      {/* plank lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-8 + i * 2, 0.01, 0]}
        >
          <planeGeometry args={[0.04, 18]} />
          <meshStandardMaterial color="#2a1a0e" />
        </mesh>
      ))}

      {/* RUG */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.3]} receiveShadow>
        <circleGeometry args={[3.2, 32]} />
        <meshStandardMaterial color="#6b1f2a" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0.3]}>
        <ringGeometry args={[2.7, 3.0, 32]} />
        <meshStandardMaterial color="#c9a24b" roughness={0.9} />
      </mesh>

      {/* BACK WALL — stone */}
      <mesh position={[0, 3, -4]} receiveShadow>
        <boxGeometry args={[18, 6, 0.4]} />
        <meshStandardMaterial color="#4a4036" roughness={1} />
      </mesh>
      {/* LEFT WALL */}
      <mesh position={[-7, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 6, 0.4]} />
        <meshStandardMaterial color="#433a30" roughness={1} />
      </mesh>
      {/* RIGHT WALL */}
      <mesh position={[7, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 6, 0.4]} />
        <meshStandardMaterial color="#433a30" roughness={1} />
      </mesh>

      {/* ARCHED WINDOW with moonlight */}
      <group position={[-4.5, 3.4, -3.78]}>
        <mesh>
          <boxGeometry args={[1.6, 2.2, 0.1]} />
          <meshStandardMaterial color="#1a2438" />
        </mesh>
        {/* moonlight glow */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1.4, 2.0, 0.05]} />
          <meshStandardMaterial
            color="#acc4ff"
            emissive="#6c84cf"
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* cross frame */}
        <mesh>
          <boxGeometry args={[0.08, 2.2, 0.14]} />
          <meshStandardMaterial color="#2a1c10" />
        </mesh>
        <mesh>
          <boxGeometry args={[1.6, 0.08, 0.14]} />
          <meshStandardMaterial color="#2a1c10" />
        </mesh>
      </group>
      <pointLight
        position={[-4.5, 3.4, -3.2]}
        color="#8ca8ff"
        intensity={0.5}
        distance={6}
      />

      {/* FIREPLACE (right back corner) */}
      <group position={[4.5, 0, -3.4]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[2, 2.4, 0.6]} />
          <meshStandardMaterial color="#3a342c" roughness={1} />
        </mesh>
        {/* opening */}
        <mesh position={[0, 0.7, 0.25]}>
          <boxGeometry args={[1.2, 1.2, 0.3]} />
          <meshStandardMaterial color="#0a0603" />
        </mesh>
        {/* fire glow */}
        <mesh position={[0, 0.5, 0.3]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshBasicMaterial color="#ff7a1c" />
        </mesh>
        <pointLight
          ref={fireLight}
          position={[0, 0.7, 0.5]}
          color="#ff7a2c"
          intensity={1.6}
          distance={8}
          decay={2}
          castShadow
        />
      </group>

      {/* CENTRAL TABLE */}
      <group position={[0, 0, 1.7]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.08, 20]} />
          <meshStandardMaterial color="#5c3d22" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.42, 8]} />
          <meshStandardMaterial color="#3d2817" roughness={0.8} />
        </mesh>
      </group>

      {/* BARRELS */}
      <Barrel position={[3.1, 0.5, -2.2]} />
      <Barrel position={[-4.2, 0.5, -2.6]} />

      {/* CANDLES around the scene */}
      <Candle position={[-0.5, 0.46, 1.7]} />
      <Candle position={[0.5, 0.46, 1.9]} />
      <Candle position={[-3.2, 0.0, -3.2]} />
      <Candle position={[2.0, 1.2, -3.4]} />

      {/* HANGING BANNERS on back wall */}
      <mesh position={[-1.8, 3.6, -3.78]} castShadow>
        <planeGeometry args={[1.0, 2.4]} />
        <meshStandardMaterial color="#6b1f2a" roughness={0.9} side={2} />
      </mesh>
      <mesh position={[1.8, 3.6, -3.78]} castShadow>
        <planeGeometry args={[1.0, 2.4]} />
        <meshStandardMaterial color="#2f4a3c" roughness={0.9} side={2} />
      </mesh>

      {/* Mugs on table */}
      <mesh position={[0.3, 0.52, 1.5]} castShadow>
        <cylinderGeometry args={[0.08, 0.07, 0.16, 10]} />
        <meshStandardMaterial color="#caa84d" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[-0.35, 0.52, 1.9]} castShadow>
        <cylinderGeometry args={[0.08, 0.07, 0.16, 10]} />
        <meshStandardMaterial color="#9a8540" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { Instrument as InstrumentType } from "../data/bandMembers";

// INSTRUMENT
// Procedural low-poly instruments built from primitives.
// To use a real model later: replace the returned JSX for a given type
// with a <primitive object={gltf.scene} /> loaded via useGLTF.

type Props = {
  type: InstrumentType;
  playing: boolean;
  intensity: number; // 0..1 animation energy (tied to song mood/bpm)
};

export default function Instrument({ type, playing, intensity }: Props) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    if (playing) {
      // subtle instrument motion while playing
      ref.current.rotation.z = Math.sin(t * 6 * (0.5 + intensity)) * 0.05 * intensity;
    } else {
      ref.current.rotation.z = Math.sin(t * 1.2) * 0.01;
    }
  });

  return <group ref={ref}>{renderInstrument(type)}</group>;
}

function renderInstrument(type: InstrumentType) {
  switch (type) {
    case "lute":
      return (
        <group rotation={[0.3, 0, -0.4]} position={[0.15, 0.05, 0.25]}>
          {/* body */}
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 12]} />
            <meshStandardMaterial color="#7a4a1e" roughness={0.6} />
          </mesh>
          {/* soundhole */}
          <mesh position={[0, 0, 0.17]}>
            <circleGeometry args={[0.05, 16]} />
            <meshStandardMaterial color="#1a0e05" />
          </mesh>
          {/* neck */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshStandardMaterial color="#5a3416" roughness={0.6} />
          </mesh>
          {/* pegbox */}
          <mesh position={[0, 0.6, 0]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.07, 0.12, 0.05]} />
            <meshStandardMaterial color="#3d2410" />
          </mesh>
        </group>
      );
    case "fiddle":
      return (
        <group rotation={[0, 0, 0.5]} position={[0.2, 0.25, 0.15]}>
          {/* body */}
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.32, 0.06]} />
            <meshStandardMaterial color="#8a3a1e" roughness={0.5} />
          </mesh>
          {/* neck */}
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.04, 0.28, 0.04]} />
            <meshStandardMaterial color="#5a2814" />
          </mesh>
          {/* bow */}
          <mesh position={[0.18, 0.05, 0.1]} rotation={[0, 0, 1.4]}>
            <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
            <meshStandardMaterial color="#d8c8a8" />
          </mesh>
        </group>
      );
    case "drum":
      return (
        <group position={[0, 0.05, 0.3]} rotation={[1.2, 0, 0]}>
          {/* drum shell */}
          <mesh castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.12, 20]} />
            <meshStandardMaterial color="#6b4423" roughness={0.7} />
          </mesh>
          {/* skin */}
          <mesh position={[0, 0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.255, 20]} />
            <meshStandardMaterial color="#d9c2a0" roughness={0.8} />
          </mesh>
        </group>
      );
    case "flute":
      return (
        <group rotation={[0, 0, -1.4]} position={[0.18, 0.28, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.03, 0.6, 12]} />
            <meshStandardMaterial color="#c8a24b" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* holes */}
          {[-0.15, -0.05, 0.05, 0.15].map((y, i) => (
            <mesh key={i} position={[0.028, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.02, 6]} />
              <meshStandardMaterial color="#2a1c0c" />
            </mesh>
          ))}
        </group>
      );
  }
}

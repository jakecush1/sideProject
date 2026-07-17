import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useGameStore } from "../lib/useGameStore";

// BARMAID
// A buxom blonde tavern wench doing endless laps of the room with a
// pitcher of beer, dodging the band, the horse, and the keg. Primitive-built
// and fully cartoon, like everyone else in here.

export default function Barmaid() {
  const walker = useRef<Group>(null);
  const body = useRef<Group>(null);
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  useFrame((state) => {
    if (!walker.current) return;
    const raw = state.clock.elapsedTime;
    // elliptical stroll around the band circle
    const t = (reducedMotion ? 0 : raw) * 0.22 + 1.2;
    const x = -0.4 + Math.sin(t) * 4.3;
    const z = 0.7 + Math.cos(t) * 2.9;
    walker.current.position.set(x, 0, z);
    // face the direction of travel
    walker.current.rotation.y = Math.atan2(Math.cos(t) * 4.3, -Math.sin(t) * 2.9);
    if (body.current && !reducedMotion) {
      // brisk walk bob + hip sway
      body.current.position.y = Math.abs(Math.sin(raw * 6)) * 0.045;
      body.current.rotation.z = Math.sin(raw * 6) * 0.045;
    }
  });

  return (
    <group ref={walker}>
      <group ref={body}>
        {/* skirt to the floor (nobody has to animate legs) */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.42, 0.9, 12]} />
          <meshStandardMaterial color="#7e2f28" roughness={0.85} />
        </mesh>
        {/* apron */}
        <mesh position={[0, 0.42, 0.27]} rotation={[0.18, 0, 0]}>
          <planeGeometry args={[0.3, 0.6]} />
          <meshStandardMaterial color="#e8dcc0" roughness={0.95} />
        </mesh>
        {/* bodice */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <capsuleGeometry args={[0.165, 0.22, 6, 10]} />
          <meshStandardMaterial color="#3f4a33" roughness={0.8} />
        </mesh>
        {/* chemise bustline */}
        {[-0.08, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 1.08, 0.12]} castShadow>
            <sphereGeometry args={[0.095, 12, 10]} />
            <meshStandardMaterial color="#e8dcc0" roughness={0.85} />
          </mesh>
        ))}
        <mesh position={[0, 1.16, 0.08]}>
          <boxGeometry args={[0.27, 0.08, 0.12]} />
          <meshStandardMaterial color="#e8dcc0" roughness={0.85} />
        </mesh>

        {/* right arm carrying the pitcher out front */}
        <group position={[0.19, 1.12, 0.04]} rotation={[-1.15, 0, -0.15]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.26, 4, 8]} />
            <meshStandardMaterial color="#e8dcc0" roughness={0.85} />
          </mesh>
          {/* PITCHER OF BEER */}
          <group position={[0, -0.36, 0.02]} rotation={[1.15, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.075, 0.095, 0.2, 10]} />
              <meshStandardMaterial color="#8a6a3e" roughness={0.6} />
            </mesh>
            {/* foam head */}
            <mesh position={[0, 0.11, 0]} scale={[1, 0.55, 1]}>
              <sphereGeometry args={[0.075, 10, 8]} />
              <meshStandardMaterial color="#f0ead8" roughness={0.9} />
            </mesh>
            {/* handle */}
            <mesh position={[0.09, 0, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.055, 0.014, 6, 12, Math.PI]} />
              <meshStandardMaterial color="#6e4a26" roughness={0.6} />
            </mesh>
          </group>
        </group>
        {/* left arm on hip */}
        <mesh position={[-0.21, 1.02, 0.02]} rotation={[0, 0, 1.1]} castShadow>
          <capsuleGeometry args={[0.05, 0.22, 4, 8]} />
          <meshStandardMaterial color="#3f4a33" roughness={0.8} />
        </mesh>

        {/* head */}
        <group position={[0, 1.42, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#e8b48c" roughness={0.6} />
          </mesh>
          {/* rosy cheeks */}
          {[-0.08, 0.08].map((x, i) => (
            <mesh key={i} position={[x, -0.02, 0.115]}>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshStandardMaterial color="#d98a72" roughness={0.7} />
            </mesh>
          ))}
          {/* blonde hair: crown, back curtain, twin braids */}
          <mesh position={[0, 0.05, -0.03]}>
            <sphereGeometry args={[0.155, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#d9b35c" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.14, -0.11]} castShadow>
            <boxGeometry args={[0.22, 0.3, 0.07]} />
            <meshStandardMaterial color="#d9b35c" roughness={0.9} />
          </mesh>
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh position={[side * 0.14, -0.2, 0.04]} rotation={[0, 0, side * 0.12]} castShadow>
                <cylinderGeometry args={[0.032, 0.026, 0.38, 8]} />
                <meshStandardMaterial color="#d9b35c" roughness={0.9} />
              </mesh>
              <mesh position={[side * 0.165, -0.41, 0.06]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color="#c9a04a" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

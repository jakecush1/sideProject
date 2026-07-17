import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useGameStore } from "../lib/useGameStore";

// BAR
// A timber bar along the right wall: counter, back shelf with bottles, a
// barkeep polishing nothing in particular, three stools, and three deeply
// drunk patrons. The counter is littered with empty tankards and a jar of
// pickled eggs. Primitive-built to match the rest of the tavern.

const SKIN = "#e8b48c";

// Cartoon eyeballs: white sphere + dark pupil, one pair, centred on `position`
function Eyes({
  position,
  spread = 0.05,
  size = 0.028,
}: {
  position: [number, number, number];
  spread?: number;
  size?: number;
}) {
  return (
    <>
      {[-spread, spread].map((x, i) => (
        <group key={i} position={[position[0] + x, position[1], position[2]]}>
          <mesh>
            <sphereGeometry args={[size, 10, 10]} />
            <meshStandardMaterial color="#f5f2ea" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, size * 0.75]}>
            <sphereGeometry args={[size * 0.45, 8, 8]} />
            <meshStandardMaterial color="#2a1c10" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Tankard({
  position,
  tipped = false,
  glass = false,
}: {
  position: [number, number, number];
  tipped?: boolean;
  glass?: boolean;
}) {
  return (
    <mesh
      position={position}
      rotation={tipped ? [0, 0.4, Math.PI / 2] : [0, 0, 0]}
      castShadow
    >
      <cylinderGeometry args={[0.055, 0.05, 0.14, 10]} />
      {glass ? (
        <meshStandardMaterial color="#d8d2c0" transparent opacity={0.4} roughness={0.2} />
      ) : (
        <meshStandardMaterial color="#a89878" metalness={0.5} roughness={0.5} />
      )}
    </mesh>
  );
}

function PickledEggJar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* brine */}
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.24, 12]} />
        <meshStandardMaterial color="#98a565" transparent opacity={0.5} roughness={0.4} />
      </mesh>
      {/* eggs */}
      {(
        [
          [0, 0.07, 0],
          [0.05, 0.09, 0.04],
          [-0.05, 0.08, -0.03],
          [0.02, 0.17, -0.04],
          [-0.03, 0.18, 0.04],
        ] as const
      ).map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1, 1.25, 1]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color="#e8e0cc" roughness={0.6} />
        </mesh>
      ))}
      {/* glass */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.3, 12]} />
        <meshStandardMaterial color="#c9d4b0" transparent opacity={0.28} roughness={0.15} />
      </mesh>
      {/* lid */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.135, 0.135, 0.035, 12]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Ragged patches + dangling hem strips shared by every drunkard's outfit
function Rags({ tunic }: { tunic: string }) {
  return (
    <>
      {/* mismatched patches */}
      <mesh position={[0.09, 0.32, 0.17]} rotation={[0.2, 0, 0.4]}>
        <boxGeometry args={[0.09, 0.07, 0.012]} />
        <meshStandardMaterial color="#4a4034" roughness={1} />
      </mesh>
      <mesh position={[-0.11, 0.22, 0.15]} rotation={[0.1, 0, -0.3]}>
        <boxGeometry args={[0.07, 0.09, 0.012]} />
        <meshStandardMaterial color="#8a7a5e" roughness={1} />
      </mesh>
      <mesh position={[0.02, 0.42, -0.17]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.1, 0.06, 0.012]} />
        <meshStandardMaterial color="#3d362c" roughness={1} />
      </mesh>
      {/* tattered hem strips */}
      {[-0.12, -0.04, 0.05, 0.13].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.12 + (i % 2) * 0.04]} rotation={[0.15, 0, (i - 1.5) * 0.2]}>
          <boxGeometry args={[0.05, 0.14, 0.015]} />
          <meshStandardMaterial color={i % 2 ? tunic : "#4a4034"} roughness={1} />
        </mesh>
      ))}
    </>
  );
}

// A patron far past their limit, dressed in rags. Built facing local +z;
// the parent rotates them toward the bar. Poses: "toasting" (lurching wildly,
// mug aloft), "slumped" (face down on the counter), "floored" (lost the
// fight with gravity entirely — flat on the floor by a tipped stool).
function Drunkard({
  position,
  tunic,
  pose,
  phase,
}: {
  position: [number, number, number];
  tunic: string;
  pose: "toasting" | "slumped" | "floored";
  phase: number;
}) {
  const ref = useRef<Group>(null);
  const swigArm = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    // periodic swig: long pauses, then a committed pull on the mug
    const swig = Math.pow(Math.max(0, Math.sin(t * 0.55 + phase)), 3);
    if (pose === "slumped") {
      // barely moving, the occasional heave
      ref.current.rotation.z = Math.sin(t * 0.4 + phase) * 0.02;
    } else if (pose === "floored") {
      // faint breathing twitch + hoisting the tankard for a horizontal sip
      ref.current.position.y = Math.abs(Math.sin(t * 0.9 + phase)) * 0.008;
      if (swigArm.current) swigArm.current.rotation.z = 1.45 - swig * 1.05;
    } else {
      // huge slow lurches, permanently on the verge of falling off the stool
      ref.current.rotation.z =
        Math.sin(t * 0.5 + phase) * 0.3 + Math.sin(t * 1.9 + phase) * 0.06;
      ref.current.rotation.x = 0.1 + Math.sin(t * 0.4 + phase + 1) * 0.12;
      // mug swings from raised toast down to the mouth, head rocks back
      if (swigArm.current) swigArm.current.rotation.z = -2.5 + swig * 1.35;
      if (headRef.current) headRef.current.rotation.x = -0.15 - swig * 0.5;
    }
  });

  if (pose === "floored") {
    return (
      <group position={position} rotation={[0, Math.PI / 2, 0]}>
        <group ref={ref}>
          {/* sprawled torso */}
          <mesh position={[0, 0.19, 0.1]} rotation={[Math.PI / 2 - 0.15, 0, 0.25]} castShadow>
            <capsuleGeometry args={[0.19, 0.3, 6, 10]} />
            <meshStandardMaterial color={tunic} roughness={1} />
          </mesh>
          {/* head on the floorboards, nose to the rafters */}
          <group position={[0.08, 0.15, 0.55]}>
            <mesh castShadow>
              <sphereGeometry args={[0.145, 14, 14]} />
              <meshStandardMaterial color={SKIN} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.13, 0.02]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#c05a4a" roughness={0.6} />
            </mesh>
          </group>
          {/* one bare arm flung wide */}
          <mesh position={[-0.25, 0.08, 0.05]} rotation={[0, -0.7, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.045, 0.3, 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
          {/* the other still working the tankard, hoisted for horizontal sips */}
          <group ref={swigArm} position={[0.24, 0.14, 0.35]} rotation={[0, 0, 1.45]}>
            <mesh position={[0, 0.16, 0]} castShadow>
              <capsuleGeometry args={[0.045, 0.28, 4, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.36, 0]}>
              <cylinderGeometry args={[0.055, 0.05, 0.13, 10]} />
              <meshStandardMaterial color="#a89878" metalness={0.5} roughness={0.5} />
            </mesh>
          </group>
          {/* a previous casualty, spilled nearby */}
          <mesh position={[0.5, 0.06, 0.75]} rotation={[0, 0.3, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.05, 0.13, 10]} />
            <meshStandardMaterial color="#a89878" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
        {/* stool, tipped over in the incident */}
        <mesh position={[-0.35, 0.22, -0.25]} rotation={[0.3, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.24, 0.66, 10]} />
          <meshStandardMaterial color="#4a3018" roughness={0.8} />
        </mesh>
      </group>
    );
  }

  const slumped = pose === "slumped";
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <group ref={ref} position={[0, 0.66, 0]}>
        {/* torso — pitched onto the bar when slumped */}
        <group rotation={slumped ? [1.0, 0, 0] : [0, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <capsuleGeometry args={[0.19, 0.3, 6, 10]} />
            <meshStandardMaterial color={tunic} roughness={1} />
          </mesh>
          <Rags tunic={tunic} />
          {/* head (rocks back with each swig when toasting) */}
          <group ref={headRef} position={[0, 0.62, slumped ? 0.06 : 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.145, 14, 14]} />
              <meshStandardMaterial color={SKIN} roughness={0.6} />
            </mesh>
            <Eyes position={[0, 0.04, 0.12]} spread={0.05} size={0.026} />
            {/* drunk-flushed nose */}
            <mesh position={[0, -0.01, 0.14]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#c05a4a" roughness={0.6} />
            </mesh>
          </group>
          {/* bare ragged arms */}
          {pose === "toasting" ? (
            <>
              {/* mug arm: swings between raised toast and mouth */}
              <group ref={swigArm} position={[0.2, 0.42, 0]} rotation={[0, 0, -2.5]}>
                <mesh position={[0, 0.18, 0]} castShadow>
                  <capsuleGeometry args={[0.045, 0.26, 4, 8]} />
                  <meshStandardMaterial color={SKIN} roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.38, 0]}>
                  <cylinderGeometry args={[0.055, 0.05, 0.13, 10]} />
                  <meshStandardMaterial color="#a89878" metalness={0.5} roughness={0.5} />
                </mesh>
              </group>
              <mesh position={[-0.2, 0.25, 0.05]} rotation={[0, 0, 0.5]} castShadow>
                <capsuleGeometry args={[0.045, 0.26, 4, 8]} />
                <meshStandardMaterial color={SKIN} roughness={0.7} />
              </mesh>
            </>
          ) : (
            // one arm flopped forward along the counter
            <mesh position={[0.14, 0.6, 0.12]} rotation={[1.2, 0, -0.2]} castShadow>
              <capsuleGeometry args={[0.045, 0.3, 4, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.7} />
            </mesh>
          )}
        </group>
      </group>
      {/* bar stool */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.66, 10]} />
        <meshStandardMaterial color="#4a3018" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Barkeep() {
  const ref = useRef<Group>(null);
  const bellyRef = useRef<Group>(null);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    // jolly belly-laugh: quick bounce, a chuckle sway, belly jiggling along
    const chuckle = Math.pow(Math.max(0, Math.sin(t * 0.35)), 2);
    ref.current.position.y = Math.sin(t * 1.3) * 0.015 + chuckle * Math.abs(Math.sin(t * 7)) * 0.03;
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.08;
    ref.current.rotation.z = chuckle * Math.sin(t * 7) * 0.03;
    if (bellyRef.current) {
      bellyRef.current.scale.setScalar(1 + chuckle * Math.abs(Math.sin(t * 7)) * 0.05);
    }
  });
  return (
    <group position={[6.35, 0, -0.2]} rotation={[0, -Math.PI / 2, 0]}>
      <group ref={ref}>
        {/* legs / long tunic */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.32, 0.8, 10]} />
          <meshStandardMaterial color="#3d2f22" roughness={0.85} />
        </mesh>
        {/* torso */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <capsuleGeometry args={[0.32, 0.3, 6, 10]} />
          <meshStandardMaterial color="#5a4a33" roughness={0.8} />
        </mesh>
        {/* the belly — a point of pride, jiggles when he laughs */}
        <group ref={bellyRef} position={[0, 0.88, 0.14]}>
          <mesh castShadow>
            <sphereGeometry args={[0.3, 14, 12]} />
            <meshStandardMaterial color="#5a4a33" roughness={0.8} />
          </mesh>
        </group>
        {/* apron stretched over the belly */}
        <mesh position={[0, 0.85, 0.38]} rotation={[0.28, 0, 0]}>
          <boxGeometry args={[0.44, 0.6, 0.04]} />
          <meshStandardMaterial color="#cfc0a0" roughness={0.9} />
        </mesh>
        {/* head — bald, rosy, mid-chuckle */}
        <mesh position={[0, 1.52, 0]} castShadow>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.6} />
        </mesh>
        <Eyes position={[0, 1.57, 0.145]} spread={0.06} size={0.03} />
        {/* rosy cheeks + jolly red nose */}
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 1.5, 0.135]}>
            <sphereGeometry args={[0.038, 8, 8]} />
            <meshStandardMaterial color="#d98a70" roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 1.53, 0.16]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#c86a54" roughness={0.6} />
        </mesh>
        {/* mustache flowing into a huge long beard, spilling down the belly */}
        <mesh position={[0, 1.47, 0.15]}>
          <boxGeometry args={[0.16, 0.035, 0.04]} />
          <meshStandardMaterial color="#6b4a2a" roughness={0.9} />
        </mesh>
        {/* cascading tiers, each a little narrower, following the belly curve */}
        <mesh position={[0, 1.36, 0.12]} scale={[1.1, 1.4, 0.8]} castShadow>
          <sphereGeometry args={[0.14, 12, 10]} />
          <meshStandardMaterial color="#6b4a2a" roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.18, 0.18]} scale={[0.95, 1.4, 0.7]} castShadow>
          <sphereGeometry args={[0.13, 12, 10]} />
          <meshStandardMaterial color="#6b4a2a" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.98, 0.3]} scale={[0.75, 1.4, 0.6]} castShadow>
          <sphereGeometry args={[0.12, 10, 8]} />
          <meshStandardMaterial color="#5f4225" roughness={0.95} />
        </mesh>
        {/* tapered tip resting on the belly shelf */}
        <mesh position={[0, 0.8, 0.4]} scale={[0.5, 1.3, 0.5]} castShadow>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshStandardMaterial color="#5f4225" roughness={0.95} />
        </mesh>
        {/* arms resting toward the counter, rag in hand */}
        <mesh position={[0.3, 1.05, 0.16]} rotation={[0.7, 0, -0.6]} castShadow>
          <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
          <meshStandardMaterial color="#5a4a33" roughness={0.8} />
        </mesh>
        <mesh position={[-0.3, 1.05, 0.16]} rotation={[0.7, 0, 0.6]} castShadow>
          <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
          <meshStandardMaterial color="#5a4a33" roughness={0.8} />
        </mesh>
        <mesh position={[-0.22, 0.95, 0.36]}>
          <boxGeometry args={[0.12, 0.1, 0.02]} />
          <meshStandardMaterial color="#d8d2c0" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

export default function Bar() {
  return (
    <group>
      {/* counter: front panel + polished top */}
      <mesh position={[5.75, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 1.04, 3.8]} />
        <meshStandardMaterial color="#6e4a26" roughness={0.8} />
      </mesh>
      <mesh position={[5.75, 1.08, 0]} castShadow>
        <boxGeometry args={[0.9, 0.09, 4.1]} />
        <meshStandardMaterial color="#8a5f33" roughness={0.5} />
      </mesh>

      {/* back shelf on the right wall with bottles */}
      <mesh position={[6.7, 1.9, 0]} castShadow>
        <boxGeometry args={[0.24, 0.06, 3.2]} />
        <meshStandardMaterial color="#5a3b20" roughness={0.8} />
      </mesh>
      {[-1.3, -0.8, -0.3, 0.25, 0.8, 1.3].map((z, i) => (
        <group key={i} position={[6.7, 1.93, z]}>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.055, 0.06, 0.26, 8]} />
            <meshStandardMaterial
              color={["#3f5a2e", "#7a4a1a", "#5a2e2e", "#3f5a2e", "#7a4a1a", "#44507a"][i]}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.018, 0.02, 0.1, 6]} />
            <meshStandardMaterial color="#2a1c10" roughness={0.5} />
          </mesh>
        </group>
      ))}

      <Barkeep />

      {/* patrons, in descending order of consciousness */}
      <Drunkard position={[4.95, 0, -1.25]} tunic="#6b5d48" pose="toasting" phase={0} />
      <Drunkard position={[4.95, 0, -0.1]} tunic="#75654a" pose="toasting" phase={2.1} />
      <Drunkard position={[4.95, 0, 0.95]} tunic="#5d5240" pose="slumped" phase={4.2} />

      {/* the evening's casualties: many empty tankards */}
      <Tankard position={[5.6, 1.19, -1.65]} />
      <Tankard position={[5.85, 1.15, -1.45]} tipped />
      <Tankard position={[5.7, 1.19, -0.95]} glass />
      <Tankard position={[5.95, 1.19, -0.7]} />
      <Tankard position={[5.55, 1.15, -0.45]} tipped glass />
      <Tankard position={[5.85, 1.19, -0.2]} />
      <Tankard position={[5.6, 1.19, 0.2]} />
      <Tankard position={[5.9, 1.15, 0.5]} tipped />
      <Tankard position={[5.65, 1.19, 0.75]} glass />
      <Tankard position={[5.55, 1.19, 1.15]} />
      <Tankard position={[5.9, 1.19, 1.3]} />

      {/* jar of pickled eggs at the end of the bar */}
      <PickledEggJar position={[5.75, 1.125, 1.7]} />
    </group>
  );
}

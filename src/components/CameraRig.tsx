import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useGameStore } from "../lib/useGameStore";
import { getBandMember } from "../data/bandMembers";

// CAMERA RIG
// Curated OrbitControls (constrained), gentle idle sway, focus-on-member,
// and a reset triggered via the store's resetCameraNonce-like pattern.
// Here we expose reset by watching focusedMemberId === "__reset__" sentinel
// is avoided; instead App calls controls through the exported ref hook below.

const DEFAULT_TARGET = new Vector3(0, 0.8, 0);
const DEFAULT_POS = new Vector3(0, 2.4, 7.5);

export default function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const focusedMemberId = useGameStore((s) => s.focusedMemberId);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const isPlaying = useGameStore((s) => s.isPlaying);

  const desiredTarget = useRef(DEFAULT_TARGET.clone());
  const desiredPos = useRef(DEFAULT_POS.clone());

  // Register reset handler on window so the UI button can call it.
  useEffect(() => {
    const reset = () => {
      desiredTarget.current.copy(DEFAULT_TARGET);
      desiredPos.current.copy(DEFAULT_POS);
      useGameStore.getState().focusMember(null);
    };
    window.addEventListener("reset-camera", reset);
    return () => window.removeEventListener("reset-camera", reset);
  }, []);

  // Update desired camera when focus changes
  useEffect(() => {
    if (focusedMemberId) {
      const m = getBandMember(focusedMemberId);
      if (m) {
        const [x, , z] = m.position;
        desiredTarget.current.set(x, 0.9, z);
        // position camera in front of the member, pulled toward center
        const dir = new Vector3(x, 0, z).normalize();
        desiredPos.current.set(x + dir.x * 2.2, 1.8, z + dir.z * 2.2 + 1.5);
      }
    } else {
      desiredTarget.current.copy(DEFAULT_TARGET);
      desiredPos.current.copy(DEFAULT_POS);
    }
  }, [focusedMemberId]);

  useFrame((state) => {
    if (!controls.current) return;

    // lerp target
    controls.current.target.lerp(desiredTarget.current, 0.05);

    // lerp camera position toward desired (plus subtle sway)
    const sway =
      reducedMotion || !isPlaying
        ? 0
        : Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    const goal = desiredPos.current.clone();
    goal.x += sway;
    camera.position.lerp(goal, 0.04);

    controls.current.update();
  });

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      minDistance={4}
      maxDistance={10}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.5}
      minAzimuthAngle={-Math.PI * 0.45}
      maxAzimuthAngle={Math.PI * 0.45}
      enableDamping
      dampingFactor={0.08}
    />
  );
}

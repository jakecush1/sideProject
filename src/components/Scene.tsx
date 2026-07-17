import { Suspense } from "react";
import { clickableObjects } from "../data/clickableObjects";
import { useGameStore } from "../lib/useGameStore";
import TavernEnvironment from "./TavernEnvironment";
import BandCircle from "./BandCircle";
import SpareInstruments from "./SpareInstruments";
import Horse from "./Horse";
import ClickableObject from "./ClickableObject";
import BottleSpawner from "./BottleSpawner";
import LightingRig from "./LightingRig";
import CameraRig from "./CameraRig";
import Effects from "./Effects";

export default function Scene() {
  const spawnBottles = useGameStore((s) => s.spawnBottles);

  return (
    <>
      <LightingRig />
      <CameraRig />
      <fog attach="fog" args={["#1c130b", 8, 22]} />

      {/* Invisible floor plane — clicking empty space spawns bottles */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        onClick={(e) => {
          e.stopPropagation();
          spawnBottles([e.point.x, 0, e.point.z]);
        }}
      >
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <TavernEnvironment />
      <BandCircle />
      <SpareInstruments />
      <Horse />

      {clickableObjects.map((obj) => (
        <ClickableObject key={obj.id} object={obj} />
      ))}

      <Suspense fallback={null}>
        <Effects />
      </Suspense>

      <BottleSpawner />
    </>
  );
}

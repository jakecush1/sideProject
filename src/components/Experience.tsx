import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Scene from "./Scene";

// EXPERIENCE
// The R3F Canvas + Suspense boundary. The loading fallback shows inside the
// canvas while assets (fonts for notes, etc.) resolve.

function CanvasLoader() {
  return (
    <Html center>
      <div className="font-medieval text-tavern-candle text-sm animate-pulse">
        Tuning lutes…
      </div>
    </Html>
  );
}

export default function Experience() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 2.4, 7.5], fov: 45 }}
      gl={{ antialias: true }}
      // Unify the render into warm sepia ink tones on paper.
      style={{ filter: "sepia(0.55) saturate(0.7) contrast(0.98) brightness(1.06)" }}
    >
      <color attach="background" args={["#e9dfc6"]} />
      <Suspense fallback={<CanvasLoader />}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

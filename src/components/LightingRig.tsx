import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type DirectionalLight, type AmbientLight } from "three";
import { useGameStore } from "../lib/useGameStore";
import { getSong } from "../data/songs";
import { MOOD_LIGHT } from "../lib/constants";

// LIGHTING RIG
// Base warm tavern light + a mood light that shifts color/intensity to match
// the current song. Smoothly lerps between moods.

export default function LightingRig() {
  const ambient = useRef<AmbientLight>(null);
  const key = useRef<DirectionalLight>(null);
  const targetColor = useRef(new Color(MOOD_LIGHT.idle.color));
  const targetIntensity = useRef(MOOD_LIGHT.idle.intensity);

  const isPlaying = useGameStore((s) => s.isPlaying);
  const currentSongId = useGameStore((s) => s.currentSongId);

  useFrame(() => {
    const song = getSong(currentSongId);
    const mood = isPlaying && song ? MOOD_LIGHT[song.mood] : MOOD_LIGHT.idle;
    targetColor.current.set(mood.color);
    targetIntensity.current = mood.intensity;

    if (key.current) {
      key.current.color.lerp(targetColor.current, 0.04);
      key.current.intensity += (targetIntensity.current - key.current.intensity) * 0.04;
    }
    if (ambient.current) {
      // High-key: keep the scene pale, like a light wash on paper.
      const ambIntensity = isPlaying ? 1.05 : 1.15;
      ambient.current.intensity += (ambIntensity - ambient.current.intensity) * 0.04;
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={1.35} color="#eddbb2" />
      <hemisphereLight args={["#f3ead2", "#b8a883", 0.8]} />
      <directionalLight
        ref={key}
        position={[3, 6, 4]}
        intensity={MOOD_LIGHT.idle.intensity}
        color={MOOD_LIGHT.idle.color}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* soft fill from front */}
      <pointLight position={[0, 3, 5]} intensity={0.25} color="#f0dcb0" distance={14} />
    </>
  );
}

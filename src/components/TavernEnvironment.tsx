import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace, CanvasTexture } from "three";
import type { Group, Mesh, MeshBasicMaterial, PointLight, Sprite, SpriteMaterial } from "three";
import { useGameStore } from "../lib/useGameStore";

// TAVERN ENVIRONMENT
// All static set dressing: floor, walls, table, barrels, fireplace, window,
// candles, rug, hanging banners, and framed old-master paintings (real
// artwork files from /public/artwork) hung like a gallery wall.

function WallPainting({
  url,
  position,
  rotation = [0, 0, 0],
  width = 1.35,
  height = 1.8,
  crop,
  framed = true,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  // UV crop: trim museum wall/label out of a photo. framed=false when the
  // photo already includes the painting's own frame.
  crop?: { repeat: [number, number]; offset: [number, number] };
  framed?: boolean;
}) {
  const tex = useLoader(TextureLoader, url);
  useEffect(() => {
    tex.colorSpace = SRGBColorSpace;
    if (crop) {
      tex.repeat.set(crop.repeat[0], crop.repeat[1]);
      tex.offset.set(crop.offset[0], crop.offset[1]);
    }
    tex.needsUpdate = true;
  }, [tex, crop]);

  return (
    <group position={position} rotation={rotation}>
      {framed && (
        <>
          {/* ebony frame */}
          <mesh castShadow>
            <boxGeometry args={[width + 0.24, height + 0.24, 0.08]} />
            <meshStandardMaterial color="#171009" roughness={0.55} />
          </mesh>
          {/* brass pinline lip */}
          <mesh>
            <boxGeometry args={[width + 0.1, height + 0.1, 0.09]} />
            <meshStandardMaterial color="#a8781f" metalness={0.55} roughness={0.35} />
          </mesh>
        </>
      )}
      {/* canvas */}
      <mesh position={[0, 0, 0.056]} castShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
    </group>
  );
}

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

// A properly burning hearth fire: crossed logs, layered flame tongues that
// flicker and sway independently, and glowing sparks rising up the flue.
const HEARTH_FLAMES = [
  { pos: [0, 0.12, 0.35], r: 0.3, h: 1.0, color: "#ff8a1c", speed: 10, phase: 0 },
  { pos: [-0.18, 0.12, 0.4], r: 0.16, h: 0.66, color: "#ffb347", speed: 13, phase: 2.1 },
  { pos: [0.2, 0.12, 0.42], r: 0.13, h: 0.56, color: "#ffce6b", speed: 15, phase: 4.2 },
  { pos: [-0.05, 0.12, 0.44], r: 0.09, h: 0.42, color: "#ffe49a", speed: 18, phase: 1.3 },
  { pos: [0.09, 0.12, 0.38], r: 0.1, h: 0.5, color: "#ff6a10", speed: 12, phase: 3.4 },
] as const;

const HEARTH_SPARKS = Array.from({ length: 7 }, (_, i) => ({
  x: -0.2 + (i % 4) * 0.13,
  z: 0.34 + (i % 3) * 0.04,
  speed: 0.5 + (i % 3) * 0.22,
  phase: i * 0.71,
}));

function HearthFire() {
  const flames = useRef<(Mesh | null)[]>([]);
  const sparks = useRef<(Mesh | null)[]>([]);
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    flames.current.forEach((m, i) => {
      if (!m) return;
      const f = HEARTH_FLAMES[i];
      // each tongue breathes at its own rate, base anchored to the logs
      const flicker =
        0.85 + Math.sin(t * f.speed + f.phase) * 0.18 + Math.sin(t * (f.speed * 0.37) + f.phase) * 0.1;
      m.scale.y = flicker;
      m.scale.x = m.scale.z = 0.9 + Math.sin(t * (f.speed * 0.7) + f.phase) * 0.12;
      m.position.y = f.pos[1] + (f.h / 2) * flicker;
      m.rotation.z = Math.sin(t * 2.2 + f.phase) * 0.1;
    });
    sparks.current.forEach((m, i) => {
      if (!m) return;
      const s = HEARTH_SPARKS[i];
      const cycle = (t * s.speed + s.phase) % 1;
      m.position.set(
        s.x + Math.sin((t + s.phase) * 3 + cycle * 6) * 0.06,
        0.25 + cycle * 1.1,
        s.z
      );
      m.scale.setScalar(1 - cycle * 0.7);
      (m.material as MeshBasicMaterial).opacity = 1 - cycle;
    });
  });

  return (
    <group>
      {/* crossed logs on a bed of embers */}
      <mesh position={[0, 0.14, 0.4]} rotation={[0, 0.5, 0.06]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.85, 8]} />
        <meshStandardMaterial color="#2e1a0c" roughness={1} />
      </mesh>
      <mesh position={[0, 0.16, 0.42]} rotation={[0, -0.6, -0.05]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.8, 8]} />
        <meshStandardMaterial color="#3a220e" roughness={1} />
      </mesh>
      {/* flame tongues */}
      {HEARTH_FLAMES.map((f, i) => (
        <mesh
          key={i}
          ref={(m) => (flames.current[i] = m)}
          position={[f.pos[0], f.pos[1] + f.h / 2, f.pos[2]]}
        >
          <coneGeometry args={[f.r, f.h, 8]} />
          <meshBasicMaterial color={f.color} />
        </mesh>
      ))}
      {/* rising sparks */}
      {HEARTH_SPARKS.map((s, i) => (
        <mesh key={i} ref={(m) => (sparks.current[i] = m)} position={[s.x, 0.25, s.z]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color="#ffb347" transparent />
        </mesh>
      ))}
    </group>
  );
}

// Drifting smoke haze — soft radial-gradient sprites floating in the rafters
function Smoke() {
  const groupRef = useRef<Group>(null);
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
    g.addColorStop(0, "rgba(222,206,178,0.5)");
    g.addColorStop(0.5, "rgba(200,184,158,0.2)");
    g.addColorStop(1, "rgba(200,184,158,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  }, []);

  const puffs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        base: [-5.5 + i * 1.6, 2.6 + (i % 3) * 0.8, -2.8 + (i % 2) * 2.6] as const,
        scale: 2.8 + (i % 3) * 1.3,
        speed: 0.06 + (i % 3) * 0.03,
        phase: i * 1.7,
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((s, i) => {
      const p = puffs[i];
      s.position.x = p.base[0] + Math.sin(t * p.speed * 2 + p.phase) * 0.9;
      s.position.y = p.base[1] + Math.sin(t * p.speed + p.phase) * 0.35;
      const m = (s as Sprite).material as SpriteMaterial;
      m.opacity = 0.13 + Math.sin(t * 0.25 + p.phase) * 0.05;
    });
  });

  if (!tex) return null;
  return (
    <group ref={groupRef}>
      {puffs.map((p, i) => (
        <sprite key={i} position={[p.base[0], p.base[1], p.base[2]]} scale={[p.scale, p.scale * 0.65, 1]}>
          <spriteMaterial map={tex} transparent opacity={0.14} depthWrite={false} />
        </sprite>
      ))}
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
      {/* FLOOR — warm wooden planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#54381e" roughness={0.85} />
      </mesh>
      {/* plank lines */}
      {Array.from({ length: 17 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-8 + i * 1, 0.01, 0]}
        >
          <planeGeometry args={[0.045, 18]} />
          <meshStandardMaterial color="#38240f" />
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

      {/* BACK WALL — warm timber planking */}
      <mesh position={[0, 3, -4]} receiveShadow>
        <boxGeometry args={[18, 6, 0.4]} />
        <meshStandardMaterial color="#63472a" roughness={0.95} />
      </mesh>
      {/* vertical plank seams */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} position={[-8 + i * 1.15, 3, -3.79]}>
          <boxGeometry args={[0.04, 6, 0.02]} />
          <meshStandardMaterial color="#412c15" roughness={1} />
        </mesh>
      ))}
      {/* LEFT WALL */}
      <mesh position={[-7, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 6, 0.4]} />
        <meshStandardMaterial color="#5c4227" roughness={0.95} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[-6.79, 3, -5.4 + i * 1.2]}>
          <boxGeometry args={[0.02, 6, 0.04]} />
          <meshStandardMaterial color="#3d2a14" roughness={1} />
        </mesh>
      ))}
      {/* RIGHT WALL */}
      <mesh position={[7, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 6, 0.4]} />
        <meshStandardMaterial color="#5c4227" roughness={0.95} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[6.79, 3, -5.4 + i * 1.2]}>
          <boxGeometry args={[0.02, 6, 0.04]} />
          <meshStandardMaterial color="#3d2a14" roughness={1} />
        </mesh>
      ))}

      {/* CEILING + exposed beams and rafters */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.15, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#3a2712" roughness={1} />
      </mesh>
      {/* big cross beams spanning the room */}
      {[-3.2, -1.4, 0.4, 2.2].map((z, i) => (
        <mesh key={i} position={[0, 4.7, z]} castShadow>
          <boxGeometry args={[14.2, 0.32, 0.36]} />
          <meshStandardMaterial color="#5a3b20" roughness={0.85} />
        </mesh>
      ))}
      {/* joist rafters running front-to-back on top of the beams */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-6 + i * 1.5, 4.98, -0.5]}>
          <boxGeometry args={[0.18, 0.2, 9]} />
          <meshStandardMaterial color="#6e4a26" roughness={0.85} />
        </mesh>
      ))}

      {/* FIREPLACE (right back corner) — big sandstone hearth with arched
          opening, mantel shelf, and a tapered chimney breast up to the
          rafters, after the watercolor in /public/bar/tavern-fire.jpg */}
      <group position={[4.5, 0, -3.35]}>
        {/* stone base */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[2.5, 2.0, 0.85]} />
          <meshStandardMaterial color="#8a7354" roughness={1} />
        </mesh>
        {/* mantel shelf, cluttered with bottles like the reference */}
        <mesh position={[0, 2.06, 0.1]} castShadow>
          <boxGeometry args={[2.7, 0.14, 0.95]} />
          <meshStandardMaterial color="#6e4a26" roughness={0.8} />
        </mesh>
        {[-1.0, -0.6, -0.15, 0.35, 0.8, 1.1].map((x, i) => (
          <group key={i} position={[x, 2.13, 0.25]}>
            <mesh position={[0, 0.11, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.055, 0.22, 8]} />
              <meshStandardMaterial
                color={["#7a4a1a", "#3f5a2e", "#8a6a2e", "#5a2e2e", "#7a4a1a", "#44507a"][i]}
                roughness={0.35}
              />
            </mesh>
            <mesh position={[0, 0.26, 0]}>
              <cylinderGeometry args={[0.016, 0.018, 0.09, 6]} />
              <meshStandardMaterial color="#2a1c10" roughness={0.5} />
            </mesh>
          </group>
        ))}
        {/* tapered chimney breast rising to the beams */}
        <mesh position={[0, 3.4, -0.1]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 0.55]} castShadow>
          <cylinderGeometry args={[0.75, 1.5, 2.6, 4]} />
          <meshStandardMaterial color="#846d4e" roughness={1} />
        </mesh>
        {/* arched opening: dark rectangle + semicircular arch top, flat
            against the stone face */}
        <mesh position={[0, 0.6, 0.43]}>
          <planeGeometry args={[1.3, 1.2]} />
          <meshStandardMaterial color="#0a0603" />
        </mesh>
        <mesh position={[0, 1.2, 0.43]}>
          <circleGeometry args={[0.65, 20, 0, Math.PI]} />
          <meshStandardMaterial color="#0a0603" />
        </mesh>
        {/* burning fire */}
        <HearthFire />
        {/* embers glow */}
        <mesh position={[0, 0.12, 0.45]}>
          <sphereGeometry args={[0.3, 10, 8]} />
          <meshBasicMaterial color="#c93d10" />
        </mesh>
        <pointLight
          ref={fireLight}
          position={[0, 0.8, 0.7]}
          color="#ff8a2c"
          intensity={2.0}
          distance={10}
          decay={2}
          castShadow
        />
      </group>

      {/* Smoke haze drifting through the rafters */}
      <Smoke />

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

      {/* GALLERY WALL — framed old masters from /public/artwork */}
      {/* ter Brugghen lute player, back wall left of the piper */}
      <WallPainting
        url="/artwork/lute-player.jpg"
        position={[-5.3, 2.7, -3.77]}
        width={1.15}
        height={1.5}
      />
      {/* van Dyck bagpiper, back wall — cropped to its own wooden frame */}
      <WallPainting
        url="/artwork/piper.jpg"
        position={[-3.0, 2.8, -3.77]}
        width={0.95}
        height={1.22}
        crop={{ repeat: [0.735, 0.71], offset: [0.04, 0.255] }}
        framed={false}
      />
      {/* Vermeer at the virginal, left wall */}
      <WallPainting
        url="/artwork/vermeer.jpg"
        position={[-6.77, 2.6, 0.9]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.5}
        height={1.95}
      />
      {/* Costa's concert, right wall */}
      <WallPainting
        url="/artwork/concert.jpg"
        position={[6.77, 3.1, 0.9]}
        rotation={[0, -Math.PI / 2, 0]}
        width={1.5}
        height={1.95}
      />

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

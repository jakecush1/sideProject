<<<<<<< HEAD
# The Gilded Minstrels

An interactive 3D medieval tavern band experience. Four primitive-built musicians sit around a candlelit table — click glowing objects to change songs, click the room to rain beer bottles.

Built with Vite + React + TypeScript + React Three Fiber + Zustand + Howler.js + Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173, click **Enter the Tavern**.

## Adding Real Audio

Drop MP3 files into `/public/audio/`. The names the app expects (see `src/data/songs.ts`):

| File | Song |
|---|---|
| `candlelit-jig.mp3` | The Candlelit Jig |
| `broken-goblet.mp3` | Ballad of the Broken Goblet |
| `tavern-moon.mp3` | Dance of the Tavern Moon |
| `drunken-minstrel.mp3` | The Drunken Minstrel's March |
| `tavern-ambience.mp3` | Ambient background loop (optional) |
| `clink.mp3` | Bottle spawn sound effect (optional) |

**Missing files do not crash the app** — it logs a console warning and keeps running.

## Replacing Placeholder Content

### Band members (`src/data/bandMembers.ts`)
Edit `name`, `bio`, `instrument`, `color`, `position`. Everything else rebuilds automatically.

### Songs (`src/data/songs.ts`)
Add a new entry, drop the matching MP3 in `/public/audio/`, and add a matching entry in `src/data/clickableObjects.ts` if you want an in-scene trigger for it.

### 3D Models
The characters are primitive shapes. To swap in a real GLB:
1. Load it with `useGLTF` inside `src/components/BandMember.tsx`
2. Replace the body/head/arm meshes with `<primitive object={gltf.scene} />`
3. Drive bone rotations using the existing `leftArm` / `rightArm` / `head` refs

### Beer Bottle Asset
The bottle is generic green geometry in `src/components/FallingBottle.tsx`. To apply a licensed texture, add a `map` prop to the label mesh's `meshStandardMaterial`.

### Contact / Band Info
Edit `src/components/ui/FooterOverlay.tsx` — search for `booking@example.com` and the shows placeholder text.

## Folder Structure

```
src/
  components/
    ui/             # HTML overlay panels
    BandMember.tsx  # Character + idle/playing animation
    BandCircle.tsx  # Places all four members
    ClickableObject.tsx  # Glowing song-trigger props
    Effects.tsx     # Floating music notes (primitive geometry)
    FallingBottle.tsx    # Kinematic bottle drop
    BottleSpawner.tsx    # Bottle pool + lifetime management
    TavernEnvironment.tsx # Floor, walls, table, fire, candles
    LightingRig.tsx # Mood-reactive scene lighting
    CameraRig.tsx   # Constrained OrbitControls + focus
    Scene.tsx       # Assembles everything
    Experience.tsx  # R3F Canvas wrapper
  data/
    bandMembers.ts  # All band member config
    songs.ts        # All song config
    clickableObjects.ts # In-scene trigger object config
  lib/
    useGameStore.ts # Zustand global state
    audioManager.ts # Howler.js wrapper (safe on missing files)
    constants.ts    # Tuning values (bottle count, spawn height, etc.)
public/
  audio/            # Drop real MP3 files here
```

## Future Upgrade Ideas

- Real GLB character models with skeletal animation
- Real instrument-specific animations synced to audio
- Mapbox/Google Maps for upcoming shows
- Timeline-synced band animations (beat detection)
- Music visualizer bars behind the band
- Merch table in the corner (links out)
- Email signup scroll on an in-scene notice board
- Hidden Easter eggs (click the fireplace 7 times...)
- Mobile-optimised lightweight scene variant
- Multiplayer tavern audience mode
=======
# sideProject
3js side project band page
>>>>>>> 190a52103400cca4402ad32ab3dbfcd376c0c7d5

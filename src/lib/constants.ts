// Global tuning constants for the experience.

export const MAX_BOTTLES = 40; // performance cap; oldest removed beyond this
export const BOTTLE_LIFETIME_MS = 9000; // despawn after this long
export const BOTTLE_SPAWN_HEIGHT = 7;
export const BOTTLE_SPAWN_SPREAD = 4; // random x/z range around center

export const DEFAULT_VOLUME = 0.7;
export const FADE_MS = 800; // song crossfade duration

// Mood → lighting tint (used by LightingRig)
export const MOOD_LIGHT: Record<
  string,
  { color: string; intensity: number; candle: number }
> = {
  warm: { color: "#ffb55c", intensity: 1.1, candle: 1.2 },
  rowdy: { color: "#ff8a3c", intensity: 1.3, candle: 1.5 },
  mysterious: { color: "#7c8cff", intensity: 0.8, candle: 0.8 },
  melancholy: { color: "#9fb6d6", intensity: 0.7, candle: 0.7 },
  idle: { color: "#ffa64d", intensity: 0.9, candle: 1.0 },
};

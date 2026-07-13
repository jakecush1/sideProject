// SONG DATA
// Drop real audio files into /public/audio/ and update the `file` paths.
// If a file is missing, the app logs a console warning and continues
// (UI + animations still run) — see src/lib/audioManager.ts.
//
// To add a song: add an entry here and (optionally) a matching clickable
// object in clickableObjects.ts with action "play-song" and this song's id.

export type SongMood = "warm" | "rowdy" | "mysterious" | "melancholy";

export type Song = {
  id: string;
  title: string;
  file: string;
  mood: SongMood;
  bpm: number;
  triggerObjectId: string;
  description: string;
};

export const songs: Song[] = [
  {
    id: "serfs-and-wenches",
    title: "Serfs and Wenches",
    file: "/audio/1-serfs.mp3",
    mood: "rowdy",
    bpm: 132,
    triggerObjectId: "song-scroll",
    description:
      "A bright, bouncing anthem for the working folk of the realm. Guaranteed to make at least one person attempt to dance on a table.",
  },
  {
    id: "feudal-taxation",
    title: "Feudal Taxation",
    file: "/audio/2-feudal.mp3",
    mood: "melancholy",
    bpm: 76,
    triggerObjectId: "goblet",
    description:
      "A mournful ballad for everyone who owes the lord a portion of the harvest. Slow, sweet, and slightly dramatic.",
  },
  {
    id: "angelic-frick",
    title: "Angelic Frick",
    file: "/audio/3-angelic.mp3",
    mood: "mysterious",
    bpm: 104,
    triggerObjectId: "tapestry",
    description:
      "A hypnotic, moonlit tune that makes the shadows lean in to listen. Best enjoyed while pretending you understand its deeper meaning.",
  },
  {
    id: "yennifer-holepez",
    title: "Yennifer Holepez",
    file: "/audio/4-yennifer.mp3",
    mood: "warm",
    bpm: 118,
    triggerObjectId: "barrel",
    description:
      "A rowdy, gloriously uneven march that speeds up and slows down depending on who's leading. Nobody is leading. That's the point.",
  },
];

export const getSong = (id: string | null) =>
  id ? songs.find((s) => s.id === id) ?? null : null;

export const getSongByTrigger = (triggerObjectId: string) =>
  songs.find((s) => s.triggerObjectId === triggerObjectId) ?? null;

// Ambient background loop (optional). Drop a file at this path to enable.
export const AMBIENT_TRACK = "/audio/tavern-ambience.mp3";

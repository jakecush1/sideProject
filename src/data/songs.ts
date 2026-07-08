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
    id: "candlelit-jig",
    title: "The Candlelit Jig",
    file: "/audio/candlelit-jig.mp3",
    mood: "warm",
    bpm: 132,
    triggerObjectId: "song-scroll",
    description:
      "A bright, bouncing jig for when the candles are low and the spirits are high. Guaranteed to make at least one person attempt to dance on a table.",
  },
  {
    id: "broken-goblet",
    title: "Ballad of the Broken Goblet",
    file: "/audio/broken-goblet.mp3",
    mood: "melancholy",
    bpm: 76,
    triggerObjectId: "goblet",
    description:
      "A mournful ballad mourning a goblet that gave its all. Slow, sweet, and slightly dramatic — much like the goblet's owner.",
  },
  {
    id: "tavern-moon",
    title: "Dance of the Tavern Moon",
    file: "/audio/tavern-moon.mp3",
    mood: "mysterious",
    bpm: 104,
    triggerObjectId: "tapestry",
    description:
      "A hypnotic, moonlit tune that makes the shadows lean in to listen. Best enjoyed while pretending you understand its deeper meaning.",
  },
  {
    id: "drunken-minstrel",
    title: "The Drunken Minstrel's March",
    file: "/audio/drunken-minstrel.mp3",
    mood: "rowdy",
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

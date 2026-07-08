// BAND MEMBER DATA
// Edit names, bios, instruments, colors, and seating positions here.
// To swap in real GLB character models later, keep the `id` and `position`
// fields and load the model inside <BandMember /> keyed by `id`.

export type Instrument = "lute" | "fiddle" | "drum" | "flute";

export type BandMember = {
  id: string;
  name: string;
  instrument: string;
  instrumentType: Instrument;
  bio: string;
  color: string; // clothing / tunic color
  hatColor: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

export const bandMembers: BandMember[] = [
  {
    id: "aldric",
    name: "Aldric of the Lute",
    instrument: "Lute",
    instrumentType: "lute",
    bio: "Aldric insists the lute sounds better after three goblets. No one has verified this scientifically, but no one has disproven it either.",
    color: "#6b1f2a", // deep red velvet
    hatColor: "#3d1118",
    position: [-2.2, 0, 0.6],
    rotation: [0, 0.6, 0],
  },
  {
    id: "mira",
    name: "Mira Fiddlethorn",
    instrument: "Fiddle",
    instrumentType: "fiddle",
    bio: "Mira can play any tune you hum, then a better version you didn't ask for. She has never once admitted to being wrong about tempo.",
    color: "#3d6b3c", // moss green
    hatColor: "#24401f",
    position: [-0.8, 0, -1.4],
    rotation: [0, 0.25, 0],
  },
  {
    id: "bram",
    name: "Brother Bram Barrelbeat",
    instrument: "Hand Drum",
    instrumentType: "drum",
    bio: "Bram left the monastery over a 'rhythmic disagreement.' He keeps time with his whole body and occasionally with nearby furniture.",
    color: "#7a5a2e", // monk brown
    hatColor: "#4a3417",
    position: [0.8, 0, -1.4],
    rotation: [0, -0.25, 0],
  },
  {
    id: "elowen",
    name: "Elowen Silverpipe",
    instrument: "Flute",
    instrumentType: "flute",
    bio: "Elowen claims her flute was carved from a tree that 'remembered every song it ever heard.' She is suspiciously good at proving it.",
    color: "#2f4a6b", // twilight blue
    hatColor: "#1c2f44",
    position: [2.2, 0, 0.6],
    rotation: [0, -0.6, 0],
  },
];

export const getBandMember = (id: string) =>
  bandMembers.find((m) => m.id === id);

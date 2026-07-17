// BAND MEMBER DATA
// Edit names, bios, instruments, colors, and seating positions here.
// To swap in real GLB character models later, keep the `id` and `position`
// fields and load the model inside <BandMember /> keyed by `id`.

export type Instrument = "lute" | "fiddle" | "drum" | "flute" | "organ" | "bass";

export type BandMember = {
  id: string;
  name: string;
  instrument: string;
  instrumentType: Instrument;
  bio: string;
  color: string; // clothing / tunic color
  hatColor: string;
  photo?: string; // portrait in /public/band — drop a jpg at this path
  face?: string; // transparent head cutout in /public/band/Heads (3D face decal)
  hairColor?: string; // when set, renders long hair hanging from under the hat
  build?: "lanky"; // body type; default is the standard stout minstrel
  position: [number, number, number];
  rotation: [number, number, number];
};

export const bandMembers: BandMember[] = [
  {
    id: "aldric",
    name: "J Hole",
    instrument: "Upright Bass & Vocals",
    instrumentType: "bass",
    bio: "J Hole slaps the upright bass and handles the singing, and insists both sound better after three goblets. No one has verified this scientifically, but no one has disproven it either.",
    color: "#26211d", // black turtleneck wool
    hatColor: "#17110b",
    photo: "/band/jHole.jpg",
    face: "/band/Heads/jhole-face.png",
    position: [-2.2, 0, 0.6],
    rotation: [0, 0.6, 0],
  },
  {
    id: "mira",
    name: "Babe Needleman",
    instrument: "Fiddle",
    instrumentType: "fiddle",
    bio: "Babe Needleman saws the fiddle and keeps a banjo and accordion within arm's reach, in case one tune needs all three. Can play any melody you hum, then a better version you didn't ask for.",
    color: "#2e5d54", // teal aztec fleece
    hatColor: "#b55a1f", // burnt-orange beanie
    photo: "/band/babeNeedleman2.jpg",
    face: "/band/Heads/babe-face.png",
    hairColor: "#c9a35c", // long blonde hair
    build: "lanky", // tall, skinny, long-limbed
    position: [-0.8, 0, -1.4],
    rotation: [0, 0.25, 0],
  },
  {
    id: "bram",
    name: "Admiral Joan",
    instrument: "Church Organ & Chain",
    instrumentType: "organ",
    bio: "Admiral Joan left the navy over a 'rhythmic disagreement.' He plays a cathedral organ with one hand, a length of anchor chain with the other, and keeps a flute on the console for emergencies.",
    color: "#22333d", // navy-black tee
    hatColor: "#12888a", // teal-brim cap
    photo: "/band/AdmiralJoan.jpg",
    face: "/band/Heads/admiral-face.png",
    position: [0.8, 0, -1.4],
    // Faces away from the circle, into the organ, like a proper organist
    rotation: [0, Math.PI - 0.25, 0],
  },
  {
    id: "elowen",
    name: "Freddie Munter",
    instrument: "Lute & Guitar",
    instrumentType: "lute",
    bio: "Freddie Munter picks the lute like a guitar. He claims it was carved from a tree that 'remembered every song it ever heard,' and is suspiciously good at proving it.",
    color: "#8f2b22", // oxblood hoodie
    hatColor: "#2e2018", // dark curls
    photo: "/band/freddieMunter.jpg",
    face: "/band/Heads/freddie-face.png",
    position: [2.2, 0, 0.6],
    rotation: [0, -0.6, 0],
  },
];

export const getBandMember = (id: string) =>
  bandMembers.find((m) => m.id === id);

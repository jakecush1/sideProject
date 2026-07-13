// CLICKABLE OBJECT DATA
// Each object lives somewhere in the scene and triggers an action when clicked.
// - "play-song": starts the song with the matching songId
// - "spawn-bottle": drops beer bottles
// - "show-info": reserved for future use
//
// Positions are [x, y, z] in scene units. Adjust to reposition props.

export type ClickableAction = "play-song" | "show-info" | "spawn-bottle";

export type ClickableObjectKind =
  | "scroll"
  | "goblet"
  | "tapestry"
  | "barrel"
  | "candle";

export type ClickableObject = {
  id: string;
  label: string;
  action: ClickableAction;
  songId?: string;
  kind: ClickableObjectKind;
  position: [number, number, number];
  scale?: number;
};

export const clickableObjects: ClickableObject[] = [
  {
    id: "song-scroll",
    label: "Play Serfs and Wenches",
    action: "play-song",
    songId: "serfs-and-wenches",
    kind: "scroll",
    position: [-1.6, 0.46, 1.7],
  },
  {
    id: "goblet",
    label: "Play Feudal Taxation",
    action: "play-song",
    songId: "feudal-taxation",
    kind: "goblet",
    position: [0.0, 0.5, 1.9],
  },
  {
    id: "tapestry",
    label: "Play Angelic Frick",
    action: "play-song",
    songId: "angelic-frick",
    kind: "tapestry",
    position: [0, 2.6, -3.4],
    scale: 1,
  },
  {
    id: "barrel",
    label: "Play Yennifer Holepez",
    action: "play-song",
    songId: "yennifer-holepez",
    kind: "barrel",
    position: [3.1, 0.0, -2.2],
  },
];

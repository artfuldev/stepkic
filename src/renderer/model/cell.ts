import { Side } from "./side";

type Unplayable = ["unplayable"];
const Unplayable: Cell = ["unplayable"];
type Playable = ["playable"];
const Playable: Cell = ["playable"];
type Played = ["played", Side];
const Played = (side: Side): Cell => ["played", side];

export type Cell = Unplayable | Playable | Played;

export const Cell = {
  unplayable: (): Cell => Unplayable,
  playable: (): Cell => Playable,
  played: (side: Side): Cell => Played(side),
  match:
    <T>(unplayable: () => T, playable: () => T, played: (side: Side) => T) =>
    (cell: Cell): T => {
      switch (cell[0]) {
        case "unplayable":
          return unplayable();
        case "playable":
          return playable();
        case "played":
          return played(cell[1]);
      }
    },
};

import { Constructor, Match, Tagged, Union } from "../../shared/tagged";
import { Side } from "./side";

type Unplayable = Tagged<"unplayable", []>;
const Unplayable: Constructor<Cell, Unplayable> = () => ({ tag: "unplayable", args: [] });

type Playable = Tagged<"playable", []>;
const Playable: Constructor<Cell, Playable> = () => ({ tag: "playable", args: [] });

type Played = Tagged<"played", [Side]>;
const Played: Constructor<Cell, Played> = (...args) => ({
  tag: "played",
  args,
});

type CellStates = [Unplayable, Playable, Played];

export type Cell = Union<CellStates>;

const match: Match<CellStates> = (matcher) => (cell) => {
  const { unplayable, playable, played } = matcher;
  switch (cell.tag) {
    case "unplayable":
      return unplayable();
    case "playable":
      return playable();
    case "played":
      return played(...cell.args);
  }
};

export const Cell = {
  Unplayable,
  Playable,
  Played,
  match,
};

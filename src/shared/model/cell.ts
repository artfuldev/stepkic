import { Constructor, Tagged, Union, match } from "../tagged";
import { Side } from "./side";

type Unplayable = Tagged<"unplayable", []>;
const Unplayable: Constructor<Cell, Unplayable> = () => ({
  tag: "unplayable",
  args: [],
});

type Playable = Tagged<"playable", []>;
const Playable: Constructor<Cell, Playable> = () => ({
  tag: "playable",
  args: [],
});

type Played = Tagged<"played", [Side]>;
const Played: Constructor<Cell, Played> = (...args) => ({
  tag: "played",
  args,
});

type CellStates = [Unplayable, Playable, Played];

export type Cell = Union<CellStates>;

export const Cell = {
  Unplayable,
  Playable,
  Played,
  match: match<CellStates>(),
};

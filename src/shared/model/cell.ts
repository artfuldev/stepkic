import { constructor, Tagged, Union, match } from "../tagged";
import { Side } from "./side";

type Unplayable = Tagged<"unplayable", []>;
type Playable = Tagged<"playable", []>;
type Played = Tagged<"played", [Side]>;
type CellStates = [Unplayable, Playable, Played];
export type Cell = Union<CellStates>;

export const Cell = {
  Unplayable: constructor<CellStates, Unplayable>("unplayable"),
  Playable: constructor<CellStates, Playable>("playable"),
  Played: constructor<CellStates, Played>("played"),
  match: match<CellStates>(),
};

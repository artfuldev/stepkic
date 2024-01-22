import { Cell, Position, Side } from "../../../shared/model";
import { constructor, Tagged, Union, match } from "../../../shared/tagged";
import "./board-view.css";

const disabled = Cell.match({
  unplayable: () => true,
  playable: () => false,
  played: () => true,
});

const color = Cell.match({
  unplayable: () => "black",
  playable: () => "light-gray",
  played: (side) => (side === Side.X ? "red" : "blue"),
});

type Index = Tagged<"index", [string]>;
type Square = Tagged<"square", [Cell, Position]>;
type Highlighted = Tagged<"highlighted", [Cell, Position]>;
type BoardCells = [Index, Square, Highlighted];
export type BoardCell = Union<BoardCells>;

export const BoardCell = {
  Index: constructor<BoardCells, Index>("index"),
  Square: constructor<BoardCells, Square>("square"),
  Highlighted: constructor<BoardCells, Highlighted>("highlighted"),
  match: match<BoardCells>(),
  color,
  disabled,
};

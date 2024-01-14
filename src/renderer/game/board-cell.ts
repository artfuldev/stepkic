import { Cell, Position, Side } from "../../shared/model";
import { Constructor, Tagged, Union, match } from "../../shared/tagged";
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
const Index: Constructor<BoardCell, Index> = (index: string) => ({
  tag: "index",
  args: [index],
});
type Square = Tagged<"square", [Cell, Position]>;
const Square: Constructor<BoardCell, Square> = (...args) => ({
  tag: "square",
  args,
});
type Highlighted = Tagged<"highlighted", [Cell, Position]>;
const Highlighted: Constructor<BoardCell, Highlighted> = (...args) => ({
  tag: "highlighted",
  args,
});
type BoardCells = [Index, Square, Highlighted];
export type BoardCell = Union<BoardCells>;

export const BoardCell = {
  Index,
  Square,
  Highlighted,
  match: match<BoardCells>(),
  color,
  disabled,
};

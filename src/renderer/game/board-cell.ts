import { Cell, Position, Side } from "../../shared/model";
import "./board-view.css";
import { Constructor, Match, Tagged, Union } from "../../shared/tagged";

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

const value = Cell.match({
  unplayable: () => "",
  playable: () => "",
  played: (side) => `${side}`,
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

const match: Match<BoardCells> = (matcher) => (cell) => {
  switch (cell.tag) {
    case "index":
      return matcher.index(...cell.args);
    case "square":
      return matcher.square(...cell.args);
    case "highlighted":
      return matcher.highlighted(...cell.args);
  }
};

export const BoardCell = {
  Index,
  Square,
  Highlighted,
  match,
  color,
  disabled,
  value,
};

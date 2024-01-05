import { List } from "immutable";
import { Cell } from "./cell";

export type Board = List<List<Cell>>;

export const Board = {
  create: (size: number): Board => {
    return List(
      Array.from({ length: size }, () =>
        List(Array.from({ length: size }, () => Cell.playable()))
      )
    );
  },
  full: (board: Board): boolean => {
    return board.every((row) => row.every((cell) => cell[0] !== "playable"));
  },
};

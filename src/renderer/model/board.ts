import { List } from "immutable";
import { Cell } from "./cell";

export type Board = List<List<Cell>>;

const unplayable = Cell.match({
  unplayable: () => true,
  playable: () => false,
  played: () => true,
});

export const Board = {
  create: (size: number): Board => {
    return List(
      Array.from({ length: size }, () =>
        List(Array.from({ length: size }, () => Cell.Playable()))
      )
    );
  },
  full: (board: Board): boolean => board.every((row) => row.every(unplayable)),
};

import { Cell } from "./cell";

export type Board = Cell[][];

const unplayable = Cell.match({
  unplayable: () => true,
  playable: () => false,
  played: () => true,
});

export const Board = {
  create: (size: number): Board =>
    Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Cell.Playable())
    ),
  full: (board: Board): boolean => board.every((row) => row.every(unplayable)),
};

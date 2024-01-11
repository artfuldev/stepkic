import { Board, Cell } from "../../shared/model";

const compress = (str: string): string => {
  let result = "";
  let count = 0;
  let prev = "";
  for (const char of str) {
    if (char === prev) {
      count += 1;
    } else {
      if (count > 1) result += count;
      result += prev;
      count = 1;
      prev = char;
    }
  }
  if (count > 1) result += count;
  result += prev;
  return result;
};

const cell = Cell.match({
  unplayable: () => ".",
  playable: () => "_",
  played: (side) => side,
});

export const str = (board: Board): string =>
  board.map((row) => compress(row.map(cell).join(""))).join("/");

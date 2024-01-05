import { Board } from "./board";
import { Position } from "./position";

type Index = [number, number];

export const winning_positions = (board: Board): Position[][] => {
  const positions: Index[][] = [];
  const size = board.size;
  const diagonal: Index[] = [];
  const anti_diagonal: Index[] = [];
  for (let i = 0; i < size; i++) {
    const row: Index[] = [];
    const column: Index[] = [];
    for (let j = 0; j < size; j++) {
      row.push([i, j]);
      column.push([j, i]);
    }
    positions.push(row);
    positions.push(column);
    diagonal.push([i, i]);
    anti_diagonal.push([i, size - i - 1]);
  }
  positions.push(diagonal);
  positions.push(anti_diagonal);
  return positions.map((indices) =>
    indices.map(([x, y]) => Position.create(x, y))
  );
};

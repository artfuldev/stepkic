import { Board, Cell, Game, Position, Side } from "../model";
import { Rule } from "./rule";

type Index = [number, number];

const winning_positions = (board: Board): Position[][] => {
  const positions: Index[][] = [];
  const size = board.length;
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

const win = (positions: Position[], board: Board): Side | undefined => {
  let side: Side | undefined = undefined;
  for (const position of positions) {
    const [row, column] = Position.indices(position);
    const cell = board[row]?.[column] ?? Cell.Playable();
    if (cell.tag === "playable") return undefined;
    if (cell.tag === "played") {
      if (side == null) {
        side = cell.args[0];
        continue;
      } else if (side !== cell.args[0]) return undefined;
    }
  }
  return side;
};

export const wins = (_board: Board): Rule => {
  const winners = winning_positions(_board);
  return (game) =>
    Game.match({
      started: (board) => {
        for (const winner of winners) {
          const side = win(winner, board);
          if (side != null) return Game.Won(board, side, winner);
        }
        return game;
      },
      won: () => game,
      drawn: () => game,
    })(game);
};

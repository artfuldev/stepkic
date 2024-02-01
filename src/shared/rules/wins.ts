import { Board, Cell, Game, Position, Side, other } from "../model";
import { Result } from "../model/result";
import { Timestamp } from "../model/timestamp";
import { Rule } from "./rule";

type Index = [number, number];

const winning_positions = (board: Board, length?: number): Position[][] => {
  if (length == null || length > board.length) length = board.length;
  const positions: Index[][] = [];
  const diagonal: Index[] = [];
  const anti_diagonal: Index[] = [];
  const size = board.length;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - length; j++) {
      const row: Index[] = [];
      const column: Index[] = [];
      for (let k = 0; k < length; k++) {
        row.push([i, j + k]);
        column.push([j + k, i]);
      }
      positions.push(row);
      positions.push(column);
    }
    diagonal.push([i, i]);
    anti_diagonal.push([i, size - i - 1]);
  }

  for (let i = 0; i <= size - length; i++) {
    positions.push(diagonal.slice(i, i + length));
    positions.push(anti_diagonal.slice(i, i + length));
  }

  return positions.map((indices) =>
    indices.map(([x, y]) => Position.create(x, y))
  );
};

const win = (positions: Position[], board: Board): Side | undefined => {
  let side: Side | undefined = undefined;
  for (const position of positions) {
    const [row, column] = Position.indices(position);
    const cell = board[row]?.[column] ?? Cell.Playable();
    if (cell.tag === "playable" || cell.tag === "unplayable") return undefined;
    if (side == null) {
      side = cell.args[0];
      continue;
    } else if (side !== cell.args[0]) return undefined;
  }
  return side;
};

export const wins = (_board: Board, length?: number): Rule => {
  const winners = winning_positions(_board, length);
  return (game) =>
    Game.transform({
      move_made: () => {
        const board = Game.board(game);
        for (const winner of winners) {
          const side = win(winner, board);
          if (side != null)
            return Game.Ended(
              Timestamp.now(),
              game,
              Result.Win(other(side), winner)
            );
        }
        return game;
      },
    })(game);
};

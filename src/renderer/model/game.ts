import { Board } from "./board";
import { Side, other } from "./side";
import { Position } from "./position";
import { Cell } from "./cell";

type Unplayed = ["unplayed", Board, Side];
type Played = ["played", Position, Game];

export type Game = Unplayed | Played;

const snapshot = (game: Game): [Board, Side] => {
  switch (game[0]) {
    case "played": {
      const [row, column] = Position.indices(game[1]);
      const [board, side] = snapshot(game[2]);
      const col = board.get(row);
      const next_board =
      col == null
      ? board
      : board.set(row, col.set(column, Cell.played(side)));
      return [next_board, other(side)];
    }
    case "unplayed":
      return [game[1], game[2]];
  }
};

export const Game = {
  create: (board: Board): Game => ["unplayed", board, Side.X],
  side: (game: Game): Side => {
    switch (game[0]) {
      case "played":
        return other(Game.side(game[2]));
      case "unplayed":
        return game[2];
    }
  },
  board: (game: Game): Board => {
    return snapshot(game)[0];
  },
  play: (position: Position, game: Game): Game => {
    const board = Game.board(game);
    const [row, column] = Position.indices(position);
    return board.get(row)?.get(column)?.[0] !== "playable"
      ? game
      : ["played", position, game];
  },
};

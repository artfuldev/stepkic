import { Board } from "./board";
import { Side, other } from "./side";
import { Position } from "./position";
import { Cell } from "./cell";
import { Constructor, Tagged, Union } from "../../shared/tagged";

type Unplayed = Tagged<"unplayed", [Board, Side]>;
const Unplayed: Constructor<Game, Unplayed> = (...args) => ({
  tag: "unplayed",
  args,
});
type Played = Tagged<"played", [Position, Game]>;
const Played: Constructor<Game, Played> = (...args) => ({
  tag: "played",
  args,
});
type GameVariants = [Unplayed, Played];
export type Game = Union<GameVariants>;

const snapshot = (g: Game): [Board, Side] => {
  switch (g.tag) {
    case "played": {
      const [position, game] = g.args;
      const [row, column] = Position.indices(position);
      const [board, side] = snapshot(game);
      const col = board.get(row);
      const next_board =
        col == null
          ? board
          : board.set(row, col.set(column, Cell.Played(side)));
      return [next_board, other(side)];
    }
    case "unplayed":
      return g.args;
  }
};

export const Game = {
  create: (board: Board): Game => Unplayed(board, Side.X),
  side: (game: Game): Side => {
    switch (game.tag) {
      case "played":
        return other(Game.side(game.args[1]));
      case "unplayed":
        return game.args[1];
    }
  },
  board: (game: Game): Board => {
    return snapshot(game)[0];
  },
  play: (position: Position, game: Game): Game => {
    const board = Game.board(game);
    const [row, column] = Position.indices(position);
    return board.get(row)?.get(column)?.tag !== "playable"
      ? game
      : Played(position, game);
  },
};

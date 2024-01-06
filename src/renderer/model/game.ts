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
      const index = Position.indices(position);
      const [board, side] = snapshot(game);
      const next_board = board.setIn(index, Cell.Played(side));
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
    return Cell.match({
      playable: () => Played(position, game),
      unplayable: () => game,
      played: () => game,
    })(
      Game.board(game).getIn(
        Position.indices(position),
        Cell.Unplayable()
      ) as Cell
    );
  },
};

import { Cell, Game, Position } from "../model";
import { Result } from "../model/result";
import { Timestamp } from "../model/timestamp";
import { Rule } from "./rule";

export const play: Rule = (game) =>
  Game.transform({
    move_attempted: (_, position, previous) => {
      const [board, side] = Game.state(previous);
      const [row, column] = Position.indices(position);
      const cell = board[row]?.[column];
      if (cell == null)
        return Game.Ended(
          Timestamp.now(),
          game,
          Result.InvalidMove(side, position)
        );
      return Cell.match({
        unplayable: () =>
          Game.Ended(Timestamp.now(), game, Result.IllegalMove(side, position)),
        played: () =>
          Game.Ended(Timestamp.now(), game, Result.IllegalMove(side, position)),
        playable: () => Game.MoveMade(Timestamp.now(), position, game),
      })(cell);
    },
  })(game);

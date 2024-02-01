import { Board, Game } from "../model";
import { Result } from "../model/result";
import { Timestamp } from "../model/timestamp";
import { Rule } from "./rule";

export const draw: Rule = (game) =>
  Game.transform({
    move_made: () =>
      Board.full(Game.board(game))
        ? Game.Ended(Timestamp.now(), game, Result.Draw())
        : game,
  })(game);

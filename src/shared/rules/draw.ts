import { Board, Game } from "../model";
import { Rule } from "./rule";

export const draw: Rule = (game) =>
  Game.match({
    started: (board) => (Board.full(board) ? Game.Drawn(board) : game),
    drawn: () => game,
    won: () => game,
  })(game);

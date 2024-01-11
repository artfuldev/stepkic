import { Board } from "./board";
import { Side, other } from "./side";
import { Position } from "./position";
import { Cell } from "./cell";
import { Constructor, Match, Tagged, Union } from "../tagged";

type Started = Tagged<"started", [Board, Side]>;
const Started: Constructor<Game, Started> = (...args) => ({
  tag: "started",
  args,
});
type Won = Tagged<"won", [Board, Side, Position[]]>;
const Won: Constructor<Game, Won> = (...args) => ({
  tag: "won",
  args,
});
type Drawn = Tagged<"drawn", [Board]>;
const Drawn: Constructor<Game, Drawn> = (...args) => ({
  tag: "drawn",
  args,
});
type GameVariants = [Started, Won, Drawn];
export type Game = Union<GameVariants>;

const match: Match<GameVariants> = (matcher) => (game) => {
  const { started, won, drawn } = matcher;
  switch (game.tag) {
    case "started":
      return started(...game.args);
    case "won":
      return won(...game.args);
    case "drawn":
      return drawn(...game.args);
  }
};

export const Game = {
  Started,
  Won,
  Drawn,
  create: (board: Board): Game => Game.Started(board, Side.X),
  match,
  board: match({
    started: (board) => board,
    won: (board) => board,
    drawn: (board) => board,
  }),
  play:
    (position: Position) =>
    (game: Game): Game =>
      match({
        won: () => game,
        drawn: () => game,
        started: (board, side) => {
          const [x, y] = Position.indices(position);
          const cell = board[x]?.[y] ?? Cell.Unplayable();
          return Cell.match({
            playable: () =>
              Started(
                board.map((row, i) =>
                  i === x
                    ? row.map((cell, j) => (j === y ? Cell.Played(side) : cell))
                    : row
                ),
                other(side)
              ),
            unplayable: () => game,
            played: () => game,
          })(cell);
        },
      })(game),
};

import { Board } from "./board";
import { Side, other } from "./side";
import { Position } from "./position";
import { Cell } from "./cell";
import { constructor, Tagged, Union, match } from "../tagged";

type Started = Tagged<"started", [Board, Side]>;
type Won = Tagged<"won", [Board, Side, Position[]]>;
type Drawn = Tagged<"drawn", [Board]>;
type GameVariants = [Started, Won, Drawn];
export type Game = Union<GameVariants>;

const _match = match<GameVariants>();

export const Game = {
  Started: constructor<GameVariants, Started>("started"),
  Won: constructor<GameVariants, Won>("won"),
  Drawn: constructor<GameVariants, Drawn>("drawn"),
  create: (board: Board): Game => Game.Started(board, Side.X),
  match: _match,
  board: _match({
    started: (board) => board,
    won: (board) => board,
    drawn: (board) => board,
  }),
  play:
    (position: Position) =>
    (game: Game): Game =>
      _match({
        won: () => game,
        drawn: () => game,
        started: (board, side) => {
          const [x, y] = Position.indices(position);
          const cell = board[x]?.[y] ?? Cell.Unplayable();
          return Cell.match({
            playable: () =>
              Game.Started(
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

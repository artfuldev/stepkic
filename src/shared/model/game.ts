import { Board } from "./board";
import { Side, other } from "./side";
import { Position } from "./position";
import { Cell } from "./cell";
import {
  constructor,
  Tagged,
  Union,
  match,
  transform,
  FoldBack,
} from "../tagged";
import { Players } from "./players";
import { Timestamp } from "./timestamp";
import { Result } from "./result";

type Created = Tagged<"created", [Timestamp, Board, Players]>;
type Started = Tagged<"started", [Timestamp, Game]>;
type MoveRequested = Tagged<"move_requested", [Timestamp, Game]>;
type MoveAttempted = Tagged<"move_attempted", [Timestamp, Position, Game]>;
type MoveMade = Tagged<"move_made", [Timestamp, Position, Game]>;
type Ended = Tagged<"ended", [Timestamp, Game, Result]>;
type GameVariants = [
  Created,
  Started,
  MoveRequested,
  MoveAttempted,
  MoveMade,
  Ended
];
export type Game = Union<GameVariants>;

const _match = match<GameVariants>();
const _transform = transform<GameVariants>();

const flow =
  <A extends ReadonlyArray<unknown>, B, C>(
    ab: (...a: A) => B,
    bc: (b: B) => C
  ) =>
  (...a: A): C =>
    bc(ab(...a));

const fold_back: FoldBack<GameVariants> =
  (matcher) =>
  ({ tag, args }) =>
  (f) => {
    const recurse = fold_back(matcher);
    const {
      created,
      started,
      move_requested,
      move_attempted,
      move_made,
      ended,
    } = matcher;
    switch (tag) {
      case "created":
        return f(created(...args));
      case "started": {
        const [t, inner] = args;
        return recurse(inner)(flow((a) => started(t, a), f));
      }
      case "move_requested": {
        const [t, inner] = args;
        return recurse(inner)(flow((a) => move_requested(t, a), f));
      }
      case "move_attempted": {
        const [t, pos, inner] = args;
        return recurse(inner)(flow((a) => move_attempted(t, pos, a), f));
      }
      case "move_made": {
        const [t, pos, inner] = args;
        return recurse(inner)(flow((a) => move_made(t, pos, a), f));
      }
      case "ended": {
        const [t, inner, result] = args;
        return recurse(inner)(flow((a) => ended(t, a, result), f));
      }
    }
  };

const _state = fold_back<[Board, Side]>({
  created: (_, board) => [board, Side.X],
  started: (_, state) => state,
  move_requested: (_, state) => state,
  move_attempted: (_, __, state) => state,
  move_made: (_, position, [board, side]) => {
    const [x, y] = Position.indices(position);
    const cell = board[x]?.[y] ?? Cell.Unplayable();
    return Cell.match<[Board, Side]>({
      playable: () => [
        board.map((row, i) =>
          i === x
            ? row.map((cell, j) => (j === y ? Cell.Played(side) : cell))
            : row
        ),
        other(side),
      ],
      unplayable: () => [board, side],
      played: () => [board, side],
    })(cell);
  },
  ended: (_, state) => state,
});

const players = (game: Game): Players =>
  _match<Players>({
    created: (_, __, _players) => _players,
    started: (_, game) => players(game),
    move_requested: (_, game) => players(game),
    move_attempted: (_, __, game) => players(game),
    move_made: (_, __, game) => players(game),
    ended: (_, game) => players(game),
  })(game);

export const Game = {
  Created: constructor<GameVariants, Created>("created"),
  Started: constructor<GameVariants, Started>("started"),
  MoveRequested: constructor<GameVariants, MoveRequested>("move_requested"),
  MoveAttempted: constructor<GameVariants, MoveAttempted>("move_attempted"),
  MoveMade: constructor<GameVariants, MoveMade>("move_made"),
  Ended: constructor<GameVariants, Ended>("ended"),
  match: _match,
  transform: _transform,
  state: (game: Game) => _state(game)((x) => x),
  board: (game: Game): Board => _state(game)(([board]) => board),
  side: (game: Game): Side => _state(game)(([_, side]) => side),
  players,
  attempt: (position: Position) =>
    _transform({
      move_requested: (...args) =>
        Game.MoveAttempted(
          Timestamp.now(),
          position,
          Game.MoveRequested(...args)
        ),
    }),
};

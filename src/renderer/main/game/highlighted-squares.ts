import { Game, Position, Result } from "../../../shared/model";

export const highlightedSquares = Game.match<Position[]>({
  created: () => [],
  started: () => [],
  move_requested: () => [],
  move_attempted: () => [],
  move_made: (_, position) => [position],
  ended: (_, __, result) =>
    Result.match({
      draw: () => [],
      win: (_, positions) => positions,
      adjudicated_draw: () => [],
      adjudicated_win: () => [],
      illegal_move: (_, position) => [position],
      invalid_move: (_, position) => [position],
      unknown_move: () => [],
      timeout: () => [],
      failure: () => [],
    })(result),
});

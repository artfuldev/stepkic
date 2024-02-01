import { Game, Position, Result, Side } from "../../../shared/model";

export const statusText = Game.match({
  created: () => `Game starting...`,
  started: () => `${Side.X} to play :o`,
  move_requested: (_, game) => `Waiting for ${Game.side(game)} to move...`,
  move_attempted: (_, position, game) =>
    `${Game.side(game)} attempted playing ${Position.string(position)}`,
  move_made: (_, position, game) =>
    `${Game.side(game)} made move ${Position.string(position)}`,
  ended: (_, __, result) =>
    Result.match({
      draw: () => `Game drawn`,
      win: (side, positions) =>
        `${side} won by squares ${positions.map(Position.string).join("-")}`,
      adjudicated_draw: (adjudicator) =>
        `Game ended in a draw by ${adjudicator}`,
      adjudicated_win: (adjudicator, side) =>
        `Game decided as a win for ${side} by ${adjudicator}`,
      illegal_move: (side, position) =>
        `${side} lost by playing an illegal move ${Position.string(position)}`,
      invalid_move: (side, position) =>
        `${side} lost by playing an invalid move ${Position.string(position)}`,
      unknown_move: (side, move) =>
        `${side} lost by playing an unknown move ${move}`,
      timeout: (side) => `${side} lost by timing out`,
      failure: (side, reason) => `${side} lost: ${reason}`,
    })(result),
});

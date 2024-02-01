import { Game, Position } from "../../../shared/model";

export const movesMade = (game: Game): Position[] =>
  Game.match<Position[]>({
    created: () => [],
    started: () => [],
    move_requested: (_, game) => movesMade(game),
    move_attempted: (_, __, game) => movesMade(game),
    move_made: (_, position, previous) => [...movesMade(previous), position],
    ended: (_, game) => movesMade(game),
  })(game);

import { Game } from "../../../shared/model";

export const playable = Game.match({
  created: () => false,
  started: () => false,
  move_requested: () => true,
  move_attempted: () => false,
  move_made: () => false,
  ended: () => false,
});

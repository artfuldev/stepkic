import { Game } from "../model";
import { Constructor, Tagged } from "../tagged";

export type GameUpdated = Tagged<"game-updated", [Game]>;

export const GameUpdated: Constructor<
  GameUpdated,
  GameUpdated
> = (...args): GameUpdated => ({
  tag: "game-updated",
  args,
});

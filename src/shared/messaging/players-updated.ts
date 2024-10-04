import { Players } from "../model";
import { Constructor, Tagged } from "../tagged";

export type PlayersUpdated = Tagged<"players-updated", [Players]>;

export const PlayersUpdated: Constructor<
  PlayersUpdated,
  PlayersUpdated
> = (...args): PlayersUpdated => ({
  tag: "players-updated",
  args,
});

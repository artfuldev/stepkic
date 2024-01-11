import { Player, Side } from "../model";
import { Constructor, Tagged } from "../tagged";

export type PlayerUpdated = Tagged<"player-updated", [Side, Player]>;

export const PlayerUpdated: Constructor<
  PlayerUpdated,
  PlayerUpdated
> = (...args): PlayerUpdated => ({
  tag: "player-updated",
  args,
});

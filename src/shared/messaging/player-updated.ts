import { Side } from "../model";
import { Constructor, Tagged } from "../tagged";

type Player = {
  name: string;
  type: "user";
}

export type PlayerUpdated = Tagged<"player-updated", [Side, Player]>;

export const PlayerUpdated: Constructor<
  PlayerUpdated,
  PlayerUpdated
> = (...args): PlayerUpdated => ({
  tag: "player-updated",
  args,
});

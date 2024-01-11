import { Side } from "../model";
import { Constructor, Tagged } from "../tagged";

type Milliseconds = number;

export type PlayerTimeUpdated = Tagged<
  "player-time-updated",
  [Side, Milliseconds]
>;

export const PlayerTimeUpdated: Constructor<
  PlayerTimeUpdated,
  PlayerTimeUpdated
> = (...args): PlayerTimeUpdated => ({
  tag: "player-time-updated",
  args,
});

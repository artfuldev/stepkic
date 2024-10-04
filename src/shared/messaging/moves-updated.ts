import { Position } from "../model";
import { Constructor, Tagged } from "../tagged";

export type MovesUpdated = Tagged<"moves-updated", Position[]>;

export const MovesUpdated: Constructor<MovesUpdated, MovesUpdated> = (
  ...args
): MovesUpdated => ({
  tag: "moves-updated",
  args,
});

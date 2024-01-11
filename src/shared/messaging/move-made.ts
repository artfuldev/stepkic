import { Position } from "../model";
import { Constructor, Tagged } from "../tagged";

export type MoveMade = Tagged<"move-made", [Position]>;

export const MoveMade: Constructor<MoveMade, MoveMade> = (
  ...args
): MoveMade => ({
  tag: "move-made",
  args,
});

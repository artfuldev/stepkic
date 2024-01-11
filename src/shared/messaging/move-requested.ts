import { Side } from "../model";
import { Constructor, Tagged } from "../tagged";

export type MoveRequested = Tagged<"move-requested", [Side]>;

export const MoveRequested: Constructor<MoveRequested, MoveRequested> = (
  ...args
): MoveRequested => ({
  tag: "move-requested",
  args,
});

import { Position } from "../model";
import { Constructor, Tagged } from "../tagged";

export type MoveAttempted = Tagged<"move-attempted", [Position]>;

export const MoveAttempted: Constructor<MoveAttempted, MoveAttempted> = (
  ...args
): MoveAttempted => ({
  tag: "move-attempted",
  args,
});

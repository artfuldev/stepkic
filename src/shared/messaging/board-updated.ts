import { Board } from "../model";
import { Constructor, Tagged } from "../tagged";

export type BoardUpdated = Tagged<"board-updated", [Board]>;

export const BoardUpdated: Constructor<BoardUpdated, BoardUpdated> = (
  ...args
): BoardUpdated => ({
  tag: "board-updated",
  args,
});

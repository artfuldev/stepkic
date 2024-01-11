import { Constructor, Tagged } from "../tagged";

export type MovesCleared = Tagged<"moves-cleared", []>;

export const MovesCleared: Constructor<MovesCleared, MovesCleared> = (
  ...args
): MovesCleared => ({
  tag: "moves-cleared",
  args,
});

import { Players } from "../model";
import { Constructor, Tagged } from "../tagged";

type Size = number;
type WinLength = number;
export type NewGameRequested = Tagged<"new-game-requested", [Size, Players, WinLength]>;

export const NewGameRequested: Constructor<
  NewGameRequested,
  NewGameRequested
> = (...args): NewGameRequested => ({
  tag: "new-game-requested",
  args,
});

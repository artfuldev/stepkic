import { Side } from "../model";
import { Constructor, Tagged } from "../tagged";

type Size = number;

type Player = {
  name: string;
  type: "user";
};

type Players = {
  [Side.X]: Player;
  [Side.O]: Player;
};

export type NewGameRequested = Tagged<"new-game-requested", [Size, Players]>;

export const NewGameRequested: Constructor<
  NewGameRequested,
  NewGameRequested
> = (...args): NewGameRequested => ({
  tag: "new-game-requested",
  args,
});

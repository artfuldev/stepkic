import { Tagged, Union, match } from "../tagged";
import { Engine } from "./engine";

type Name = string;
type User = Tagged<"user", [Name]>;
type PlayerVariants = [User, Engine];
export type Player = Union<PlayerVariants>;

export const Player = {
  match: match<PlayerVariants>(),
};

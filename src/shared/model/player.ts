import { Union, match } from "../tagged";
import { Engine } from "./engine";
import { User } from "./user";

type PlayerVariants = [User, Engine];
export type Player = Union<PlayerVariants>;

export const Player = {
  match: match<PlayerVariants>(),
};

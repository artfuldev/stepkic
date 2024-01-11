import { Match, Tagged, Union } from "../tagged";
import { Engine } from "./engine";

type Name = string;
type User = Tagged<"user", [Name]>;
type PlayerVariants = [User, Engine];
export type Player = Union<PlayerVariants>;

const match: Match<PlayerVariants> = (matcher) => (player) => {
  switch (player.tag) {
    case "user":
      return matcher.user(...player.args);
    case "engine":
      return matcher.engine(...player.args);
  }
};

export const Player = {
  match,
};

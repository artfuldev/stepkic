import { Constructor, Match, Tagged, Union } from "../../shared/tagged";
import { Game } from "../model";
import { Result } from "./result";
import { Rule } from "./rule";

type Started = Tagged<"started", [Game]>;
const Started: Constructor<State, Started> = (...args) => ({
  tag: "started",
  args,
});
type Ended = Tagged<"ended", [Game, Result]>;
const Ended: Constructor<State, Ended> = (...args) => ({ tag: "ended", args });

type States = [Started, Ended];

export type State = Union<States>;

const match: Match<States> = (matcher) => (union) => {
  const { started, ended } = matcher;
  switch (union.tag) {
    case "started":
      return started(...union.args);
    case "ended":
      return ended(...union.args);
  }
};

export const State = {
  create:
    (rule: Rule) =>
    (game: Game): State => {
      const board = Game.board(game);
      const result = rule(board);
      return result == null ? Started(game) : Ended(game, result);
    },
  match,
};

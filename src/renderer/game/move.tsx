import { Position } from "../../shared/model";
import { Constructor, Match, Tagged, Union } from "../../shared/tagged";

type Pending = Tagged<"pending", [number, Position]>;
const Pending: Constructor<Move, Pending> = (...args) => ({
  tag: "pending",
  args,
});
type Played = Tagged<"played", [number, Position, Position]>;
const Played: Constructor<Move, Played> = (...args) => ({
  tag: "played",
  args,
});
type MoveTypes = [Pending, Played];
export type Move = Union<MoveTypes>;
const match: Match<MoveTypes> = (matcher) => (move) => {
  switch (move.tag) {
    case "pending":
      return matcher.pending(...move.args);
    case "played":
      return matcher.played(...move.args);
  }
};

export const Move = {
  Pending,
  Played,
  match,
};

import { Position } from "../../../shared/model";
import { constructor, match, Tagged, Union } from "../../../shared/tagged";

type Pending = Tagged<"pending", [number, Position]>;
type Played = Tagged<"played", [number, Position, Position]>;
type MoveTypes = [Pending, Played];
export type Move = Union<MoveTypes>;

export const Move = {
  Pending: constructor<MoveTypes, Pending>("pending"),
  Played: constructor<MoveTypes, Played>("played"),
  match: match<MoveTypes>(),
};

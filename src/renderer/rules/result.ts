import { Constructor, Match, Tagged, Union } from "../../shared/tagged";
import { Position } from "../model/position";
import { Side } from "../model/side";

type Drawn = Tagged<"drawn", []>;
const Drawn: Constructor<Result, Drawn> = () => ({ tag: "drawn", args: [] });
type Won = Tagged<"won", [Side, Position[]]>;
const Won: Constructor<Result, Won> = (...args) => ({ tag: "won", args });
type Results = [Drawn, Won];

export type Result = Union<Results>;

const match: Match<Results> = (matcher) => (union) => {
  const { drawn, won } = matcher;
  switch (union.tag) {
    case "drawn":
      return drawn();
    case "won":
      return won(...union.args);
  }
};

export const Result = {
  Drawn,
  Won,
  match,
};

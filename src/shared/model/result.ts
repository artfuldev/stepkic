import { Tagged, Union, constructor, match } from "../tagged";
import { Side } from "./side";
import { Position } from "./position";

type Draw = Tagged<"draw", []>;
type Win = Tagged<"win", [Side, Position[]]>;
type Adjudicator = string;
type AdjudicatedDraw = Tagged<"adjudicated_draw", [Adjudicator]>;
type AdjudicatedWin = Tagged<"adjudicated_win", [Adjudicator, Side]>;
type IllegalMove = Tagged<"illegal_move", [Side, Position]>;
type InvalidMove = Tagged<"invalid_move", [Side, Position]>;
type UnknownMove = Tagged<"unknown_move", [Side, string]>;
type Timeout = Tagged<"timeout", [Side]>;
type Reason = string;
type Failure = Tagged<"failure", [Side, Reason]>;
type Variants = [
  Draw,
  Win,
  AdjudicatedDraw,
  AdjudicatedWin,
  IllegalMove,
  InvalidMove,
  UnknownMove,
  Timeout,
  Failure
];
export type Result = Union<Variants>;

export const Result = {
  Draw: constructor<Variants, Draw>("draw"),
  Win: constructor<Variants, Win>("win"),
  AdjudicatedDraw: constructor<Variants, AdjudicatedDraw>("adjudicated_draw"),
  AdjudicatedWin: constructor<Variants, AdjudicatedWin>("adjudicated_win"),
  IllegalMove: constructor<Variants, IllegalMove>("illegal_move"),
  InvalidMove: constructor<Variants, InvalidMove>("invalid_move"),
  UnknownMove: constructor<Variants, UnknownMove>("unknown_move"),
  Timeout: constructor<Variants, Timeout>("timeout"),
  Failure: constructor<Variants, Failure>("failure"),
  match: match<Variants>(),
};

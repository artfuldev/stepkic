import { Side } from "./side";

export enum Cell {
  Unplayable = ".",
  Playable = "_",
  PlayedX = Side.X,
  PlayedO = Side.O
}

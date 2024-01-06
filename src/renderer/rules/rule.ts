import { Board } from "../model";
import { Result } from "./result";

export type Rule = (board: Board) => Result | undefined;

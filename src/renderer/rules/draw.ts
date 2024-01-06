import { Board } from "../model";
import { Result } from "./result";
import { Rule } from "./rule";

export const draw: Rule = (board) => {
  if (Board.full(board)) return Result.Drawn();
}

import { Rule } from "./rule";

export const and =
  (...rules: Rule[]): Rule =>
  (board) => {
    for (const rule of rules) {
      const result = rule(board);
      if (result != null) {
        return result;
      }
    }
  };

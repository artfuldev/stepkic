import { Rule } from "./rule";

export const and =
  (...rules: Rule[]): Rule =>
  (game) =>
    rules.reduce((ruled, rule) => rule(ruled), game);

import { Constructor, Tagged } from "../../shared/tagged";

export type Column = Tagged<"column", [string]>;

const _Column: Constructor<Column, Column> = (...args) => ({
  tag: "column",
  args,
});

export const Column = {
  create: (index: number): Column => {
    let result = "";
    do {
      const remainder = index % 26;
      result = String.fromCharCode(97 + remainder) + result;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);

    return _Column(result);
  },

  index: ({ args: [column] }: Column): number => {
    let result = 0;

    for (let i = 0; i < column.length; i++) {
      result *= 26;
      result += column.charCodeAt(i) - "a".charCodeAt(0) + 1;
    }

    return result - 1;
  },
  string: ({ args: [column] }: Column): string => column,
};

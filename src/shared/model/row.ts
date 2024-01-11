import { Constructor, Tagged } from "../tagged";

export type Row = Tagged<"row", [number]>;

const _Row: Constructor<Row, Row> = (...args) => ({ tag: "row", args });

export const Row = {
  from: (row: number): Row => _Row(row),
  create: (index: number): Row => _Row(index + 1),
  index: ({ args: [row] }: Row) => row - 1,
  string: ({ args: [row] }: Row): string => row.toString(),
};

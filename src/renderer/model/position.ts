import { Column } from "./column";
import { Row } from "./row";

export type Position = ["position", Row, Column];

export const Position = {
  create: (row: number, column: number): Position => [
    "position",
    Row.create(row),
    Column.create(column),
  ],
  indices: ([, row, column]: Position): [number, number] => [
    Row.index(row),
    Column.index(column),
  ],
};

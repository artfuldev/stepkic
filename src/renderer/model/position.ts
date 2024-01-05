import { Constructor, Tagged } from "../../shared/tagged";
import { Column } from "./column";
import { Row } from "./row";

export type Position = Tagged<"position", [Row, Column]>;
const _Position: Constructor<Position, Position> = (...args) => ({
  tag: "position",
  args,
});

export const Position = {
  create: (row: number, column: number): Position =>
    _Position(Row.create(row), Column.create(column)),
  indices: ({ args: [row, column] }: Position): [number, number] => [
    Row.index(row),
    Column.index(column),
  ],
  string: ({ args: [row, column] }: Position): string =>
    `${Column.string(column)}${Row.string(row)}`,
};

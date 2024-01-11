import { Constructor, Tagged } from "../tagged";
import { Column } from "./column";
import { Row } from "./row";

export type Position = Tagged<"position", [Row, Column]>;
const _Position: Constructor<Position, Position> = (...args) => ({
  tag: "position",
  args,
});

export const Position = {
  parse: (s: string): Position | null => {
    const { column, row } =
      RegExp(/(?<column>[a-z]+)(?<row>[0-9]+)/, "i").exec(s)?.groups ?? {};
    if (row == null || column == null) return null;
    const parsed = parseInt(row);
    if (!Number.isSafeInteger(parsed)) return null;
    return _Position(Row.from(parsed), Column.from(column));
  },
  create: (row: number, column: number): Position =>
    _Position(Row.create(row), Column.create(column)),
  indices: ({ args: [row, column] }: Position): [number, number] => [
    Row.index(row),
    Column.index(column),
  ],
  string: ({ args: [row, column] }: Position): string =>
    `${Column.string(column)}${Row.string(row)}`,
};

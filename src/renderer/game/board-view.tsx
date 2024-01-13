import React, { FC } from "react";
import { SquareView } from "./square-view";
import { Position, Cell, Column } from "../../shared/model";
import { BoardCell } from "./board-cell";
import "./board-view.css";

type Props = {
  size: number;
  board: Cell[][];
  highlights: Position[];
  interactive: boolean;
  onPlay: (position: Position) => void;
};

export const BoardView: FC<Props> = ({
  size,
  highlights,
  board,
  interactive,
  onPlay,
}) => {
  const indices = new Set(
    highlights.map(Position.indices).map(([x, y]) => `${x},${y}`)
  );

  const cells: BoardCell[][] = [
    Array.from({ length: size + 1 }).map((_, i) =>
      BoardCell.Index(i === 0 ? "" : Column.string(Column.create(i - 1)))
    ),
  ].concat(
    board.map((row, x) =>
      [BoardCell.Index(`${x + 1}`)].concat(
        row.map((cell, y) =>
          indices.has(`${x},${y}`)
            ? BoardCell.Highlighted(cell, Position.create(x, y))
            : BoardCell.Square(cell, Position.create(x, y))
        )
      )
    )
  );

  return (
    <div
      style={{
        display: "grid",
        alignSelf: "stretch",
        gridTemplateColumns: `repeat(${size + 1}, 1fr)`,
        gridTemplateRows: `repeat(${size + 1}, 1fr)`,
        aspectRatio: "1/1",
      }}
    >
      {cells.map((row, x) =>
        row.map((board_cell, y) =>
          BoardCell.match({
            index: (label) => (
              <div key={x * (size + 1) + y} className="square index">
                {label}
              </div>
            ),
            square: (cell, position) => (
              <SquareView
                key={x * (size + 1) + y}
                color={BoardCell.color(cell)}
                disabled={!interactive || BoardCell.disabled(cell)}
                highlight={false}
                onClick={() => onPlay(position)}
              />
            ),
            highlighted: (cell, position) => (
              <SquareView
                key={x * (size + 1) + y}
                color={BoardCell.color(cell)}
                disabled={!interactive || BoardCell.disabled(cell)}
                highlight={true}
                onClick={() => onPlay(position)}
              />
            ),
          })(board_cell)
        )
      )}
    </div>
  );
};

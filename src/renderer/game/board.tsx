import React, { FC } from "react";
import { Cell } from "../model/cell";
import { Square } from "./square";
import { Side } from "../model/side";
import { Board, Position } from "../model";

type Props = {
  board: Board;
  highlights: Position[];
  onPlay: (position: Position) => void;
};

const disabled = Cell.match(
  () => true,
  () => false,
  () => true
);

const color = Cell.match(
  () => "black",
  () => "gray",
  (side) => (side === Side.X ? "red" : "blue")
);

const value = Cell.match(
  () => "",
  () => "",
  (side) => `${side}`
);

const _Board: FC<Props> = ({ highlights, board, onPlay }) => {
  function handleClick(x: number, y: number) {
    onPlay(Position.create(x, y));
  }
  const indices = new Set(
    highlights.map(Position.indices).map(([x, y]) => `${x},${y}`)
  );

  return board.map((row, x) => {
    return row.map((cell, y) => {
      return (
        <Square
          key={x * 3 + y}
          value={value(cell)}
          color={color(cell)}
          disabled={highlights.length !== 0 || disabled(cell)}
          highlight={indices.has(`${x},${y}`)}
          onSquareClick={() => handleClick(x, y)}
        />
      );
    });
  });
};

export { _Board as Board };

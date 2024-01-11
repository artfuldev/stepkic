import React, { FC } from "react";
import { Square } from "./square";
import { Position, Cell, Side } from "../../shared/model";

type Props = {
  board: Cell[][];
  highlights: Position[];
  onPlay: (position: Position) => void;
};

const disabled = Cell.match({
  unplayable: () => true,
  playable: () => false,
  played: () => true
});

const color = Cell.match({
  unplayable: () => "black",
  playable: () => "gray",
  played: (side) => (side === Side.X ? "red" : "blue")
});

const value = Cell.match({
  unplayable: () => "",
  playable: () => "",
  played: (side) => `${side}`
});

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
          onClick={() => handleClick(x, y)}
        />
      );
    });
  });
};

export { _Board as Board };

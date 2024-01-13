import React, { FC } from "react";
import { Square } from "./square";
import { Position, Cell, Side, Column } from "../../shared/model";

type Props = {
  size: number;
  board: Cell[][];
  highlights: Position[];
  interactive: boolean;
  onPlay: (position: Position) => void;
};

const disabled = Cell.match({
  unplayable: () => true,
  playable: () => false,
  played: () => true,
});

const color = Cell.match({
  unplayable: () => "black",
  playable: () => "light-gray",
  played: (side) => (side === Side.X ? "red" : "blue"),
});

const value = Cell.match({
  unplayable: () => "",
  playable: () => "",
  played: (side) => `${side}`,
});

const _Board: FC<Props> = ({
  size,
  highlights,
  board,
  interactive,
  onPlay,
}) => {
  function handleClick(x: number, y: number) {
    onPlay(Position.create(x, y));
  }
  const indices = new Set(
    highlights.map(Position.indices).map(([x, y]) => `${x},${y}`)
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
      {Array.from({ length: size + 1 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          {i === 0 ? "" : Column.string(Column.create(i - 1))}
        </div>
      ))}
      {board.map((row, x) => {
        return (
          <>
            <div
              key={(x + 1) * 3}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              {x + 1}
            </div>
            {row.map((cell, y) => {
              return (
                <Square
                  key={(x + 1) * 3 + (y + 1)}
                  value={value(cell)}
                  color={color(cell)}
                  disabled={!interactive || disabled(cell)}
                  highlight={indices.has(`${x},${y}`)}
                  onClick={() => handleClick(x, y)}
                />
              );
            })}
          </>
        );
      })}
    </div>
  );
};

export { _Board as Board };

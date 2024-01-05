import React, { FC } from "react";
import { Cell } from "./cell";

type Props = {
  value: Cell;
  onSquareClick: () => void;
};

export const Square: FC<Props> = ({ value, onSquareClick }) => {
  return (
    <button type="button" className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

import React, { FC } from "react";

type Props = {
  value: string;
  highlight: boolean;
  color: string;
  disabled: boolean;
  onSquareClick: () => void;
};

export const Square: FC<Props> = ({
  value,
  color,
  highlight,
  disabled,
  onSquareClick,
}) => {
  return (
    <button
      type="button"
      style={{
        fontSize: ".5rem",
        background: color,
        borderColor: color,
        borderWidth: "1px",
        color: highlight ? "white" : color,
      }}
      disabled={disabled}
      className="square"
      onClick={onSquareClick}
    >
      {highlight ? value: ""}
    </button>
  );
};

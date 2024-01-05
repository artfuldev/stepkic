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
        fontSize: "2rem",
        background: highlight ? color: "transparent",
        borderColor: color,
        borderWidth: "20px",
        color: highlight ? "white" : color,
      }}
      disabled={disabled}
      className="square"
      onClick={onSquareClick}
    >
      {highlight ? <strong>{value}</strong> : value}
    </button>
  );
};

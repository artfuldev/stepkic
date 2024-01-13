import React, { FC } from "react";

type Props = {
  value: string;
  highlight: boolean;
  color: string;
  disabled: boolean;
  onClick: () => void;
};

export const SquareView: FC<Props> = ({
  value,
  color,
  highlight,
  disabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      style={{
        fontSize: "2rem",
        fontWeight: "bold",
        borderStyle: "solid",
        background: color,
        borderColor: "lightgray",
        borderWidth: "1px",
        color: highlight ? "white" : color,
      }}
      disabled={disabled}
      className="square"
      onClick={onClick}
    >
      {highlight ? "•" : ""}
    </button>
  );
};

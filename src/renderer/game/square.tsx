import React, { FC } from "react";

type Props = {
  value: string;
  highlight: boolean;
  color: string;
  disabled: boolean;
  onClick: () => void;
};

export const Square: FC<Props> = ({
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
        fontSize: ".5rem",
        background: color,
        borderColor: color,
        borderWidth: "1px",
        color: highlight ? "white" : color,
      }}
      disabled={disabled}
      className="square"
      onClick={onClick}
    >
      {highlight ? value : ""}
    </button>
  );
};

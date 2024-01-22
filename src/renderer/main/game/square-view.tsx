import React, { FC } from "react";
import "./square-view.css";

type Props = {
  highlight: boolean;
  color: string;
  disabled: boolean;
  onClick: () => void;
};

export const SquareView: FC<Props> = ({
  color,
  highlight,
  disabled,
  onClick,
}) => {
  return (
    <button
      title={""}
      type="button"
      style={{
        "--color": color,
      }}
      disabled={disabled}
      className={`square ${highlight ? "highlighted" : ""}`}
      onClick={onClick}
    />
  );
};

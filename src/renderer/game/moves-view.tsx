import React, { FC } from "react";
import { Position } from "../../shared/model";
import "./moves-view.css";

type Props = {
  moves: Position[];
};

export const MovesView: FC<Props> = ({ moves }) => (
  <aside className="moves">
    <div className="message">
      {moves.length === 0 ? `No moves played yet.` : `Moves:`}
    </div>
    <div className="list">
      {moves.map((move, index) => (
        <span
          key={index}
          className={`move ${index % 2 === 0 ? "move-start" : "move-end"}`}
        >
          <em>{Math.floor(index / 2) + 1}. </em>{Position.string(move)}
        </span>
      ))}
    </div>
  </aside>
);

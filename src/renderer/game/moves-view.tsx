import React, { FC } from "react";
import { Position } from "../../shared/model";
import { Move } from "./move";
import "./moves-view.css";

type Props = {
  moves: Position[];
};

export const MovesView: FC<Props> = ({ moves }) => (
  <aside className="moves">
    <h4>{moves.length === 0 ? `No moves played yet.` : `Moves`}</h4>
    <div className="list">
      {moves
        .reduce((moves, position, index) => {
          const last = moves[moves.length - 1];
          return last == null
            ? moves.concat(Move.Pending(Math.floor(index / 2) + 1, position))
            : Move.match({
                pending: (number, played) =>
                  moves
                    .filter((m) => m !== last)
                    .concat(Move.Played(number, played, position)),
                played: (number) =>
                  moves.concat(Move.Pending(number + 1, position)),
              })(last);
        }, [] as Move[])
        .map(
          Move.match({
            pending: (number, x) => (
              <div key={number} className="move pending">
                <div className="number">{number}.</div>
                <div className="x">{Position.string(x)}</div>
              </div>
            ),
            played: (number, x, o) => (
              <div key={number} className="move played">
                <div className="number">{number}.</div>
                <div className="x">{Position.string(x)}</div>
                <div className="o">{Position.string(o)}</div>
              </div>
            ),
          })
        )}
    </div>
  </aside>
);

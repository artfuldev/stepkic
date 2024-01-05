import React, { FC, useState } from "react";
import { Board as BoardView } from "./board";
import { Board, Game, Position, State, other, winning_positions } from "../model";

type Props = {
  size: number;
};

const _Game: FC<Props> = ({ size }) => {
  const _board = Board.create(size);
  const winners = winning_positions(_board);
  const [state, setState] = useState<State>(
    State.create(winners, Game.create(_board))
  );
  const [, game] = state;
  const side = Game.side(game);
  function handlePlay(position: Position) {
    setState((state) => {
      switch (state[0]) {
        case "drawn":
        case "won":
          return state;
        case "started":
          return State.create(winners, Game.play(position, state[1]));
      }
    });
  }

  return (
    <div className="game">
      <div className="game-info"> {
        (() => {
          switch (state[0]) {
            case "drawn":
              return <>Drawn</>;
            case "won":
              return <>Winner: <strong>{other(side)}</strong></>;
            case "started":
              return <>Side: <strong>{side}</strong></>;
          }
        })()
      }
      </div>
      <div style={{ margin: "10px"}} />
      <div
        className="game-board"
        style={{
          display: "grid",
          gap: "5px",
          maxWidth: "80vw",
          maxHeight: "80vh",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          aspectRatio: "1/1"
        }}
      >
        <BoardView
          board={Game.board(game)}
          highlights={state[0] === "won" ? state[2] : []}
          onPlay={handlePlay}
        />
      </div>
    </div>
  );
};
export { _Game as Game };

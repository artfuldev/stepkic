import React, { FC, useState } from "react";
import { Board as BoardView } from "./board";
import { Board, Game, Position } from "../model";
import { and, wins, draw, State, Result } from "../rules";

type Props = {
  size: number;
};

const _Game: FC<Props> = ({ size }) => {
  const _board = Board.create(size);
  const _state = State.create(and(wins(_board), draw));
  const [state, setState] = useState<State>(_state(Game.create(_board)));
  const [game] = state.args;
  const side = Game.side(game);
  function handlePlay(position: Position) {
    setState((state) =>
      State.match({
        ended: () => state,
        started: (game) => _state(Game.play(position, game)),
      })(state)
    );
  }

  return (
    <div className="game">
      <div className="game-info">
        {" "}
        {State.match({
          ended: (_, result) =>
            Result.match({
              drawn: () => <>Drawn</>,
              won: (side) => <>Winner: {side}</>,
            })(result),
          started: () => (
            <>
              Side: <strong>{side}</strong>
            </>
          ),
        })(state)}
      </div>
      <div style={{ margin: "10px" }} />
      <div
        className="game-board"
        style={{
          display: "grid",
          gap: "5px",
          maxWidth: "80vw",
          maxHeight: "80vh",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          aspectRatio: "1/1",
        }}
      >
        <BoardView
          board={Game.board(game)}
          highlights={State.match({
            ended: (_, result) =>
              Result.match({
                drawn: () => [],
                won: (_, positions) => positions,
              })(result),
            started: () => [],
          })(state)}
          onPlay={handlePlay}
        />
      </div>
    </div>
  );
};
export { _Game as Game };

import React, { FC, useCallback, useEffect, useState } from "react";
import { Board as BoardView } from "./board";
import { Board, Game, Players, Position, Side } from "../../shared/model";
import {
  MoveAttempted,
  NewGameRequested,
  Receivable,
} from "../../shared/messaging";

type Props = {
  size: number;
};

const statusText = Game.match({
  started: (_, side) => `${side} to play`,
  won: (_, side) => `${side} won`,
  drawn: () => `drawn`,
});

const winners = Game.match({
  started: () => [],
  drawn: () => [],
  won: (_, __, positions) => positions,
});

const _Game: FC<Props> = ({ size }) => {
  const [board, setBoard] = useState(Board.create(size));
  const [highlights, setHighlights] = useState<Position[]>([]);
  const [status, setStatus] = useState(`Not initialized`);
  const [players, setPlayers] = useState<Players>({
    [Side.X]: { args: ["X"], tag: "user" },
    [Side.O]: { args: ["O"], tag: "user" },
  });
  const [moves, setMoves] = useState<Position[]>([]);
  const [playable, setPlayable] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.send(
      "main",
      NewGameRequested(size, {
        [Side.X]: { args: ["X"], tag: "user" },
        [Side.O]: { args: ["O"], tag: "user" },
      })
    );

    return window.electron.ipcRenderer.on("main", (_, message: Receivable) => {
      switch (message.tag) {
        case "game-updated": {
          const game = message.args[0];
          setBoard(Game.board(game));
          setStatus(statusText(game));
          setHighlights(winners(game));
          setPlayable(false);
          break;
        }
        case "player-updated": {
          setPlayers((players) => ({
            ...players,
            [message.args[0]]: message.args[1],
          }));
          break;
        }
        case "move-requested": {
          setPlayable(true);
          break;
        }
        case "move-made": {
          setMoves((moves) => moves.concat(message.args[0]));
          break;
        }
        case "moves-cleared": {
          setMoves([]);
          break;
        }
      }
    });
  }, [size]);
  const play = useCallback(
    (position: Position) => {
      if (!playable) return;
      window.electron.ipcRenderer.send("main", MoveAttempted(position));
    },
    [playable]
  );

  return (
    <div className="game">
      <div className="game-info">{JSON.stringify(players)}</div>
      <div style={{ margin: "10px" }} />
      <div className="game-info">{status}</div>
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
          board={board}
          highlights={highlights}
          interactive={playable}
          onPlay={play}
        />
      </div>
      <div className="game-info">
        {moves.length === 0
          ? `No moves played yet.`
          : `Moves: ${moves.map(Position.string)}`}
      </div>
      <div style={{ margin: "10px" }} />
    </div>
  );
};
export { _Game as Game };

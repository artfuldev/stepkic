import React, { FC, useCallback, useEffect, useState } from "react";
import { Board, Players, Position, Side, User } from "../../../shared/model";
import {
  MoveAttempted,
  NewGameRequested,
  Receivable,
} from "../../../shared/messaging";
import { GameView } from "./game-view";

const _players: Players = {
  [Side.X]: User.create("Player X"),
  [Side.O]: User.create("Player O"),
};

const _Game: FC = () => {
  const [size, setSize] = useState(3);
  const [board, setBoard] = useState(Board.create(size));
  const [highlights, setHighlights] = useState<Position[]>([]);
  const [status, setStatus] = useState(`Not initialized`);
  const [players, setPlayers] = useState<Players>(_players);
  const [moves, setMoves] = useState<Position[]>([]);
  const [playable, setPlayable] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.send(
      "main",
      NewGameRequested(size, players, size)
    );

    return window.electron.ipcRenderer.on("main", (_, message: Receivable) => {
      switch (message.tag) {
        case "board-updated": {
          const board = message.args[0];
          setBoard(board);
          setSize(Board.size(board));
          setPlayable(false);
          break;
        }
        case "status-updated": {
          setStatus(message.args[0]);
          break;
        }
        case "highlights-updated": {
          setHighlights(message.args);
          break;
        }
        case "players-updated": {
          setPlayers(message.args[0]);
          break;
        }
        case "moves-updated": {
          setMoves(message.args);
          setPlayable(false);
          break;
        }
        case "move-requested": {
          setPlayable(true);
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
    <GameView
      size={size}
      play={play}
      playable={playable}
      players={players}
      moves={moves}
      status={status}
      board={board}
      highlights={highlights}
    />
  );
};
export { _Game as Game };

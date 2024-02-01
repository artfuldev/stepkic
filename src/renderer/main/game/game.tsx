import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Board,
  Engine,
  Game,
  Players,
  Position,
  Side,
  User,
} from "../../../shared/model";
import {
  MoveAttempted,
  NewGameRequested,
  Receivable,
} from "../../../shared/messaging";
import { GameView } from "./game-view";
import { statusText } from "./status-text";
import { highlightedSquares } from "./highlighted-squares";
import { movesMade } from "./moves-made";

type Props = {
  size: number;
};

const engine: Engine = Engine.create("9c65f05b355019720239061fc76b89bb", {
  name: "random-step",
  author: "artfuldev<hello@artful.dev>",
  version: "2.3.2",
  url: "https://github.com/artfuldev/random-step",
});

const _players: Players = {
  [Side.X]: User.create("Player X"),
  [Side.O]: User.create("Player O"),
};

const _Game: FC<Props> = ({ size }) => {
  const [board, setBoard] = useState(Board.create(size));
  const [highlights, setHighlights] = useState<Position[]>([]);
  const [status, setStatus] = useState(`Not initialized`);
  const [players, setPlayers] = useState<Players>(_players);
  const [moves, setMoves] = useState<Position[]>([]);
  const [playable, setPlayable] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.send(
      "main",
      NewGameRequested(size, {
        ..._players,
        [Side.X]: engine,
        [Side.O]: engine,
      })
    );

    return window.electron.ipcRenderer.on("main", (_, message: Receivable) => {
      switch (message.tag) {
        case "game-updated": {
          const game = message.args[0];
          setBoard(Game.board(game));
          setStatus(statusText(game));
          setHighlights(highlightedSquares(game));
          setPlayable(false);
          setPlayers(Game.players(game));
          setMoves(movesMade(game));
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

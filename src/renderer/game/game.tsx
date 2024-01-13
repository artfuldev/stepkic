import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Board,
  Engine,
  Game,
  Players,
  Position,
  Side,
} from "../../shared/model";
import {
  MoveAttempted,
  NewGameRequested,
  Receivable,
} from "../../shared/messaging";
import { GameView } from "./game-view";

type Props = {
  size: number;
};

const statusText = Game.match({
  started: (_, side) => `${side} to play :o`,
  won: (_, side) => `${side} won! :)`,
  drawn: () => `drawn :|`,
});

const winners = Game.match({
  started: () => [],
  drawn: () => [],
  won: (_, __, positions) => positions,
});

const engine: Engine = {
  tag: "engine",
  args: [
    {
      command: "docker",
      args: `run -i --memory=512m --cpus=1.0 random-step`.split(" "),
    },
    { name: "random-step", author: "artfuldev", version: "2.1.0", url: "" },
  ],
};

const _players: Players = {
  [Side.X]: { args: ["Player X"], tag: "user" },
  [Side.O]: { args: ["Player O"], tag: "user" },
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
        // [Side.X]: engine,
        [Side.O]: engine,
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

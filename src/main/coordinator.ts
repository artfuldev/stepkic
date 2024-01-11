import { and, draw, wins } from "../shared/rules";
import { Board, Game, Players, Position, Side } from "../shared/model";
import {
  GameUpdated,
  MoveAttempted,
  MoveMade,
  MoveRequested,
  MovesCleared,
  PlayerUpdated,
  Receivable,
  Sendable,
} from "../shared/messaging";
import { spawn } from "child_process";
import { createInterface } from "readline";
import { str } from "./t3en/board";

export const coordinator = ({ send }: { send: (r: Receivable) => void }) => {
  let board = Board.create(3);
  let rules = and(wins(board), draw);
  let game = Game.create(board);
  let players: Players = {
    [Side.X]: { args: ["X"], tag: "user" },
    [Side.O]: { args: ["O"], tag: "user" },
  };
  const engines: Record<Side, Required<ReturnType<typeof spawn> | null>> = {
    [Side.X]: null,
    [Side.O]: null,
  };
  const processNewGame = (size: number, ps: Players) => {
    board = Board.create(size);
    rules = and(wins(board), draw);
    game = rules(Game.create(board));
    players = ps;
  };
  const processMoveAttempted = (position: Position) => {
    const next = Game.play(position)(game);
    if (next === game) return false;
    game = rules(next);
    return true;
  };
  const sendGameUpdates = () => {
    send(GameUpdated(game));
    Game.match({
      started: (board, side) => {
        const player = players[side];
        if (player.tag === "user") send(MoveRequested(side));
        if (player.tag === "engine") {
          const engine = engines[side];
          const strb = str(board);
          console.log("played", strb, side);
          engine?.stdin?.write(`move ${strb} ${side}\n`);
        }
      },
      drawn: (board) => {
        console.log("drawn", str(board));
      },
      won: (board, side, winners) => {
        console.log(
          "won",
          side,
          str(board),
          winners.map(Position.string).join("-")
        );
      },
    })(game);
  };
  const handle = (arg: Sendable) => {
    switch (arg.tag) {
      case "new-game-requested": {
        processNewGame(...arg.args);
        send(MovesCleared());
        Object.values(engines).forEach((engine) => {
          engine?.stdin?.write("quit\n");
        });
        [Side.X, Side.O].forEach((side) => {
          const player = players[side];
          if (player.tag === "engine") {
            const { cwd, process, args } = player.args[0];
            const { stdout, stdin } = spawn(process, args, {
              cwd,
              stdio: ["pipe", "pipe", "inherit"],
            });
            const rl = createInterface({ input: stdout });
            engines[side] = { stdin, stdout } as any;
            rl.on("line", (line) => {
              if (line.startsWith("best ")) {
                const position = Position.parse(line.slice(5));
                if (position != null) {
                  handle(MoveAttempted(position));
                }
              }
            });
            stdin.write("st3p version 1\n");
            stdin.write("identify\n");
          }
          send(PlayerUpdated(side, players[side]));
        });
        sendGameUpdates();
        break;
      }
      case "move-attempted": {
        const position = arg.args[0];
        const made = processMoveAttempted(position);
        if (!made) break;
        send(MoveMade(position));
        sendGameUpdates();
        break;
      }
    }
  };

  return handle;
};

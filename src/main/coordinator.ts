/* eslint-disable @typescript-eslint/no-empty-function */
import { and, draw, play, wins } from "../shared/rules";
import {
  Board,
  Game,
  Player,
  Players,
  Position,
  Result,
  Side,
  Timestamp,
  User,
} from "../shared/model";
import { GameUpdated, Receivable, Sendable } from "../shared/messaging";
import { spawn } from "child_process";
import { ReadLine, createInterface } from "readline";
import { str } from "./t3en/board";
import { Store } from "./store";

type Inputs = {
  send: (r: Receivable) => void;
  store: Store;
};

export const coordinator = ({ send, store }: Inputs) => {
  let board = Board.create(3);
  let rules = and(play, wins(board, 5), draw);
  let players: Players = {
    [Side.X]: User.create("X"),
    [Side.O]: User.create("O"),
  };
  let game = Game.Created(Timestamp.now(), board, players);
  const engines: Record<
    Side,
    Required<(ReturnType<typeof spawn> & { rl: ReadLine }) | null>
  > = {
    [Side.X]: null,
    [Side.O]: null,
  };

  const until =
    (f: (str: string) => boolean) =>
    (callback: (str: string) => void) =>
    (rl: ReadLine) => {
      const listener = (line: string) => {
        if (f(line)) {
          rl.off("line", listener);
          callback(line);
        }
      };
      rl.on("line", listener);
    };

  const update = (next: Game) => {
    game = next;
    send(GameUpdated(game));
    Game.match({
      created: (timestamp, _, players) => {
        let count = 0;
        [Side.X, Side.O]
          .map((side) => [side, players[side]] as const)
          .forEach(([side, player]) => {
            Player.match({
              user: () => {},
              engine: (id) => {
                console.log(
                  "starting instance of engine",
                  id,
                  "for side",
                  side
                );
                const { cwd, command, args } = store.get("engines")[id];
                count += 1;
                const { stdout, stdin } = spawn(command, args, {
                  cwd,
                  stdio: ["pipe", "pipe", "pipe"],
                });
                const rl = createInterface({ input: stdout });
                engines[side] = { stdout, stdin, rl } as any;
                until((line) => line.trim() === "st3p version 1 ok")(() => {
                  count -= 1;
                  if (count === 0) {
                    update(Game.Started(timestamp, game));
                  }
                })(rl);
                stdin.write("st3p version 1\n");
              },
            })(player);
          });
      },
      started: () => update(Game.MoveRequested(Timestamp.now(), game)),
      move_requested: (_, previous) => {
        const [board, side] = Game.state(previous);
        const start = Date.now();
        const time = 3000;
        const end = start + time;
        let played = false;
        setTimeout(() => {
          if (played) return;
          update(Game.Ended(Timestamp.now(), game, Result.Timeout(side)));
        }, time);
        Player.match({
          user: () => {},
          engine: () => {
            const engine = engines[side];
            if (engine == null || engine.stdin == null || engine.rl == null)
              return;
            until((line) => line.trim().startsWith("best "))((line) => {
              if (Date.now() > end) return;
              played = true;
              const position = Position.parse(line.slice(5));
              if (position != null) {
                update(Game.attempt(position)(game));
              } else {
                update(
                  Game.Ended(
                    Timestamp.now(),
                    game,
                    Result.UnknownMove(side, line.slice(5))
                  )
                );
              }
            })(engine.rl);
            engine.stdin.write(`move ${str(board)} ${side} time ms:${time}\n`);
          },
        })(players[side]);
      },
      move_attempted: () => update(rules(game)),
      move_made: () => update(Game.MoveRequested(Timestamp.now(), game)),
      ended: () =>
        Object.values(engines)
          .map((e) => e?.stdin as unknown as ReturnType<typeof spawn>["stdin"])
          .forEach((stdin) => stdin?.write("quit\n")),
    })(game);
  };
  const handle = (arg: Sendable) => {
    switch (arg.tag) {
      case "new-game-requested": {
        const [size, _players] = arg.args;
        board = Board.create(size);
        rules = and(play, wins(board, 5), draw);
        players = _players;
        update(Game.Created(Timestamp.now(), board, _players));
        break;
      }
      case "move-attempted": {
        const position = arg.args[0];
        update(Game.MoveAttempted(Timestamp.now(), position, game));
        break;
      }
    }
  };

  return handle;
};

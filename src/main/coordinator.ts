/* eslint-disable @typescript-eslint/no-empty-function */
import { and, draw, play, wins } from "../shared/rules";
import { Vow } from "../shared/vow";
import {
  Board,
  Game,
  Msvn,
  Player,
  Players,
  Result,
  Side,
  Timestamp,
  User,
} from "../shared/model";
import {
  Receivable,
  Sendable,
  PlayersUpdated,
  BoardUpdated,
  HighlightsUpdated,
  MovesUpdated,
  StatusUpdated,
} from "../shared/messaging";
import { Store } from "./store";
import { Engine } from "./engines/engine";
import debug from "debug";
import { Duration } from "luxon";

type Inputs = {
  send: (r: Receivable) => void;
  store: Store;
  msvn: Msvn;
};

const timeout = (side: Side) =>
  Vow.timeout(Duration.fromObject({ seconds: 3 }))(Result.Timeout(side));

const log = debug("stepkic").extend("coordinator");

export const coordinator = ({ send, store, msvn }: Inputs) => {
  let board = Board.create(3);
  let size = 3;
  let winLength = 3;
  let rules = and(play, wins(board, winLength), draw);
  let players: Players = {
    [Side.X]: User.create("X"),
    [Side.O]: User.create("O"),
  };
  let game = Game.Created(Timestamp.now(), board, players, winLength);
  const engines = new Map<Side, Engine>();

  const update = (next: Game) => {
    game = next;
    Game.match({
      created: (_, board, players) => {
        send(PlayersUpdated(players));
        send(BoardUpdated(board));
        send(MovesUpdated());
        send(HighlightsUpdated());
        send(StatusUpdated(Game.statusText(game)));
        engines.values().forEach((e) => e.quit());
        engines.clear();
        const handshakes = new Map<Side, Promise<void>>();
        [Side.X, Side.O]
          .map((side) => [side, players[side]] as const)
          .forEach(([side, player]) => {
            Player.match({
              user: () => {
                handshakes.set(side, Promise.resolve());
              },
              engine: (id) => {
                const engineInfo = store.get("engines")[id];
                const engine = new Engine(
                  engineInfo,
                  msvn,
                  debug("stepkic").extend("engine").extend(side)
                );
                engines.set(side, engine);
                handshakes.set(side, timeout(side)(engine.handshake()));
              },
            })(player);
          });

        Promise.all(handshakes.values())
          .then(() => Game.Started(Timestamp.now(), game))
          .catch((reason: Result) => Game.Ended(Timestamp.now(), game, reason))
          .then(update);
      },
      started: () => {
        send(StatusUpdated(Game.statusText(game)));
        update(Game.MoveRequested(Timestamp.now(), game));
      },
      move_requested: (_, previous) => {
        send(StatusUpdated(Game.statusText(game)));
        const [board, side] = Game.state(previous);
        Player.match({
          user: () => {},
          engine: () => {
            const engine = engines.get(side);
            if (engine == null) return;
            timeout(side)(
              engine.best(
                board,
                side,
                Duration.fromObject({ seconds: 3 }),
                winLength
              )
            )
              .then((position) => Game.attempt(position)(game))
              .catch((reason: Result) =>
                Game.Ended(Timestamp.now(), game, reason)
              )
              .then((game) => {
                log("move made %j", game);
                return game;
              })
              .then(update);
          },
        })(players[side]);
      },
      move_attempted: () => {
        send(StatusUpdated(Game.statusText(game)));
        update(rules(game));
      },
      move_made: () => {
        send(StatusUpdated(Game.statusText(game)));
        send(MovesUpdated(...Game.moves(game)));
        send(BoardUpdated(Game.board(game)));
        update(Game.MoveRequested(Timestamp.now(), game));
      },
      ended: () => {
        send(StatusUpdated(Game.statusText(game)));
        send(MovesUpdated(...Game.moves(game)));
        send(BoardUpdated(Game.board(game)));
        send(HighlightsUpdated(...Game.highlights(game)));
        log("game ended %j", game);
        engines.values().forEach((e) => e.quit());
        engines.clear();
      },
    })(game);
  };

  const handle = ({ tag, args }: Sendable) => {
    switch (tag) {
      case "new-game-requested": {
        const [_size, _players, _winLength] = args;
        log("new game requested %d %d %j", _size, _winLength, _players);
        size = _size;
        players = _players;
        winLength = Msvn.above(2)(() => size)(() => _winLength)(msvn);
        board = Board.create(size);
        rules = and(play, wins(board, winLength), draw);
        update(Game.Created(Timestamp.now(), board, players, winLength));
        break;
      }
      case "move-attempted": {
        const [position] = args;
        log("move attempted %j", position);
        update(Game.MoveAttempted(Timestamp.now(), position, game));
        break;
      }
    }
  };

  return handle;
};

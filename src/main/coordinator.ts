import { and, draw, wins } from "../shared/rules";
import { Board, Game, Position, Side } from "../shared/model";
import {
  GameUpdated,
  MoveMade,
  MoveRequested,
  MovesCleared,
  PlayerUpdated,
  Receivable,
  Sendable,
} from "../shared/messaging";

type Player = {
  name: string;
  type: "user";
};

type Players = {
  [Side.X]: Player;
  [Side.O]: Player;
};

export const coordinator = ({ send }: { send: (r: Receivable) => void }) => {
  let board = Board.create(3);
  let rules = and(draw, wins(board));
  let game = Game.create(board);
  let players: Players = {
    [Side.X]: { name: "X", type: "user" },
    [Side.O]: { name: "O", type: "user" },
  };
  const processNewGame = (size: number, ps: Players) => {
    board = Board.create(size);
    rules = and(draw, wins(board));
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
      started: (_, side) => {
        const player = players[side];
        if (player.type === "user") send(MoveRequested(side));
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      drawn: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      won: () => {},
    })(game);
  };
  return (arg: Sendable) => {
    console.log(arg);
    switch (arg.tag) {
      case "new-game-requested": {
        processNewGame(...arg.args);
        send(MovesCleared());
        [Side.X, Side.O].forEach((side) =>
          send(PlayerUpdated(side, players[side]))
        );
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
};

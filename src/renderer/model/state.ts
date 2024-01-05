import { Board } from "./board";
import { Game } from "./game";
import { Position } from "./position";
import { Side } from "./side";

type Started = ["started", Game];
type Won = ["won", Game, Position[]];
type Drawn = ["drawn", Game];

export type State =
  | Started
  | Won
  | Drawn;

const win = (positions: Position[], board: Board): Side | undefined => {
  let side: Side | undefined = undefined;
  for (const position of positions) {
    const [row, column] = Position.indices(position);
    const cell = board.get(row)?.get(column);
    if (cell == null) return undefined;
    if (cell[0] === "playable") return undefined;
    if (cell[0] === "played") {
      if (side == null) {
        side = cell[1];
        continue;
      }
      else if (side !== cell[1]) return undefined;
    }
  }
  return side;
}

export const State = {
  create: (winners: Position[][], game: Game): State => {
    const board = Game.board(game);
    for (const winner of winners) {
      const side = win(winner, board);
      if (side != null) return ["won", game, winner];
    }
    if (Board.full(board)) return ["drawn", game];
    return ["started", game];
  },
}

import { GameUpdated } from "./game-updated";
import { MoveMade } from "./move-made";
import { MoveRequested } from "./move-requested";
import { MovesCleared } from "./moves-cleared";
import { PlayerUpdated } from "./player-updated";

export type Receivable =
  | MovesCleared
  | GameUpdated
  | MoveRequested
  | MoveMade
  | PlayerUpdated;

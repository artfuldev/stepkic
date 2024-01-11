import { MoveAttempted } from "./move-attempted";
import { NewGameRequested } from "./new-game-requested";

export type Sendable = NewGameRequested | MoveAttempted;

import { HighlightsUpdated } from "./highlights-updated";
import { MovesUpdated } from "./moves-updated";
import { MoveRequested } from "./move-requested";
import { PlayersUpdated } from "./players-updated";
import { BoardUpdated } from "./board-updated";
import { StatusUpdated } from "./status-updated";

export type Receivable =
  | HighlightsUpdated
  | MoveRequested
  | MovesUpdated
  | BoardUpdated
  | StatusUpdated
  | PlayersUpdated;

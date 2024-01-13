import React, { FC } from "react";
import { Players, Side } from "../../shared/model";
import { PlayerView } from "./player-view";

type Props = {
  players: Players;
};

export const PlayersView: FC<Props> = ({ players }) => (
  <div style={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
    {[Side.X, Side.O].map((side) => (
      <PlayerView key={side} side={side} player={players[side]} />
    ))}
  </div>
);

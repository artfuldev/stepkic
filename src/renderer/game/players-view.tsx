import React, { FC } from "react";
import { Player, Players } from "../../shared/model";

type Props = {
  players: Players;
};

const name = Player.match({
  user: (name) => name,
  engine: (_, { name }) => name,
});

export const PlayersView: FC<Props> = ({ players }) => (
  <aside className="players">
    <div className="player x">{name(players.x)}</div>
    <div className="player o">{name(players.o)}</div>
  </aside>
);

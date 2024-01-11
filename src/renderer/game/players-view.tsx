import React, { FC } from "react";
import { Player, Players } from "../../shared/model";

type Props = {
  players: Players;
};

const name = Player.match({
  user: (name) => name,
  engine: (a) => a.args[0].args[0],
});

export const PlayersView: FC<Props> = ({ players }) => (
  <aside className="players">
    <div className="player x">{name(players.x)}</div>
    <div className="player o">{name(players.o)}</div>
  </aside>
);

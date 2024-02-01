import React, { FC } from "react";
import { Player, Side } from "../../../shared/model";
import "./player-view.css";

type Props = {
  player: Player;
  side: Side;
};

const name = Player.match({
  user: ({ name }) => <span>{name}</span>,
  engine: (_, { name, version }) => <span>{name} <em>v{version}</em></span>,
});

const bio = Player.match({
  user: () => "user",
  engine: (_, { author }) => `by ${author}`,
});

export const PlayerView: FC<Props> = ({ player, side }) => (
  <div className={`player ${side}`}>
    <div className="avatar"></div>
    <div className="info">
      <div className="name">{name(player)}</div>
      <div className="bio">{bio(player)}</div>
    </div>
    <div className="side">{side}</div>
  </div>
);

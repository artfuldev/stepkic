import React, { FC } from "react";
import { Player, Side } from "../../shared/model";

type Props = {
  player: Player;
  side: Side;
};

const name = Player.match({
  user: (name) => name,
  engine: (_, { name, version }) => `${name} v${version}`,
});

const bio = Player.match({
  user: () => "user",
  engine: (_, { author }) => `by ${author}`,
});

export const PlayerView: FC<Props> = ({ player, side }) => (
  <div className={`player ${side}`}>
    <div className="name">{name(player)}</div>
    <div className="bio">{bio(player)}</div>
  </div>
);

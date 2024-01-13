import React, { FC } from "react";
import { Player, Players } from "../../shared/model";
import "./players-view.css";

type Props = {
  players: Players;
};

const name = Player.match({
  user: (name) => name,
  engine: (_, { name, version }) => `${name} v${version}`,
});

const bio = Player.match({
  user: () => "user",
  engine: (_, { author }) => `by ${author}`
})

export const PlayersView: FC<Props> = ({ players }) => (
  <div style={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
    <div className="player x">
      <div className="name">{name(players.x)}</div>
      <div className="bio">{bio(players.x)}</div>
    </div>
    <div className="player o">
      <div className="name">{name(players.o)}</div>
      <div className="bio">{bio(players.x)}</div>
    </div>
  </div>
);

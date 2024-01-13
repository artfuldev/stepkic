import React, { FC } from "react";
import { BoardView } from "./board-view";
import { Board, Players, Position } from "../../shared/model";
import { PlayersView } from "./players-view";
import { MovesView } from "./moves-view";
import "./game-view.css";

type Props = {
  size: number;
  players: Players;
  board: Board;
  playable: boolean;
  moves: Position[];
  highlights: Position[];
  status: string;
  play: (position: Position) => void;
};

export const GameView: FC<Props> = ({
  size,
  players,
  status,
  highlights,
  playable,
  board,
  moves,
  play,
}) => {
  return (
    <div className="game">
      <div className="header">
        <PlayersView players={players} />
      </div>
      <div className="board">
          <BoardView
            size={size}
            board={board}
            highlights={highlights}
            interactive={playable}
            onPlay={play}
          />
      </div>
      <div className="sidebar">
        <MovesView moves={moves} />
      </div>
      <div className="footer">
        <span>{status}</span>
      </div>
    </div>
  );
};

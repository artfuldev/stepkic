import React, { FC, useState } from "react";
import { EnginesView } from "./engines-view";
import { AddEngine } from "./add-engine";
import { useEngines } from "./use-engines";
import "./global.scss";
import { CreateGame } from "./create-game";

export const App: FC = () => {
  const { engines, onAdd, onPlay, onDelete } = useEngines();
  const [addRequested, setAddRequested] = useState(false);
  const [createRequested, setCreateRequested] = useState(false);

  return (
    <>
      <AddEngine open={addRequested} setOpen={setAddRequested} onAdd={onAdd} />
      <CreateGame
        engines={engines}
        open={createRequested}
        setOpen={setCreateRequested}
        onPlay={onPlay}
      />
      <EnginesView
        engines={engines}
        onAdd={() => setAddRequested(true)}
        onCreate={() => setCreateRequested(true)}
        onDelete={onDelete}
      />
    </>
  );
};

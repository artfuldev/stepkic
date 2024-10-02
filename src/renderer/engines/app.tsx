import React, { FC, useState } from "react";
import { EnginesView } from "./engines-view";
import { AddEngine } from "./add-engine";
import { useEngines } from "./use-engines";
import "./global.scss";
import { CreateGame } from "./create-game";
import { useMsvn } from "../shared/use-msvn";

export const App: FC = () => {
  const { engines, onAdd, onPlay, onDelete } = useEngines();
  const [addRequested, setAddRequested] = useState(false);
  const [createRequested, setCreateRequested] = useState(false);
  const msvn = useMsvn();

  return (
    <>
      <AddEngine open={addRequested} setOpen={setAddRequested} onAdd={onAdd} />
      <CreateGame
        msvn={msvn}
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

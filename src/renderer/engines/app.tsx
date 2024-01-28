import React, { FC, useState } from "react";
import { EnginesView } from "./engines-view";
import { AddEngine } from "./add-engine";
import { useEngines } from "./use-engines";
import "./global.scss";

export const App: FC = () => {
  const { engines, onAdd, onDelete } = useEngines();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddEngine open={open} setOpen={setOpen} onAdd={onAdd} />
      <EnginesView
        engines={engines}
        onAdd={() => setOpen(true)}
        onDelete={onDelete}
      />
    </>
  );
};

import { useEffect, useState } from "react";
import { Engine, EngineInfo, ProcessInfo, Side } from "../../shared/model";
import { Response } from "../../shared/messaging/engines/response";
import { Request } from "../../shared/messaging/engines/request";
import { NewGameRequested } from "../../shared/messaging";
import { IdentifiableEngine, NewGameArgs } from "./new-game-args";


type Result = {
  engines: IdentifiableEngine[];
  onAdd: (info: ProcessInfo) => void;
  onPlay: (args: NewGameArgs) => void;
  onDelete: (id: string) => void;
};

export const useEngines = (): Result => {
  const [entries, setEntries] = useState<[string, EngineInfo][]>([]);
  const engines = entries.map(([id, info]) => ({ ...info, id }));

  useEffect(
    () =>
      window.electron.ipcRenderer.on("engines", (_, response: Response) => {
        setEntries(Object.entries(response.args[0]));
      }),
    []
  );

  useEffect(
    () => window.electron.ipcRenderer.send("engines", Request.List()),
    []
  );

  const onDelete = (id: string) =>
    window.electron.ipcRenderer.send("engines", Request.Delete(id));
  const onAdd = (info: ProcessInfo) =>
    window.electron.ipcRenderer.send("engines", Request.Create(info));

  const onPlay = ({ x, o, size, winLength }: NewGameArgs) => {
    window.electron.ipcRenderer.send(
      "main",
      NewGameRequested(size, {
        [Side.X]: Engine.create(x.id, x),
        [Side.O]: Engine.create(o.id, o),
      }, winLength)
    );
  };

  return {
    engines,
    onAdd,
    onPlay,
    onDelete,
  };
};

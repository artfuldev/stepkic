import React, { FC, useEffect, useState } from "react";
import { EngineInfo, ProcessInfo } from "../../shared/model";
import { Response } from "../../shared/messaging/engines/response";
import { Request } from "../../shared/messaging/engines/request";
import { EnginesView } from "./engines-view";
import { AddEngine } from "./add-engine";
import "./global.scss";

export const App: FC = () => {
  const [engines, setEngines] = useState<[string, EngineInfo][]>([]);
  const data = engines.map(([id, info]) => ({ ...info, id }));

  useEffect(() => {
    return window.electron.ipcRenderer.on(
      "engines",
      (_, response: Response) => {
        setEngines(Object.entries(response.args[0]));
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.send("engines", Request.List());
  }, []);

  const onDelete = (id: string) =>
    window.electron.ipcRenderer.send("engines", Request.Delete(id));
  const onAdd = (info: ProcessInfo) =>
    window.electron.ipcRenderer.send("engines", Request.Create(info));

  const [open, setOpen] = useState(false);

  return (
    <>
      <AddEngine open={open} setOpen={setOpen} onAdd={onAdd} />
      <EnginesView
        engines={data}
        onAdd={() => setOpen(true)}
        onDelete={onDelete}
      />
    </>
  );
};

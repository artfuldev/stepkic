import { useEffect, useState } from "react";
import { Msvn } from "../../shared/model";
import { MsvnUpdated, MsvnRequested } from "../../shared/messaging/msvn";

export const useMsvn = () => {
  const [msvn, setMsvn] = useState(Msvn.default());

  useEffect(
    () =>
      window.electron.ipcRenderer.on("msvn", (_, response: MsvnUpdated) => {
        setMsvn(response.args[0]);
      }),
    [setMsvn]
  );

  useEffect(
    () => window.electron.ipcRenderer.send("msvn", MsvnRequested()),
    []
  );

  return msvn;
};

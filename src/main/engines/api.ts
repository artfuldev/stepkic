/* eslint-disable @typescript-eslint/no-empty-function */
import { ipcMain } from "electron";
import { Request } from "../../shared/messaging/engines/request";
import { Response } from "../../shared/messaging/engines/response";
import { Msvn, ProcessInfo } from "../../shared/model";
import { sha1 } from "object-hash";
import { Store } from "../store";
import { Engine } from "./engine";
import debug from "debug";
import { LineBasedProcess } from "./line-based-process";

export const api = (store: Store, msvn: Msvn) => {
  const remove = (id: string) => {
    const engines = store.get("engines", {});
    delete engines[id];
    store.set("engines", engines);
  };

  const add = async (processInfo: ProcessInfo) => {
    const log = debug("stepkic").extend("engines").extend("add");
    const process = new LineBasedProcess(processInfo, log.extend("process"));
    const engine = new Engine(process, msvn, log);
    const engineIdentification = await engine.identify();
    engine.quit();
    const engineInfo = { ...processInfo, ...engineIdentification };
    const id = sha1(engineInfo);
    const engines = store.get("engines", {});
    if (engines[id] != null) return;
    engines[id] = engineInfo;
    store.set("engines", engines);
  };

  ipcMain.on("engines", ({ reply }, request: Request) => {
    Request.match({
      list: () => {
        reply("engines", Response.Updated(store.get("engines", {})));
      },
      create: (info) => {
        add(info).then(() =>
          reply("engines", Response.Updated(store.get("engines", {})))
        );
      },
      delete: (id) => {
        remove(id);
        reply("engines", Response.Updated(store.get("engines", {})));
      },
    })(request);
  });
};

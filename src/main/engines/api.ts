/* eslint-disable @typescript-eslint/no-empty-function */
import { ipcMain } from "electron";
import { Request } from "../../shared/messaging/engines/request";
import { Response } from "../../shared/messaging/engines/response";
import {
  EngineInfo,
  EngineIdentification,
  ProcessInfo,
} from "../../shared/model";
import { spawn } from "child_process";
import { createInterface } from "node:readline";
import { Process } from "./process";
import { createHash } from "node:crypto";
import { Store } from "../store";

const hash = (value: string) => createHash("md5").update(value).digest("hex");

export const api = (store: Store) => {
  const _delete = (id: string) => {
    const engines = store.get("engines", {});
    delete engines[id];
    store.set("engines", engines);
  };
  const upsert = (
    { cwd, command, args }: ProcessInfo,
    next: (process: Process) => void
  ) => {
    let process = Process.Opened();
    const { stdin, stdout, kill } = spawn(command, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const rl = createInterface({ input: stdout });
    const matcher = (line: string) => {
      console.log(process, line);
      Process.match({
        opened: () => {
          if (line.trim() !== "st3p version 1 ok") {
            next(process);
            return;
          }
          process = Process.Handshook({});
          queueMicrotask(() => stdin.write("identify\n"));
        },
        handshook: (record) => {
          if (!line.startsWith("identify ")) {
            next(process);
            return;
          }
          if (line.trim() === "identify ok") {
            rl.off("line", matcher);
            const keys = new Set(Object.keys(record));
            if (
              !keys.has("name") ||
              !keys.has("version") ||
              !keys.has("author") ||
              !keys.has("url")
            ) {
              next(process);
              return;
            }
            const engine = { cwd, command, args, ...record } as EngineInfo;
            process = Process.Identified(engine);
            stdin.write("quit\n");
            const id = hash(JSON.stringify(engine));
            const engines = store.get("engines", {});
            if (engines[id] != null) return;
            engines[id] = engine;
            store.set("engines", engines);
            next(process);
          }
          const [key, value] = line.slice(9).split(" ");
          process = Process.Handshook({ ...record, [key]: value });
        },
        identified: () => {
          rl.off("line", matcher);
          kill();
        },
      })(process);
    };
    rl.on("line", matcher);
    stdin.write("st3p version 1\n");
  };
  ipcMain.on("engines", ({ reply }, request: Request) => {
    Request.match({
      list: () => {
        const engines = store.get("engines", {});
        console.log("engines", engines);
        reply("engines", Response.Updated(engines));
      },
      create: (info) => {
        upsert(
          info,
          Process.match({
            opened: () => {},
            handshook: () => {},
            identified: () => {
              reply("engines", Response.Updated(store.get("engines", {})));
            },
          })
        );
      },
      update: (id, info) => {
        upsert(
          info,
          Process.match({
            opened: () => {},
            handshook: () => {},
            identified: () => {
              _delete(id);
              reply("engines", Response.Updated(store.get("engines", {})));
            },
          })
        );
      },
      delete: (id) => {
        _delete(id);
        reply("engines", Response.Updated(store.get("engines", {})));
      },
    })(request);
  });
};

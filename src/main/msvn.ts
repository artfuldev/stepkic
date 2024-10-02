import { App, ipcMain } from "electron";
import { MsvnRequested, MsvnUpdated } from "../shared/messaging/msvn";
import { Msvn } from "../shared/model";

const DEFAULT_MSVN = 2;

export const msvn = (app: App) => {
  const value = Number(app.commandLine.getSwitchValue("msvn"));
  const msvn: Msvn = {
    tag: "msvn",
    args: [Number.isSafeInteger(value) && value > 0 ? value : DEFAULT_MSVN],
  };

  ipcMain.on("msvn", ({ reply }, request: MsvnRequested) => {
    console.log(request);
    reply("msvn", MsvnUpdated(msvn));
  });

  return msvn;
}

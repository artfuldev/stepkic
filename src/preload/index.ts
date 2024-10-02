// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { Receivable, Sendable } from "../shared/messaging";
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { exposeElectronAPI } from '@electron-toolkit/preload'

exposeElectronAPI();

contextBridge.exposeInMainWorld("messaging", {
  send: (sendable: Sendable) => ipcRenderer.send("main", sendable),
  receive: (listener: (receivable: Receivable) => void) => {
    const receiver = (_: IpcRendererEvent, receivable: Receivable) =>
      listener(receivable);
    ipcRenderer.on("main", receiver);
    return () => {
      ipcRenderer.removeListener("main", receiver);
    };
  },
});

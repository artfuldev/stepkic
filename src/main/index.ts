import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import log from "electron-log/main";
import { Sendable } from "../shared/messaging";
import { coordinator } from "./coordinator";
import { api } from "./engines/api";
import fixPath from "fix-path";
import { store } from "./store";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  return mainWindow;
};

Object.assign(console, log.functions);

log.initialize();

const createEnginesWindow = () => {
  // Create the browser window.
  const enginesWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  // and load the index.html of the app.
  if (ENGINES_WINDOW_VITE_DEV_SERVER_URL) {
    enginesWindow.loadURL(ENGINES_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    enginesWindow.loadFile(
      path.join(__dirname, `../../renderer/${ENGINES_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  return enginesWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  fixPath();
  const window = createWindow();
  const _store = store();
  createEnginesWindow();
  const receiver = coordinator({
    send: (r) => window.webContents.send("main", r),
    store: _store,
  });
  ipcMain.on("main", (_, arg: Sendable) => receiver(arg));
  api(_store);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

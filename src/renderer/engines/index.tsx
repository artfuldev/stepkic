import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import log from "electron-log/renderer";

Object.assign(console, log.functions);

const app = document.getElementById("app");
if (app == null) throw new Error("No app element");
const root = createRoot(app);

root.render(<App />);

import { Tagged } from "../tagged";

type EngineIdentification = {
  name: string;
  version: string;
  author: string;
  url: string;
};
type ProcessInfo = { cwd: string; process: string; args: string[] };
export type Engine = Tagged<"engine", [ProcessInfo, EngineIdentification]>;
 
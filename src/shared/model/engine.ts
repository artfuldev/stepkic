import { Tagged, Union } from "../tagged";

type EngineIdentification = {
  name: string;
  version: string;
  author: string;
  url: string;
};
type ProcessInfo = { cwd: string; process: string; args: string[] };
type Uninitialized = Tagged<"uninitialized", [ProcessInfo]>;
type Initialized = Tagged<"initialized", [ProcessInfo, EngineIdentification]>;
type EngineStateVariants = [Uninitialized, Initialized];
type EngineState = Union<EngineStateVariants>;
export type Engine = Tagged<"engine", [EngineState]>;

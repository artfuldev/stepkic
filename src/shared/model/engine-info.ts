import { ProcessInfo } from "./process-info";

type EngineIdentification = {
  name: string;
  version: string;
  author: string;
  url: string;
};
export type EngineInfo = ProcessInfo & EngineIdentification;

import { Identification } from "./identification";

export type EngineIdentification = Identification & {
  version: string;
  author: string;
  url: string;
};

import { EngineInfo } from "../../shared/model";

export type IdentifiableEngine = EngineInfo & { id: string };

export type NewGameArgs = {
  x: IdentifiableEngine;
  o: IdentifiableEngine;
  size: number;
  winLength: number;
}

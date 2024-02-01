import { Tagged } from "../tagged";
import { EngineIdentification } from "./engine-identification";

export type Engine = Tagged<"engine", [string, EngineIdentification]>;

export const Engine = {
  create: (id: string, info: EngineIdentification): Engine => ({
    tag: "engine",
    args: [id, info],
  }),
};

import ElectronStore from "electron-store";
import { EngineInfo } from "../../shared/model";

export type StoreType = {
  engines: Record<string, EngineInfo>;
};

export type Store = ElectronStore<StoreType>;

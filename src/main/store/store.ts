import ElectronStore from "electron-store";
import { StoreType } from "./store.type";

export const store = () => new ElectronStore<StoreType>();

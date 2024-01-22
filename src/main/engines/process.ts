import { EngineInfo } from "../../shared/model";
import { Tagged, Union, constructor, match } from "../../shared/tagged";

type Opened = Tagged<"opened", []>;
type Handshook = Tagged<"handshook", [Record<string, string>]>;
type Identified = Tagged<"identified", [EngineInfo]>;
type Variants = [Opened, Handshook, Identified];
export type Process = Union<Variants>;

export const Process = {
  Opened: constructor<Variants, Opened>("opened"),
  Handshook: constructor<Variants, Handshook>("handshook"),
  Identified: constructor<Variants, Identified>("identified"),
  match: match<Variants>(),
}

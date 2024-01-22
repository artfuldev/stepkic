import { EngineInfo } from "../../model";
import { Tagged, Union, constructor, match } from "../../tagged";

type Updated = Tagged<"updated", [Record<string, EngineInfo>]>;
type Variants = [Updated];
export type Response = Union<Variants>;

export const Response = {
  Updated: constructor<Variants, Updated>("updated"),
  match: match<Variants>(),
};

import { ProcessInfo } from "../../model";
import { constructor, Tagged, Union, match } from "../../tagged";

type List = Tagged<"list", []>;
type Create = Tagged<"create", [ProcessInfo]>;
type Delete = Tagged<"delete", [string]>;
type Variants = [List, Create, Delete];
export type Request = Union<Variants>;

export const Request = {
  List: constructor<Variants, List>("list"),
  Create: constructor<Variants, Create>("create"),
  Delete: constructor<Variants, Delete>("delete"),
  match: match<Variants>(),
};

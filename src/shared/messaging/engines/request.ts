import { ProcessInfo } from "../../model";
import { constructor, Tagged, Union, match } from "../../tagged";

type List = Tagged<"list", []>;
type Create = Tagged<"create", [ProcessInfo]>;
type Update = Tagged<"update", [string, ProcessInfo]>;
type Delete = Tagged<"delete", [string]>;
type Variants = [List, Create, Update, Delete];
export type Request = Union<Variants>;

export const Request = {
  List: constructor<Variants, List>("list"),
  Create: constructor<Variants, Create>("create"),
  Update: constructor<Variants, Update>("update"),
  Delete: constructor<Variants, Delete>("delete"),
  match: match<Variants>(),
};

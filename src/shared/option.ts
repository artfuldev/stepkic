import { Tagged } from "./tagged";

type None = Tagged<"none", []>;
type Some<A> = Tagged<"some", [A]>;
export type Option<A> = None | Some<A>;
const None: None = { tag: "none", args: [] };

export const Option = {
  None: <A = unknown>(): Option<A> => None,
  Some: <A>(value: A): Option<A> => ({ tag: "some", args: [value] }),
  map: <A, B>(f: (t: A) => B) => (oa: Option<A>): Option<B> => {
    switch (oa.tag) {
      case "none":
        return Option.None();
      case "some":
        return Option.Some(f(oa.args[0]));
    }
  }
};

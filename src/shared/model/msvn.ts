import { Tagged } from "../tagged";

export type Msvn = Tagged<"msvn", [number]>;

export const Msvn = {
  default: (): Msvn => ({ tag: "msvn", args: [1] }),
  handshake: ({ args: [msvn] }: Msvn): string =>
    ["st3p", "version", msvn.toString()].join(" "),
  expectation: (msvn: Msvn): string => [Msvn.handshake(msvn), "ok"].join(" "),
  above:
    (min: number) =>
    <T>(no: () => T) =>
    (yes: () => T) =>
    ({ args: [msvn] }: Msvn): T =>
      msvn >= min ? yes() : no(),
};

import { Tagged } from "../tagged";

export type Timestamp = Tagged<"epoch_ms", [number]>;

export const Timestamp = {
  now: (): Timestamp => ({ tag: "epoch_ms", args: [Date.now()] }),
  of: (date: Date): Timestamp => ({ tag: "epoch_ms", args: [date.getTime()] }),
};

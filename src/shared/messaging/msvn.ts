import { Msvn } from "../model";
import { Tagged } from "../tagged";

export type MsvnRequested = Tagged<"msvn-requested", []>;

export const MsvnRequested = (): MsvnRequested => ({
  tag: "msvn-requested",
  args: [],
});

export type MsvnUpdated = Tagged<"msvn-updated", [Msvn]>;

export const MsvnUpdated = (msvn: Msvn): MsvnUpdated => ({
  tag: "msvn-updated",
  args: [msvn],
});

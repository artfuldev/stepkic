import { Constructor, Tagged } from "../tagged";

export type StatusUpdated = Tagged<"status-updated", [string]>;

export const StatusUpdated: Constructor<StatusUpdated, StatusUpdated> = (
  ...args
): StatusUpdated => ({
  tag: "status-updated",
  args,
});

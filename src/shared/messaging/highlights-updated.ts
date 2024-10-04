import { Position } from "../model";
import { Constructor, Tagged } from "../tagged";

export type HighlightsUpdated = Tagged<"highlights-updated", Position[]>;

export const HighlightsUpdated: Constructor<
  HighlightsUpdated,
  HighlightsUpdated
> = (...args): HighlightsUpdated => ({
  tag: "highlights-updated",
  args,
});

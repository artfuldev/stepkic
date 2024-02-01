import { Tagged } from "../tagged";
import { Identification } from "./identification";

export type User = Tagged<"user", [Identification]>;

export const User = {
  create: (name: string): User => ({ tag: "user", args: [{ name }] }),
};

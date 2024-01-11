import { Tagged, Union } from "../tagged";
import { Engine } from "./engine";

type Name = string;
type User = Tagged<"user", [Name]>;
type PlayerVariants = [User, Engine];
export type Player = Union<PlayerVariants>;

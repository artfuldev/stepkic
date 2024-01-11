import { Game } from "../model";

export type Rule = (game: Game) => Game;

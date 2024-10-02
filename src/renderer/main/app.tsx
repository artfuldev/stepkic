import React, { FC } from "react";
import { Game } from "./game";
import "./index.css";


export const App: FC = () => {
  return <Game size={3} winLength={2} />;
};

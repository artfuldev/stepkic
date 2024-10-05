import {
  Board,
  EngineIdentification,
  Msvn,
  Position,
  Result,
  Side,
} from "../../shared/model";
import { Debugger } from "debug";
import { Duration } from "luxon";
import { str } from "../t3en/board";
import { LineBasedProcess } from "./line-based-process";

export class Engine {
  static readonly #IDENTIFY_REQUIRED_KEYS = [
    "name",
    "version",
    "author",
    "url",
  ];
  handshook = false;

  constructor(
    private readonly process: LineBasedProcess,
    private readonly msvn: Msvn,
    private readonly log: Debugger
  ) {}

  async handshake() {
    if (this.handshook) return;
    return new Promise<void>((resolve) => {
      const listener = (answer: string) => {
        if (answer.trim() !== Msvn.expectation(this.msvn)) return;
        this.handshook = true;
        this.process.off(listener);
        resolve();
      };
      this.process.on(listener);
      this.process.send(Msvn.handshake(this.msvn));
    });
  }

  async identify(): Promise<EngineIdentification> {
    await this.handshake();
    return new Promise((resolve, reject) => {
      const map = new Map();
      const listener = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("identify ")) return;
        const pruned = trimmed.slice(9);
        if (pruned === "ok") {
          this.process.off(listener);
          const missing = Engine.#IDENTIFY_REQUIRED_KEYS.filter(
            (x) => !map.has(x)
          );
          if (missing.length !== 0)
            reject(new Error(`missing keys in identify: ${missing}`));
          else resolve(Object.fromEntries(map.entries()));
        }
        const [key, value] = pruned.split(" ");
        map.set(key, value);
      };
      this.process.on(listener);
      this.process.send("identify");
    });
  }

  async best(
    board: Board,
    side: Side,
    time?: Duration,
    winLength?: number
  ): Promise<Position> {
    await this.handshake();
    const size = Board.size(board);
    const command = ["move", str(board), side]
      .concat(time != null ? ["time", `ms:${time.toMillis()}`] : [])
      .concat(
        Msvn.above(2)<string[]>(() => [])(() =>
          winLength != null && winLength !== size
            ? ["win-length", winLength.toString()]
            : []
        )(this.msvn)
      )
      .join(" ");
    return new Promise((resolve, reject) => {
      const listener = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("best ")) return;
        const pruned = trimmed.slice(5);
        const position = Position.parse(pruned);
        this.process.off(listener);
        if (position == null) reject(Result.UnknownMove(side, pruned));
        else resolve(position);
      };
      this.process.on(listener);
      this.process.send(command);
    });
  }

  quit() {
    this.process.send("quit");
    if (this.process.exitCode != null) this.process.kill();
  }
}

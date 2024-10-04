import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import {
  Board,
  EngineIdentification,
  Msvn,
  Position,
  ProcessInfo,
  Result,
  Side,
} from "../../shared/model";
import { createInterface, Interface } from "node:readline/promises";
import { Debugger } from "debug";
import { Duration } from "luxon";
import { str } from "../t3en/board";
import { Vow } from "../../shared/vow";

export class Engine {
  static readonly IDENTIFY_REQUIRED_KEYS = ["name", "version", "author", "url"];
  readonly #process: ChildProcessWithoutNullStreams;
  readonly #rl: Interface;
  handshook = false;

  constructor(
    { cwd, command, args }: ProcessInfo,
    private readonly msvn: Msvn,
    private readonly log: Debugger
  ) {
    this.#process = spawn(command, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.#rl = createInterface({ input: this.#process.stdout });
    this.log("started process");
  }

  #in(listener: (line: string) => void) {
    return (line: string) => {
      this.log("< %s", line);
      listener(line);
    };
  }

  #out(line: string) {
    this.log("> %s", line);
    this.#process.stdin.write(`${line}\n`);
  }

  async handshake() {
    if (this.handshook) return;
    return new Promise<void>((resolve, reject) => {
      this.#rl.once(
        "line",
        this.#in((answer) => {
          if (answer.trim() === Msvn.expectation(this.msvn)) {
            this.handshook = true;
            resolve();
          } else reject(new Error(`invalid handshake: ${answer}`));
        })
      );
      this.#out(Msvn.handshake(this.msvn));
    });
  }

  async identify() {
    await this.handshake();
    return new Promise<EngineIdentification>((resolve, reject) => {
      const map = new Map();
      const listener = this.#in((line: string) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("identify ")) return;
        const pruned = trimmed.slice(9);
        if (pruned === "ok") {
          this.#rl.off("line", listener);
          const missing = Engine.IDENTIFY_REQUIRED_KEYS.filter(
            (x) => !map.has(x)
          );
          if (missing.length !== 0)
            reject(new Error(`missing keys in identify: ${missing}`));
          else resolve(Object.fromEntries(map.entries()));
        }
        const [key, value] = pruned.split(" ");
        map.set(key, value);
      });
      this.#rl.on("line", listener);
      this.#out("identify");
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
      const listener = this.#in((line: string) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("best ")) return;
        const pruned = trimmed.slice(5);
        const position = Position.parse(pruned);
        this.#rl.off("line", listener);
        if (position == null) reject(Result.UnknownMove(side, pruned));
        else resolve(position);
      });
      this.#rl.on("line", listener);
      this.#out(command);
    });
  }

  quit() {
    this.#out("quit");
    this.#kill();
  }

  #kill() {
    this.log("kill requested");
    this.#process.kill();
    this.log("killed");
  }
}

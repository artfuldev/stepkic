import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { EngineIdentification, Msvn, ProcessInfo } from "../../shared/model";
import { createInterface, Interface } from "node:readline/promises";
import debug, { Debugger } from "debug";
import { nanoid } from "nanoid";

const REQUIRED_KEYS = ["name", "version", "author", "url"];

export class Engine {
  readonly #log: Debugger;
  readonly #process: ChildProcessWithoutNullStreams;
  readonly #rl: Interface;

  constructor(
    { cwd, command, args }: ProcessInfo,
    private readonly msvn: Msvn
  ) {
    this.#process = spawn(command, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.#log = debug("engine").extend(nanoid());
    this.#rl = createInterface({ input: this.#process.stdout });
    this.#log("started process");
  }

  #in(listener: (line: string) => void) {
    return (line: string) => {
      this.#log("< %s", line);
      listener(line);
    };
  }

  #out(line: string) {
    this.#log("> %s", line);
    this.#process.stdin.write(`${line}\n`);
  }

  async #initialize() {
    return new Promise<void>((resolve, reject) => {
      this.#rl.once(
        "line",
        this.#in((answer) => {
          if (answer.trim() === Msvn.expectation(this.msvn)) {
            resolve();
          } else reject(new Error(`invalid handshake: ${answer}`));
        })
      );
      this.#out(Msvn.handshake(this.msvn));
    });
  }

  async identify() {
    await this.#initialize();
    return new Promise<EngineIdentification>((resolve, reject) => {
      const map = new Map();
      const listener = this.#in((line: string) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("identify ")) return;
        const pruned = trimmed.slice(9);
        if (pruned === "ok") {
          this.#rl.off("line", listener);
          const missing = REQUIRED_KEYS.filter((x) => !map.has(x));
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

  quit() {
    this.#out("quit");
    this.#kill();
  }

  #kill() {
    this.#log("kill requested");
    this.#process.kill();
    this.#log("killed");
  }
}

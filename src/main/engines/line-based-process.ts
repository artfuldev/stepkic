import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { ProcessInfo } from "../../shared/model";
import { createInterface, Interface } from "node:readline/promises";
import { Debugger } from "debug";

export class LineBasedProcess {
  readonly #process: ChildProcessWithoutNullStreams;
  readonly #log: Debugger;
  readonly #out: Debugger;
  readonly #rl: Interface;
  constructor(
    { cwd, command, args }: ProcessInfo,
    log: Debugger
  ) {
    this.#process = spawn(command, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.#rl = createInterface({ input: this.#process.stdout });
    this.#log = log;
    const _log = log.extend('<');
    this.#out = log.extend('>');
    this.#rl.on("line", (line: string) => _log(line));
    this.#log("started process");
  }

  on(listener: (line: string) => void) {
    this.#rl.on("line", listener);
    this.#log('added listener');
    return this;
  }

  off(listener: (line: string) => void) {
    this.#rl.off("line", listener);
    this.#log('removed listener');
    return this;
  }

  send(line: string) {
    this.#out(line);
    this.#process.stdin.write(`${line}\n`);
    return this;
  }

  get exitCode() {
    return this.#process.exitCode;
  }

  kill() {
    this.#log("kill requested");
    this.#process.kill();
    this.#log("killed");
  }
}

import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { ProcessInfo } from "../../shared/model";
import { createInterface, Interface } from "node:readline/promises";
import { Debugger } from "debug";
import { Observable, Subject } from "rxjs";

export class LineBasedProcess {
  readonly #process: ChildProcessWithoutNullStreams;
  readonly #log: Debugger;
  readonly #out: Debugger;
  readonly #rl: Interface;
  readonly lines: Observable<string>;
  constructor({ cwd, command, args }: ProcessInfo, log: Debugger) {
    this.#log = log;
    this.#process = spawn(command, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.#log("started process");
    this.#rl = createInterface({ input: this.#process.stdout });
    const _log = log.extend("<");
    this.#out = log.extend(">");
    const subject = new Subject<string>();
    this.#rl.on("line", _log.bind(_log));
    this.#rl.on("line", (line) => subject.next(line.trim()));
    this.lines = subject.asObservable();
    this.#log("started observing input stream");
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

import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { ProcessInfo } from "../../shared/model";
import { createInterface, Interface } from "node:readline/promises";
import { Debugger } from "debug";
import { Observable, Subject } from "rxjs";

export class LineBasedProcess {
  readonly #process: ChildProcessWithoutNullStreams;
  readonly #log: Debugger;
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
    const subject = new Subject<string>();
    this.#rl.on("line", line => this.#log('<: %s', line));
    this.#rl.on("line", (line) => subject.next(line.trim()));
    this.lines = subject.asObservable();
    this.#log("started observing input stream");
  }

  send(line: string) {
    this.#log('>: %s', line);
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

import { spawn } from "node:child_process";
import { EngineIdentification, Msvn, ProcessInfo } from "../../shared/model";
import { createInterface, Interface } from "node:readline/promises";
import debug, { Debugger } from "debug";
import { Writable } from "node:stream";
import { nanoid } from "nanoid";

const REQUIRED_KEYS = ["name", "version", "author", "url"];

export class Engine {
  private readonly _log: Debugger;
  private readonly _stdin: Writable;
  private readonly _kill: () => void;
  private readonly _rl: Interface;
  private _initialized = false;

  constructor({ cwd, command, args }: ProcessInfo, private readonly msvn: Msvn) {
    const { stdin, stdout, kill } = spawn(command, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this._stdin = stdin;
    this._log = debug("engine").extend(nanoid());
    this._rl = createInterface({ input: stdout });
    this._kill = kill;
    this._log("started process");
  }

  async initialize() {
    return new Promise<void>((resolve, reject) => {
      this._rl.once("line", (answer) => {
        this._log('< %s', answer);
        if (answer.trim() === Msvn.expectation(this.msvn)) {
          this._initialized = true;
          resolve();
        }
        else reject(new Error(`invalid handshake: ${answer}`));
      });
      const command = Msvn.handshake(this.msvn);
      this._log('> %s', command);
      this._stdin.write(`${command}\n`);
    });
  }

  async identify() {
    return new Promise<EngineIdentification>((resolve, reject) => {
      const map = new Map();
      const listener = (line: string) => {
        this._log('< %s', line);
        const trimmed = line.trim();
        if (!trimmed.startsWith('identify ')) return;
        const pruned = trimmed.slice(9);
        if (pruned === 'ok') {
          this._rl.off('line', listener);
          const missing = REQUIRED_KEYS.filter(x => !map.has(x));
          if (missing.length !== 0) reject(new Error(`missing keys in identify: ${missing}`));
          else resolve(Object.fromEntries(map.entries()));
        }
        const [key, value] = pruned.split(" ");
        map.set(key, value)
      }
      this._rl.on('line', listener);
      const command = 'identify';
      this._log('> %s', command);
      this._stdin.write(`${command}\n`);
    });
  }

  kill() {
    this._kill();
  }
}

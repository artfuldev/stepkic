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
import {
  filter,
  firstValueFrom,
  map,
  of,
  reduce,
  skipWhile,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
  throwError,
} from "rxjs";

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

  async handshake(): Promise<void> {
    if (this.handshook) return;
    const handshake = this.process.lines.pipe(
      skipWhile((line) => line !== Msvn.expectation(this.msvn)),
      tap(() => (this.handshook = true)),
      map(() => undefined)
    );
    this.process.send(Msvn.handshake(this.msvn));
    return firstValueFrom(handshake);
  }

  async identify(): Promise<EngineIdentification> {
    await this.handshake();
    const identification = this.process.lines.pipe(
      map((line) => line.trim()),
      filter((line) => line.startsWith("identify ")),
      takeUntil(
        this.process.lines.pipe(skipWhile((line) => line !== `identify ok`))
      ),
      map((line) => line.slice(9).split(" ")),
      tap(([key, val]) => this.log("id %s: %s", key, val)),
      reduce((map, [key, val]) => map.set(key, val), new Map<string, string>()),
      map(
        (map) =>
          [
            map,
            Engine.#IDENTIFY_REQUIRED_KEYS.filter((x) => !map.has(x)),
          ] as const
      ),
      switchMap(([map, missing]) =>
        missing.length === 0
          ? of(Object.fromEntries(map.entries()) as EngineIdentification)
          : throwError(() => new Error(`missing keys in identify: ${missing}`))
      )
    );
    this.process.send("identify");
    return await firstValueFrom(identification);
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
    const best = this.process.lines.pipe(
      skipWhile((line) => !line.startsWith("best ")),
      map((line) => line.slice(5)),
      map((move) => [Position.parse(move), move] as const),
      switchMap(([position, move]) =>
        position != null
          ? of(position)
          : throwError(() => Result.UnknownMove(side, move))
      )
    );
    this.process.send(command);
    return firstValueFrom(best);
  }

  quit() {
    this.process.send("quit");
    if (this.process.exitCode != null) this.process.kill();
  }
}

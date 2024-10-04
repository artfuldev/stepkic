import { Duration } from "luxon";

export const Vow = {
  wait: (duration: Duration) =>
    new Promise<void>((resolve) => setTimeout(resolve, duration.toMillis())),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeout:
    (duration: Duration) =>
    (reason: any) =>
    <T>(promise: Promise<T>) =>
      Promise.race([
        Vow.wait(duration).then(() => Promise.reject(reason)),
        promise,
      ]),
};

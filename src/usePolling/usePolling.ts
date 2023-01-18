import { usePollingIf } from "./usePollingIf";
/**
 * Note this does not replace the async function in case of an effect.
 * @param asyncFunction function to call.
 * @param interval milliseconds between calls to the asyncFunction, defaults to a minute
 * @param immediate if true it will run the asyncFunction immediately before looping
 */
export function usePolling<T = unknown>(
  asyncFunction: () => T | PromiseLike<T>,
  interval = 60000,
  immediate = true
): void {
  usePollingIf(() => true, asyncFunction, interval, immediate);
}

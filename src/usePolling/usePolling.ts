import { usePollingIf } from "./usePollingIf";
/**
 * @param asyncFunction
 * @param interval milliseconds between calls to the asyncFunction, defaults to a minute
 * @param immediate if true it will run the asyncFunction immediately before looping
 */
export function usePolling(
  asyncFunction: () => any | PromiseLike<any>,
  interval = 60000,
  immediate = true
) : void {
  usePollingIf(() => true, asyncFunction, interval, immediate);
}

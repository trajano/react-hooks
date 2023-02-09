import { PollingOptions } from "./PollingOptions";
import { usePollingIf } from "./usePollingIf";
const alwaysTrue = () => true;
/**
 * Note this does not replace the async function in case of an effect.
 * @param asyncFunction function to call.
 * @param options extra options for polling
 */
export function usePolling<T = unknown>(
  asyncFunction: () => T | PromiseLike<T>,
  options: Partial<PollingOptions> = {}
): void {
  usePollingIf(alwaysTrue, asyncFunction, options);
}

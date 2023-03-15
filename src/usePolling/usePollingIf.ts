import { useEffect } from "react";
import { defaultPollingOptions } from "./defaultPollingOptions";
import { PollingOptions } from "./PollingOptions";

/**
 * This performs polling while a predicate returns true.
 * @param predicate - an async function that if false will skip the callback, but will still poll.
 * @param asyncFunction - the async function to call.
 * @param options - extra options for polling
 */
export function usePollingIf<T = unknown>(
  predicate: () => boolean | PromiseLike<boolean>,
  asyncFunction: () => T | PromiseLike<T>,
  options: Partial<PollingOptions> = {}
): void {
  const { intervalMs, immediate, onError } = {
    ...defaultPollingOptions,
    ...options,
  };

  useEffect(() => {
    let timeoutID: ReturnType<typeof setTimeout>;
    /*
     * Flag to indicate that the async function is still actively running.  If it is actively running it skips
     * execution and delays it until the next tick.
     */
    let active = false;
    /*
     * Flag to indicate that the cleanup was invoked so no more executions should be performed.
     */
    let cleanupCalled = false;
    // the function is built here rather than on the top level so the timeout variable is managed within this function.
    async function wrappedAsyncFunction(): Promise<void> {
      if (!active && !cleanupCalled) {
        active = true;
        if (await predicate()) {
          try {
            await asyncFunction();
          } catch (e) {
            onError(e);
          }
        }
        active = false;
      }
      if (!cleanupCalled) {
        timeoutID = setTimeout(wrappedAsyncFunction, active ? 0 : intervalMs);
      }
    }

    timeoutID = setTimeout(wrappedAsyncFunction, immediate ? 0 : intervalMs);
    return () => {
      clearTimeout(timeoutID);
      cleanupCalled = true;
    };
  }, [immediate, intervalMs, asyncFunction, onError, predicate]);
}

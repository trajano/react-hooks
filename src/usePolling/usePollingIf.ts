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
  const { intervalMs, immediate, maxIntervalMs, onError } = {
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
    // the function is built here rather than on the top level so the timeout variable is managed within this function.
    async function wrappedAsyncFunction(): Promise<void> {
      if (!active) {
        active = true;
        if (await predicate()) {
          try {
            console.log(`fire on ${timeoutID} inside ${active}`);
            await asyncFunction();
          } catch (e) {
            onError(e);
          }
        }
        active = false;
      }
      timeoutID = setTimeout(wrappedAsyncFunction, active ? 0 : intervalMs);
      console.log(`set ${timeoutID} inside ${active}`);
    }

    timeoutID = setTimeout(wrappedAsyncFunction, immediate ? 0 : intervalMs);
    console.log(`set ${timeoutID}`);
    return () => {
      console.log(`clear ${timeoutID}`);
      clearTimeout(timeoutID);
    };
  }, [immediate, intervalMs]);
}

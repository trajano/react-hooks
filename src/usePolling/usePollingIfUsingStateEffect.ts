import { noop } from "lodash";
import { useCallback, useEffect, useReducer, useState } from "react";
import { defaultPollingOptions } from "./defaultPollingOptions";
import { PollingOptions } from "./PollingOptions";
export const timeToNextCheck = (nextFire: number, maxIntervalMs: number) =>
  Math.max(0, Math.min(nextFire - Date.now(), maxIntervalMs));

/**
 * This is a different variant of usePollingIf that leverages the useEffect and useState of React.  Using this style removes the need for a function that setTimeout that would called by setTimeout requiring a ref to manage rather than a local variable.
 * @param predicate an async function that if false will skip the callback, but will still poll.
 * @param asyncFunction the async function to call.  This is part of the dependency and will update the wrapped callback as needed.
 * @param options extra options for polling
 *
 */
export function usePollingIfUsingStateEffect<T = unknown>(
  predicate: () => boolean | PromiseLike<boolean>,
  asyncFunction: () => T | PromiseLike<T>,
  options: Partial<PollingOptions> = {}
): void {
  const { intervalMs, immediate, maxIntervalMs, onError } = {
    ...defaultPollingOptions,
    ...options,
  };
  const [lastCheck, updateLastCheck] = useReducer(() => Date.now(), Date.now());
  const [nextFire, setNextCheck] = useState(
    immediate ? lastCheck : lastCheck + intervalMs
  );
  const wrappedAsyncFunction = useCallback(async (): Promise<void> => {
    if (await predicate()) {
      await asyncFunction();
    }
    updateLastCheck();
  }, [predicate, asyncFunction]);
  useEffect(() => {
    if (nextFire <= lastCheck) {
      wrappedAsyncFunction()
        .then(() => {
          setNextCheck(Date.now() + intervalMs);
          updateLastCheck();
        })
        .catch(onError);
      return noop;
    } else {
      const timeoutID = setTimeout(
        updateLastCheck,
        timeToNextCheck(nextFire, maxIntervalMs)
      );
      return () => {
        clearTimeout(timeoutID);
      };
    }
  }, [
    lastCheck,
    nextFire,
    intervalMs,
    maxIntervalMs,
    wrappedAsyncFunction,
    onError,
  ]);
}

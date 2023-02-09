import { noop } from "lodash";
import { useCallback, useEffect, useReducer, useState } from "react";
export interface PollingOptions {
  /**
   * milliseconds between calls to the asyncFunction, defaults to a minute.
   */
  intervalMs: number;
  /**
   * milliseconds between polling checks.  This is the maximum time the setTimeout would be set to.
   */
  maxIntervalMs: number;
  /**
   * if true it will run the asyncFunction immediately before looping.
   */
  immediate: boolean;
  /**
   * The error handler.  Defults to console.error
   */
  onError: (err: unknown) => void;
}
export const timeToNextCheck = (nextFire: number, maxIntervalMs: number) =>
  Math.max(0, Math.min(nextFire - Date.now(), maxIntervalMs));

const defaultOptions: PollingOptions = {
  intervalMs: 60000,
  maxIntervalMs: 60000,
  immediate: true,
  onError: console.error,
};
/**
 * This is a different variant of usePollingIf that leverages the useEffect and useState of React.
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
    ...defaultOptions,
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

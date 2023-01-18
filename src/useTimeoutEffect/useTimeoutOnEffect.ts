import { DependencyList, useEffect, useRef } from "react";

/**
 * This performs an operation where the timeout occurs at a given time, but limits the timeout so it
 * is recreated every specified interval.  On Android there is a limit of setTimeout to 60 seconds
 * which is the reason for this hook
 *
 * This hook wraps `setTimeout` to trigger an effect of invoking the callback function when the timeout hits.
 * This will clear the timeout if the component containing the hook is unmounted.  Unlike `setTimeout` this
 * does not support call back functions that accept arguments.  This is due to the need to pass the
 * useEffect dependency list.
 * @param callback callback
 * @param on when the timeout should fire
 * @param maxIntervalMs maximum amount of time per interval.
 */
export function useTimeoutOnEffect(
  callback: () => void,
  on: Date,
  maxIntervalMs: number,
  deps: DependencyList = []
): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    function doSetTimeout() {
      const timeRemaining = Math.max(0, on.getTime() - Date.now());
      if (timeRemaining > maxIntervalMs) {
        timeoutRef.current = setTimeout(doSetTimeout, maxIntervalMs);
      } else {
        timeoutRef.current = setTimeout(callback, timeRemaining);
      }
    }
    doSetTimeout();
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = undefined;
    };
  }, [maxIntervalMs, on, callback, ...deps]);
  /* eslint-enable react-hooks/exhaustive-deps */
}

/**
 * This performs an operation where the timeout occurs at a given time, but limits the timeout so it
 * is recreated every minute.  This is a convenience hook so `60000` need not be passed.
 *
 * This hook wraps `setTimeout` to trigger an effect of invoking the callback function when the timeout hits.
 * This will clear the timeout if the component containing the hook is unmounted.  Unlike `setTimeout` this
 * does not support call back functions that accept arguments.  This is due to the need to pass the
 * useEffect dependency list.
 * @param callback callback
 * @param on when the timeout should fire
 */
export function useTimeoutOnWithMinuteIntervalEffect(
  callback: () => void,
  on: Date,
  deps: DependencyList
): void {
  return useTimeoutOnEffect(callback, on, 60000, deps);
}

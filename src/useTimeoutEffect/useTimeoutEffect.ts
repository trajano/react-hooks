import { DependencyList, useEffect, useRef } from "react";
/**
 * This hook wraps `setTimeout` to trigger an effect of invoking the callback function when the timeout hits.
 * This will clear the timeout if the component containing the hook is unmounted.  Unlike `setTimeout` this
 * does not support call back functions that accept arguments.  This is due to the need to pass the
 * useEffect dependency list.
 * @param callback callback
 * @param ms time before callback fires
 */
export function useTimeoutEffect(
  callback: () => void,
  ms: number | undefined,
  deps: DependencyList
): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, ms);
    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, deps);
}

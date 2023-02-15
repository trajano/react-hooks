import { useEffect, useRef } from "react";
/**
 * This hook wraps `setTimeout` to trigger an effect of invoking the callback function when the timeout hits.
 * This will clear the timeout if the component containing the hook is unmounted.  Unlike `setTimeout` this
 * does not support call back functions that accept arguments.  This is due to the need to pass the
 * useEffect dependency list.
 *
 * This should only be used for short timeouts under 60 seconds.  Longer ones should use setTimeoutOn to
 * ensure that the timeout is going to be triggered correctly on Android.
 * @param callback - callback
 * @param ms - time before callback fires
 */
export function useTimeoutEffect(
  callback: () => void,
  ms: number | undefined
): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    timeoutRef.current = setTimeout(callback, ms);
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = undefined;
    };
  }, [callback, ms]);
}

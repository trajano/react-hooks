import { useEffect, useRef } from "react";
/**
 * This hook wraps `setTimeout` to trigger an effect of invoking the callback function when the timeout hits.
 * This will clear the timeout if the component containing the hook is unmounted.
 * @param callback callback
 * @param ms time before callback fires
 * @param args arguments passed to the callback
 */
export function useTimeoutEffect<TArgs extends any[]>(
  callback: (...args: TArgs) => void,
  ms?: number,
  ...args: TArgs
): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, ms, args) as any;
    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, [ms, args]);
}

import { useCallback, useEffect, useRef } from "react";
/**
 * @param asyncFunction
 * @param interval milliseconds between calls to the asyncFunction, defaults to a minute
 * @param immediate if true it will run the asyncFunction immediately before looping
 */
export function usePolling(
  asyncFunction: () => any | PromiseLike<any>,
  interval = 60000,
  immediate = true
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(false);
  const activeRef = useRef(false);

  const wrappedAsyncFunction = useCallback(async () => {
    if (!mountedRef.current || activeRef.current) {
      // don't process if currently active or the component is unmounted
      return;
    }
    activeRef.current = true;
    try {
      await asyncFunction();
    } catch (e) {
      console.error("Error while polling", e);
    }
    timeoutRef.current = setTimeout(wrappedAsyncFunction, interval);
    activeRef.current = false;
  }, [mountedRef.current, activeRef.current, asyncFunction, interval]);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      wrappedAsyncFunction();
    } else {
      timeoutRef.current = setTimeout(wrappedAsyncFunction, interval);
    }
    return () => {
      clearTimeout(timeoutRef.current!);
      mountedRef.current = false;
      activeRef.current = false;
    };
  }, []);

  return { activeRef };
}

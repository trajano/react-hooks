import { useCallback, useEffect, useRef } from "react";
/**
 * @param predicate an async function that if false will skip the callback, but will still poll.
 * @param asyncFunction
 * @param interval milliseconds between calls to the asyncFunction, defaults to a minute
 * @param immediate if true it will run the asyncFunction immediately before looping
 */
export function usePollingIf(
  predicate: () => boolean | PromiseLike<boolean>,
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
    if (await predicate()) {
      activeRef.current = true;
      try {
        await asyncFunction();
      } catch (e) {
        console.error("Error while polling", e);
      }
      activeRef.current = false;
    }
    timeoutRef.current = setTimeout(wrappedAsyncFunction, interval);
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

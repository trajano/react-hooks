import { useCallback, useEffect, useRef } from "react";
import { defaultPollingOptions } from "./defaultPollingOptions";
import { PollingOptions } from "./PollingOptions";

/**
 * This is a different variant of usePollingIf that leverages the useEffect and useState of React.  Using this style removes the need for a function that setTimeout that would called by setTimeout requiring a ref to manage rather than a local variable.
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

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(false);
  const activeRef = useRef(false);

  const wrappedAsyncFunction = useCallback(
    async function wrappedAsyncFunction(): Promise<void> {
      if (!mountedRef.current || activeRef.current) {
        // don't process if currently active or the component is unmounted
        return;
      }
      if (await predicate()) {
        activeRef.current = true;
        try {
          await asyncFunction();
        } catch (e) {
          onError(e);
        } finally {
          activeRef.current = false;
        }
      }
      timeoutRef.current = setTimeout(wrappedAsyncFunction, intervalMs);
    },
    [asyncFunction, intervalMs, predicate]
  );

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      wrappedAsyncFunction();
    } else {
      timeoutRef.current = setTimeout(wrappedAsyncFunction, intervalMs);
    }
    return () => {
      clearTimeout(timeoutRef.current);
      mountedRef.current = false;
      activeRef.current = false;
    };
  }, [immediate, intervalMs, wrappedAsyncFunction]);
}

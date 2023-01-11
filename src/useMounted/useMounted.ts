import { useCallback, useEffect, useRef } from "react";
import type { IsMountedFunction } from "./IsMountedFunction";
/**
 * This hook provides a function that returns whether the component is still mounted.
 * This is useful as a check before calling set state operations which will generates
 * a warning when it is called when the component is unmounted.
 * @returns a function that returns true if the component is still mounted.
 */
export function useMounted(): IsMountedFunction {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return function useMountedEffectCleanup() {
      mountedRef.current = false;
    };
  }, []);
  return useCallback(() => {
    return mountedRef.current;
  }, [mountedRef]);
}

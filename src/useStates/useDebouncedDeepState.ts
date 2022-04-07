import debounce from "lodash.debounce";
import { Dispatch, useCallback } from "react";
import { useDeepState } from "./useDeepState";

/**
 *
 * @param initialValue
 * @param wait
 * @param debounceSettings
 * @returns state, setter
 * @category React State
 */
export function useDebouncedDeepState<S>(
  initialValue: S,
  wait: number,
  debounceSettings?: Parameters<typeof debounce>[2]
): [S, Dispatch<S>] {
  const [state, setState] = useDeepState<S>(initialValue);
  const debouncedSetState = useCallback(
    debounce(setState, wait, debounceSettings),
    [wait, debounceSettings]
  );
  return [state, debouncedSetState];
}

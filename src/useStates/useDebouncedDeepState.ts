import debounce from "lodash/debounce";
import { Dispatch, useEffect } from "react";
import { useDeepState } from "./useDeepState";

/**
 *
 * @param initialValue
 * @param wait
 * @param debounceSettings
 * @returns state, setter
 *
 */
export function useDebouncedDeepState<S>(
  initialValue: S,
  wait: number,
  debounceSettings?: Parameters<typeof debounce>[2]
): [S, Dispatch<S>] {
  const [state, setState] = useDeepState<S>(initialValue);
  const debouncedSetState = debounce(setState, wait, debounceSettings);
  useEffect(() => () => debouncedSetState.cancel(), [debouncedSetState]);
  return [state, debouncedSetState];
}

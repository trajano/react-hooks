import debounce from "lodash/debounce";
import { Dispatch, useEffect } from "react";

import { useDeepState } from "./useDeepState";

/**
 *
 * @param initialValue - initial value
 * @param waitMillis - The number of milliseconds to delay.
 * @param debounceSettings - settings passed to the debounce function
 * @returns state, setter
 *
 */
export function useDebouncedDeepState<S>(
  initialValue: S,
  waitMillis: number,
  debounceSettings?: Parameters<typeof debounce>[2]
): [S, Dispatch<S>] {
  const [state, setState] = useDeepState<S>(initialValue);
  const debouncedSetState = debounce(setState, waitMillis, debounceSettings);
  useEffect(() => () => debouncedSetState.cancel(), [debouncedSetState]);
  return [state, debouncedSetState];
}

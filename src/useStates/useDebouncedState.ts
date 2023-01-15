import debounce from "lodash/debounce";
import { Dispatch, useEffect, useState } from "react";

/**
 * This is a variant of set state that debounces rapid changes to a state.
 * This performs a shallow state check, use {@link useDebouncedDeepState}
 * for a deep comparison.  Internally this uses
 * [lodash debounce](https://lodash.com/docs/#debounce) to perform
 * the debounce operation.
 * @param initialValue initial value
 * @param waitMillis The number of milliseconds to delay.
 * @param debounceSettings debounce settings.
 * @returns state and setter
 *
 */
export function useDebouncedState<S>(
  initialValue: S,
  waitMillis: number,
  debounceSettings?: Parameters<typeof debounce>[2]
): [S, Dispatch<S>] {
  const [state, setState] = useState<S>(initialValue);
  const debouncedSetState = debounce(setState, waitMillis, debounceSettings);
  useEffect(() => () => debouncedSetState.cancel(), [debouncedSetState]);
  return [state, debouncedSetState];
}

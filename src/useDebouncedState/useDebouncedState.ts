import debounce from "lodash.debounce";
import { Dispatch, useCallback, useState } from "react";

/**
 * This is a variant of set state that debounces rapid changes to a state.
 * This perform a shallow state check, use {@link useDebouncedDeepState}
 * for a deep comparison.  Internally this uses lodash debounce to perform
 * the debounce operation.
 * @param initialValue initial value
 * @param wait debounce wait
 * @param debounceSettings debounce settings.
 * @returns state and setter
 */
export function useDebouncedState<S>(
  initialValue: S,
  wait: number,
  debounceSettings?: Parameters<typeof debounce>[2]
): [S, Dispatch<S>] {
  const [state, setState] = useState<S>(initialValue);
  const debouncedSetState = useCallback(
    debounce(setState, wait, debounceSettings),
    [wait, debounceSettings]
  );
  return [state, debouncedSetState];
}

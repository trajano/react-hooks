import debounce from "lodash.debounce";
import { Dispatch, useCallback, useState } from "react";

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

import { DependencyList, EffectCallback, useEffect } from "react";

import { useMounted } from "../useMounted";

/**
 * This starts an async function and executes another function that performs
 * React state changes if the component is still mounted after the `async`
 * operation completes.  This uses {@link useMounted} for handling the
 * mount logic.
 * @param asyncFunction - async function,
 *   it has a copy of the mounted ref so an await chain can be canceled earlier.
 *   this should ideally be wrapped with useCallback to prevent rerenders
 * @param onSuccess - this gets executed after async
 *   function is resolved and the component is still mounted
 *   this should ideally be wrapped with useCallback to prevent rerenders
 * @param deps - dependency list
 */
export function useAsyncSetEffect<T>(
  asyncFunction: () => Promise<T>,
  onSuccess: (asyncResult: T) => void,
  deps: DependencyList = []
): void {
  const isMounted = useMounted();
  // eslint is disabled since the deps are needed in this csae
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect((): ReturnType<EffectCallback> => {
    (async function wrapped() {
      const asyncResult = await asyncFunction();
      if (isMounted()) {
        onSuccess(asyncResult);
      }
    })();
  }, [asyncFunction, isMounted, onSuccess, ...deps]);
  /* eslint-enable react-hooks/exhaustive-deps */
}

import React, { EffectCallback, useEffect } from "react";
import { useMounted } from "../useMounted";

/**
 * This starts an async function and executes another function that performs
 * React state changes if the component is still mounted after the `async`
 * operation completes.  This uses {@link useMounted} for handling the
 * mount logic.
 * @param asyncFunction async function,
 *   it has a copy of the mounted ref so an await chain can be canceled earlier.
 * @param onSuccess this gets executed after async
 *   function is resolved and the component is still mounted
 * @param deps
 */
export function useAsyncSetEffect<T>(
  asyncFunction: () => Promise<T>,
  onSuccess: (asyncResult: T) => void,
  deps: React.DependencyList = []
): void {
  const isMounted = useMounted();
  useEffect(function effect(): ReturnType<EffectCallback> {
    (async function wrapped() {
      const asyncResult = await asyncFunction();
      if (isMounted()) {
        onSuccess(asyncResult);
      }
    })();
  }, deps);
}

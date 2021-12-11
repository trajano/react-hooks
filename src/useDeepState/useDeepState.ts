import { equals } from "ramda";
import { Dispatch, useReducer } from "react";
export function useDeepState<S>(initialState: S | (() => S)): [S, Dispatch<S>] {
  if (typeof initialState === "function") {
    return useReducer(
      (state: S, newState: S) => (equals(state, newState) ? state : newState),
      null as unknown as S,
      initialState as () => S
    );
  } else {
    return useReducer(
      (state: S, newState: S) => (equals(state, newState) ? state : newState),
      initialState
    );
  }
}

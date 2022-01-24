import isEqual from "lodash.isequal";
import { Dispatch, useReducer } from "react";
export function useDeepState<S>(initialState: S | (() => S)): [S, Dispatch<S>] {
  if (typeof initialState === "function") {
    return useReducer(
      (state: S, newState: S) => (isEqual(state, newState) ? state : newState),
      null as unknown as S,
      initialState as () => S
    );
  } else {
    return useReducer(
      (state: S, newState: S) => (isEqual(state, newState) ? state : newState),
      initialState
    );
  }
}

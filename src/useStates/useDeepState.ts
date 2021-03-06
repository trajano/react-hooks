import isEqual from "lodash.isequal";
import { Dispatch, useReducer } from "react";
/**
 * This is similar to the `React.useState` function except it uses
 * [lodash.isEqual](https://lodash.com/docs/4.17.15#isEqual) to perform a
 * deep comparison of the values.
 * @param initialState initial state
 * @returns state, setter
 *
 */
export function useDeepState<S>(initialState: S | (() => S)): [S, Dispatch<S>] {
  function newStateIfNotEqual(state: S, newState: S) : S {
    return isEqual(state, newState) ? state : newState;
  }
  if (typeof initialState === "function") {
    return useReducer(
      newStateIfNotEqual,
      null as unknown as S,
      initialState as () => S
    );
  } else {
    return useReducer(
      newStateIfNotEqual,
      initialState
    );
  }
}

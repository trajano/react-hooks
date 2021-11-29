import { equals } from 'ramda';
import { Dispatch, useReducer } from 'react';
export function useDeepState<S>(initialState: S): [S, Dispatch<S>] {
  return useReducer(
    (state: S, newState: S) => (equals(state, newState) ? state : newState),
    initialState
  );
}

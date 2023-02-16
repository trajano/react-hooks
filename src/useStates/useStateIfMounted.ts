import { Dispatch, useEffect, useRef, useState } from "react";

/**
 * This is a version of useState that will detect if the component is
 * still mounted.  This hides the warning that would normally appear
 * if set state is called when the component is unmounted so it
 * is advised *NOT* to use this unless there's a specific reason
 * such as a an Axios interceptor that may be used to change state
 * when it is unable to refresh an auth token.
 * @param initialState - initisl state
 * @returns state, setter
 *
 */
export function useStateIfMounted<S>(
  initialState: S | (() => S)
): [S, Dispatch<S>] {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return function useMountedEffectCleanup() {
      mountedRef.current = false;
    };
  }, []);
  const [state, setState] = useState(initialState);
  function setStateIfMounted(next: S) {
    if (mountedRef.current) {
      setState(next);
    }
  }
  return [state, setStateIfMounted];
}

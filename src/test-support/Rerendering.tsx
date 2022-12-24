import React, { PropsWithChildren, useEffect, useReducer } from 'react';
import { delay } from "./delay";

/**
 * This is a component that rerenders after a short delay
 */
export function Rerendering({ children }: PropsWithChildren<{}>): JSX.Element {
  const forceUpdate = useReducer((prev: number) => prev + 1, 0)[1] as () => void

  useEffect(() => {
    (async function asyncEffect() {
      await delay(10000);
      forceUpdate();
    })()
  }, [forceUpdate])
  return (<>{children}</>);
}

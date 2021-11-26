import { createContext, PropsWithChildren, useContext, useEffect, useReducer } from "react";
import { delay } from "./delay";

type IRendering = {}
const RenderingContext = createContext<IRendering>({})
/**
 * This is a component that rerenders after a short delay
 */
export function RerenderingProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void

  useEffect(() => {
    (async function asyncEffect() {
      await delay(10000);
      forceUpdate();
    })()
  }, [])
  return (<RenderingContext.Provider value={{}}>{children}</RenderingContext.Provider>);
}
export function useRerendering(): IRendering {
  return useContext(RenderingContext);
}

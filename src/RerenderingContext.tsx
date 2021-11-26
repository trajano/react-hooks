import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { delay } from "./delay";

type IRendering = { value: number }
const RenderingContext = createContext<IRendering>({ value: 0 })
/**
 * This is a component that rerenders after a short delay
 */
export function RerenderingProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  const [value, setValue] = useState(Math.random());

  useEffect(() => {
    (async function asyncEffect() {
      await delay(10000);
      setValue(Math.random());
    })()
  }, [])
  return (<RenderingContext.Provider value={{ value }}>{children}</RenderingContext.Provider>);
}
export function useRerendering(): IRendering {
  return useContext(RenderingContext);
}

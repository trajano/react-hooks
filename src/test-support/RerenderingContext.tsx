import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { delay } from "./delay";

const RenderingContext = createContext<{ calls: number }>({ calls: 0 });
/**
 * This is a component that rerenders after a short delay
 */
export function RerenderingProvider({
  children,
}: PropsWithChildren<{}>): JSX.Element {
  const [calls, forceUpdate] = useReducer((prev: number) => prev + 1, 0);
  useEffect(() => {
    (async function asyncEffect() {
      await delay(10000);
      forceUpdate();
    })();
  }, []);
  const contextValue = useMemo(()=>({calls}),[calls]);
  return (
    <RenderingContext.Provider value={contextValue}>
      {children}
    </RenderingContext.Provider>
  );
}
export function useRerendering(): { calls: number } {
  return useContext(RenderingContext);
}

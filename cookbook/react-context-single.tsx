/**
 * This provides a boiler plate code for a React context in a single file.  Since
 * it is a single file the names are intentionally not prefixed except for the final
 * exports.
 */

import React, { createContext, PropsWithChildren, useContext, useMemo } from "react";

type ProviderProps = PropsWithChildren<{

}>;
interface ContextValue {

}

const defaultContextValue: ContextValue = {

}

const Context = createContext<ContextValue>(defaultContextValue);

export const useXyz = () => useContext(Context);

export const XyzProvider = ({ children }: ProviderProps) => {
  const contextValue = useMemo<ContextValue>(() => ({}), []);
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

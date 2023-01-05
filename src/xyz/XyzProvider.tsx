import { Context } from "./context";
import { XyzProviderProps } from "./XyzProviderProps";
import React, { useMemo } from "react";
import { XyzContext } from "./XyzContext";

/**
 * Provides the context to the React application.
 * @param props provider initalization props
 * @return context provider.
 *
 */
export function XyzProvider({ children, initializationProp: _initializationProp }: XyzProviderProps): JSX.Element {
  /**
   * Context value. Memoized.
   */
  const contextValue = useMemo<XyzContext>(() => ({}), []);
  return (
    <Context.Provider value={contextValue}>{children}</Context.Provider>
  );
}

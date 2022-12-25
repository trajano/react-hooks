import { XyzContext } from "./XyzContext";
import { XyzProviderProps } from "./XyzProviderProps";
import React, { useMemo } from "react";
import { IXyzContext } from "./IXyzContext";

/**
 * Provides the context to the React application.
 * @param props provider initalization props
 * @return context provider.
 *
 */
export function XyzProvider({ children }: XyzProviderProps): JSX.Element {
  /**
   * Context value. Memoized.
   */
  const contextValue = useMemo<IXyzContext>(() => ({}), []);
  return (
    <XyzContext.Provider value={contextValue}>{children}</XyzContext.Provider>
  );
}

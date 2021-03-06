import { XyzContext } from "./XyzContext";
import { XyzProviderProps } from "./XyzProviderProps";
import React from 'react';

/**
 * Provides the context to the React application.
 * @param props provider initalization props
 * @return context provider.
 *
 */
export function XyzProvider({
  children,
}: XyzProviderProps): JSX.Element {

  return (
    <XyzContext.Provider
      value={{
      }}
    >
      {children}
    </XyzContext.Provider>
  );
}

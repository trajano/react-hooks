import React from 'react';
import { XyzContext } from "./XyzContext";
import { XyzProviderProps } from "./XyzProviderProps";

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

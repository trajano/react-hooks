# Wrapping third-party library lifecycles with React contexts.

This is a general pattern when doing third party libraries. The following files will be created where `xyz` is the name of the third-party library. You can combine all files into one, but the separation is shown here to reduce individual source code file sizes and to allow `export *`. The feature is packaged into a single folder since you should be doing _package by feature_ rather than _package by type_. I also use named functions rather than anonymous arrow functions in order to make debugging easier.

- xyz/index.ts
- xyz/IXyzContext.ts
- xyz/default.ts
- xyz/XyzProviderProps.ts
- xyz/XyzProvider.ts
- xyz/XyzContext.ts
- xyz/useXyz.ts

## xyz/IXyzContext.ts

`interface` instead of `type`, this is because a context value is not just a set of values but also functions, so `interface` is a more natural use of it.

```ts
import { Xyz, XyzProperties, XyzTransaction } from "xyz";

export interface IXyzContext {
  // you can provide access to the third party objects here, the following are examples:
  //
  /**
   * This is a value in the context.  This should not be modified by children as such it should be marked as readonly.
   */
  readonly xyzInstance: Xyz;

  /**
   * Make sure you document.
   */
  readonly xyzProperties: XyzProperties;

  /**
   * Make sure you document.
   */
  doSomething(): void;

  /**
   * Make sure you document.
   * @param name some name
   * @return transaction
   */
  startTransaction(name: string): XyzTransaction;
}
```

## xyz/default.ts

This provides default values for the context. In most Javascript examples of hooks, they use `undefined` that is bad practice as you'd have to handle the undefined state. Instead it is best to provide _null objects_ (note that's different from `null`, but may be `null` at this point if there's no other choice. This file will not be part of the final export.

```ts
import type { IXyzContext } from "./IXyzContext";
export default <IXyzContext>{
  // in this case I did the bad practice of using `null` for example purpose
  xyz: null as Xyz,

  // in this case I know that the type I am passing in is going to be a hash with some specific keys so I put in some place holder values.  This will prevent having to do null checks on consumers.
  xyzProperties: {
    version: "",
    name: "",
  },

  // in this case the method would return void, so just use noop ideally use library equivalent to silence linters like `ramda.always`
  doSomething: () => {},
  // in this case the method would need to return something so, so just use `null` as the return value.
  startTransaction: () => null,
};
```

## xyz/XyzProviderProps.ts

This provides the props used to initialize the provider. This is expected to be a `type` as it's going to be a fixed set of values.

```ts
import type { PropsWithChildren } from "react";
export type XyzProviderProps = PropsWithChildren<{
  /**
   * Don't forget to document this.
   */
  someProp: boolean;
}>;
```

## xyz/XyzContext.ts

This creates the context.

```ts
import { createContext } from "react";
import defaultXyzContext from "./default";
import type { IXyzContext } from "./IXyzContext";

export const XyzContext = createContext<IXyzContext>(defaultXyzContext);
```

## xyz/XyzProvider.tsx

This provides the context and will contain the lifecycle management for the third party module. The magic happens in this module.

```tsx
import { useEffect } from "react";
import { XyzContext } from "./XyzContext";
import { XyzProviderProps } from "./XyzProviderProps";
import { xyz, Xyz } from "xyz";

export function XyzProvider({
  someProp,
  children,
}: XyzProviderProps): JSX.Element {
  const xyzInstanceRef = useRef<Xyz>();

  useEffect(function effectFunction() {
    xyzInstanceRef.current = xyz.init({ someProp });

    return function cleanupXyz() {
      xyzInstanceRef.current.cleanup();
    };
  }, []);

  return (
    <XyzContext.Provider
      value={{
        xyzInstance: xyzInstanceRef.current,
        xyzProperties: xyzInstanceRef.current.properties,
        doSomething: xyzInstanceRef.current.doSomething,
        startTransaction: xyzInstanceRef.current.startTransaction,
      }}
    >
      {children}
    </XyzContext.Provider>
  );
}
```

## xyz/useXyz.ts

This exposes a hook function that can be called to get the context.

```ts
import { useContext } from "react";
import { XyzContext } from "./XyzContext";
import type { IXyzContext } from "./IXyzContext";

export function useXyz(): IXyzContext {
  return useContext(XyzContext);
}
```

## xyz/index.ts

This module ties everything together and exports the needed parts at once. Note the internals such as the interface and the actual context is not exported because the expectation is that a cleaner exposed API is used.

```ts
export type { XyzProviderProps } from "./XyzProviderProps";
export type { IXyzContext as XyzContext } from "./IXyzContext";
export * from "./XyzProvider";
export * from "./useXyz";
```

import { useContext } from "react";
import { XyzContext } from "./XyzContext";
import type { IXyzContext } from "./IXyzContext";

/**
 * Provides the interface to work with the Xyz context.
 * @returns interface to work with Xyz context
 * @category Context
 */
export function useXyz(): IXyzContext {
  return useContext(XyzContext);
}

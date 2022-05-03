import { useContext } from "react";
import { XyzContext } from "./XyzContext";
import type { IXyzContext } from "./IXyzContext";

/**
 * Provides the interface to work with the Xyz context.
 * @returns interface to work with Xyz context
 *
 */
export function useXyz(): IXyzContext {
  return useContext(XyzContext);
}

import { useContext } from "react";
import { Context } from "./context";
import type { XyzContext } from "./XyzContext";

/**
 * Provides the interface to work with the Xyz context.
 * @returns interface to work with Xyz context
 *
 */
export function useXyz(): XyzContext {
  return useContext(Context);
}

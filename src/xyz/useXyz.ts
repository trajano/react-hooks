import { useContext } from "react";
import { XyzContext } from "./XyzContext";
import type { IXyzContext } from "./IXyzContext";

export function useXyz(): IXyzContext {
  return useContext(XyzContext);
}

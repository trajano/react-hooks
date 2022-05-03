import { createContext } from "react";
import defaultXyzContext from "./default";
import type { IXyzContext } from "./IXyzContext";

/**
 * The Xyz context.  It is initially set with reasonable defaults to avoid the need for null checks.
 * @category Context
 */
export const XyzContext = createContext<IXyzContext>(defaultXyzContext);

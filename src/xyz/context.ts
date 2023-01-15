/**
 * This is where the context is defined.  It is called `Context` internally.
 * @module
 *
 */
import { createContext } from "react";

import defaultContext from "./default";
import type { XyzContext } from "./XyzContext";

/**
 * The Xyz context.  It is initially set with reasonable defaults to avoid the need for null checks.
 *
 */
export const Context = createContext<XyzContext>(defaultContext);

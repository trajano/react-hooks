import { createContext } from "react";
import defaultXyzContext from "./default";
import type { IXyzContext } from "./IXyzContext";

export const XyzContext = createContext<IXyzContext>(defaultXyzContext);

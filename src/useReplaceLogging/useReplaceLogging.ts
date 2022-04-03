import { useEffect, useRef } from "react";

type LoggingReplacements = {
  debug?: typeof console["debug"];
  error?: typeof console["error"];
  info?: typeof console["info"];
  log?: typeof console["log"];
  warn?: typeof console["warn"];
};
/**
 * This replaces console.XXX loggers with custom implementations.  It will restore console log on unmount of the component.
 * @param replacements a map of replacement loggers.  They're all optional and only the functions defined will be replaced.
 */
export function useReplaceLogging({
  debug,
  error,
  info,
  log,
  warn,
}: LoggingReplacements): void {
  const originalConsoleDebug = useRef(console.debug);
  const originalConsoleError = useRef(console.error);
  const originalConsoleInfo = useRef(console.info);
  const originalConsoleLog = useRef(console.log);
  const originalConsoleWarn = useRef(console.warn);
  useEffect(() => {
    if (debug) {
      console.debug = debug;
    }
    if (error) {
      console.error = error;
    }
    if (info) {
      console.info = info;
    }
    if (log) {
      console.log = log;
    }
    if (warn) {
      console.warn = warn;
    }
    return function restoreConsoleLog() {
      console.debug = originalConsoleDebug.current;
      console.error = originalConsoleError.current;
      console.info = originalConsoleInfo.current;
      console.log = originalConsoleLog.current;
      console.warn = originalConsoleWarn.current;
    };
  }, []);
}

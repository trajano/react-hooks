import { useEffect } from "react";
import { LoggingReplacements } from "./LoggingReplacements";

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
  useEffect(() => {
    const originalConsoleDebug = console.debug;
    const originalConsoleError = console.error;
    const originalConsoleInfo = console.info;
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
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
      console.debug = originalConsoleDebug;
      console.error = originalConsoleError;
      console.info = originalConsoleInfo;
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
    };
  }, [debug, error, info, log, warn]);
}

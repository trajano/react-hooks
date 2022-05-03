/**
 * Replacements.
 * @internal
 */
export type LoggingReplacements = {
  debug?: typeof console["debug"];
  error?: typeof console["error"];
  info?: typeof console["info"];
  log?: typeof console["log"];
  warn?: typeof console["warn"];
};

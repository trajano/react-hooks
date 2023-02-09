export interface PollingOptions {
  /**
   * milliseconds between calls to the asyncFunction, defaults to a minute.
   */
  intervalMs: number;
  /**
   * milliseconds between polling checks.  This is the maximum time the setTimeout would be set to.
   */
  maxIntervalMs: number;
  /**
   * if true it will run the asyncFunction immediately before looping.
   */
  immediate: boolean;
  /**
   * The error handler.  Defults to console.error
   */
  onError: (err: unknown) => void;
}

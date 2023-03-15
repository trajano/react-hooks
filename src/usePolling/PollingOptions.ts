export interface PollingOptions {
  /**
   * milliseconds between calls to the asyncFunction, defaults to a minute.
   */
  intervalMs: number;
  /**
   * if true it will run the asyncFunction immediately before looping.  Defaults to true.
   */
  immediate: boolean;
  /**
   * The error handler.  Defaults to console.error
   */
  onError: (err: unknown) => void;
}

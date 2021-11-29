export interface SubscriptionManager<T = any> {
  /**
   *
   * @param fn function to call when notified.  It can be passed some data
   * @returns unsubscribe callback.
   */
  subscribe(fn: (data: T) => void): () => void;
  /**
   * Notify subscribers
   * @param data optionally pass data to the subscribers.
   */
  notify(data?: T): void;
}

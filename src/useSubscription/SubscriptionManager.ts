/**
 * @typeparam T data that will be passed to the function when notified
 */
export interface SubscriptionManager<T = unknown> {
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

  /**
   * a hook that subscribes from the current subscription.
   * @param fn callback
   */
  useSubscribeEffect(fn: (data: T) => void): void;
}

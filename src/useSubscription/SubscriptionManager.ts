/**
 * @typeparam T - data that will be passed to the function when notified
 */
export interface SubscriptionManager<T = unknown> {
  /**
   *
   * @param callback - function to call when notified.  It can be passed some data
   * @returns unsubscribe callback.
   */
  subscribe(callback: (data: T) => void): () => void;
  /**
   * Notify subscribers.
   * @param data - optionally pass data to the subscribers.
   */
  notify(data?: T): void;

  /**
   * a hook that subscribes from the current subscription.
   * @param callback - callback
   */
  useSubscribeEffect(callback: (data: T) => void): void;
}

import { useRef } from "react";
import { SubscriptionManager } from "./SubscriptionManager";
/**
 * This hook provides a simple subscription semantic to React components.
 */
export function useSubscription<T = any>(): SubscriptionManager<T> {
  const subscribersRef = useRef<((data: T) => void)[]>([]);
  function subscribe(fn: (data: T) => void) {
    subscribersRef.current.push(fn);
    return () => {
      subscribersRef.current = subscribersRef.current.filter(
        (subscription) => !Object.is(subscription, fn)
      );
    };
  }
  function notify(data: T) {
    subscribersRef.current.forEach((fn) => fn(data));
  }
  return { subscribe, notify };
}

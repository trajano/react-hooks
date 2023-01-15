import { useEffect, useRef } from "react";

import type { SubscriptionManager } from "./SubscriptionManager";
/**
 * This hook provides a simple subscription semantic to React components.
 */
export function useSubscription<T = unknown>(): SubscriptionManager<T> {
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
  function useSubscribeEffect(fn: (data: T) => void) {
    useEffect(() => subscribe(fn), [fn]);
  }
  return { subscribe, notify, useSubscribeEffect };
}

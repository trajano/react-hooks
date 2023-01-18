import { useCallback } from "react";
import { SubscriptionManager, useSubscription } from "../useSubscription";
import { usePollingIf } from "./usePollingIf";

/**
 * This is a conditional polling hook that allows a subscription that gets called when the poll completes.
 *
 */
export function useNotifiedPollingIf<T = unknown>(
  predicate: () => boolean | PromiseLike<boolean>,
  asyncFunction: () => T | PromiseLike<T>,
  interval = 60000,
  immediate = true
): SubscriptionManager<T> {
  const { subscribe, notify, useSubscribeEffect } = useSubscription<T>();
  const notifyingAsyncFunction = useCallback(async () => {
    notify(await asyncFunction());
  }, [notify, asyncFunction]);
  usePollingIf(predicate, notifyingAsyncFunction, interval, immediate);

  return { subscribe, notify, useSubscribeEffect };
}

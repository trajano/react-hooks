import { usePollingIf } from "./usePollingIf";
import { SubscriptionManager, useSubscription } from "../useSubscription";

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
  usePollingIf(
    predicate,
    async () => {
      notify(await asyncFunction());
    },
    interval,
    immediate
  );

  return { subscribe, notify, useSubscribeEffect };
}

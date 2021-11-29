import { usePollingIf } from ".";
import { SubscriptionManager, useSubscription } from "../useSubscription";

/**
 * This is a conditional polling hook that allows a subscription that gets called when the poll completes.
 */
export function useNotifiedPollingIf<T = any>(
  predicate: () => boolean | PromiseLike<boolean>,
  asyncFunction: () => T | PromiseLike<T>,
  interval = 60000,
  immediate = true
): Pick<SubscriptionManager<T>, "subscribe"> {
  const { subscribe, notify } = useSubscription();
  usePollingIf(
    predicate,
    async () => {
      notify(await asyncFunction());
    },
    interval,
    immediate
  );

  return { subscribe };
}

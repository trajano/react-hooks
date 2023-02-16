import { useCallback, useEffect, useRef } from "react";

import { SubscriptionManager, useSubscription } from "../useSubscription";

/**
 * time to next full minute from the date
 * @param millisSinceEpoch - millis since epoch time.
 * @returns milliseconds to next full minute from date
 */
function timeToNextFullMinute(millisSinceEpoch: number): number {
  return 60000 - (millisSinceEpoch % 60000);
}
/**
 * This hook notifies the subscribers with the current date.  This
 * is useful for updating components that show moment in time without
 * a full rerender of the tree.
 *
 * It notifies at the following points:
 * - useEffect
 * - first minute at zero seconds
 * - every minute after at zero seconds
 *
 * However, due to the performance of the device, this may not be acurate.
 *
 * @returns subscription manager
 */
export function useClock(): SubscriptionManager<number> {
  const { subscribe, notify, useSubscribeEffect } = useSubscription<number>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const doNotify = useCallback(
    function doNotify() {
      notify(Date.now());
      timeoutRef.current = setTimeout(
        doNotify,
        timeToNextFullMinute(Date.now())
      );
    },
    [notify]
  );
  useEffect(() => {
    doNotify();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [doNotify]);

  return { subscribe, notify, useSubscribeEffect };
}

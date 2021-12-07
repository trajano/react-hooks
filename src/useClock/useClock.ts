import { useEffect, useRef } from "react";
import { useSubscription, SubscriptionManager } from "../useSubscription";

/**
 * time to next full minute from the date
 * @param date
 * @returns milliseconds to next full minute from date
 */
function timeToNextFullMinute(date: number): number {
  return 60000 - (date % 60000);
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

  function doNotify() {
    notify(Date.now());
    timeoutRef.current = setTimeout(doNotify, timeToNextFullMinute(Date.now()));
  }
  useEffect(() => {
    doNotify();
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clearTimeout(timeoutRef.current!);
    };
  }, []);

  return { subscribe, notify, useSubscribeEffect };
}

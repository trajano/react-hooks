import noop from "lodash/noop";
import { Dispatch, useState } from "react";

/**
 * This is like `useState<boolean>` but provides explicit methods to set the value.  This either sets it to
 * true or the initial state.  If the intial state is true then this will always be true.
 * @returns an array containing the signal value, a setter callback and a reset back to initial value callback
 */
export const useSignal = (
  initial: boolean = false,
  signalCallback: Dispatch<boolean> = noop,
  resetCallback: Dispatch<boolean> = noop
): [boolean, () => void, () => void] => {
  const [signal, setSignal] = useState(initial);

  return [
    signal,
    () => {
      signalCallback(signal);
      setSignal(true);
    },
    () => {
      resetCallback(signal);
      setSignal(initial);
    },
  ];
};

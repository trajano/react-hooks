import { useState } from "react";

/**
 * This is like `useState<boolean>` but provides explicit methods to set the value.
 * @returns an array containing the signal value, a setter callback and a reset callback
 */
export const useSignal = (
  initial: boolean = false
): [boolean, () => void, () => void] => {
  const [signal, setSignal] = useState(initial);

  return [signal, () => setSignal(true), () => setSignal(false)];
};

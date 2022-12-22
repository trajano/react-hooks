import { Dispatch, useReducer } from "react";
function dateReduction(prev: Date, next: Date | number): Date {
  let nextDateTime: number;
  let nextDate: Date;
  if (typeof next === "number") {
    nextDateTime = next;
    nextDate = new Date(next);
  } else {
    nextDateTime = next.getTime();
    nextDate = next;
  }
  if (prev.getTime() === nextDateTime) {
    return prev;
  } else {
    return nextDate;
  }
}

/**
 * This simulates the logic of useState but the input is a Date or a number representing the instant.
 * It will always provide a Date and may NOT be null.  However, the initial state if it is a function must
 * be return a Date.
 *
 * Since null is not a supported value, designate a constant like `Date(0)` to represent an undefined state.
 */
export function useDateState(
  initialState: Date | number | (() => Date)
): [Date, Dispatch<Date | number>] {
  let theInitialState: Date;
  if (typeof initialState === "number") {
    theInitialState = new Date(initialState);
  } else if (typeof initialState === "function") {
    theInitialState = null as unknown as Date;
  } else {
    theInitialState = initialState;
  }
  const initialStateIsFunction = typeof initialState === "function";

  return useReducer(
    dateReduction,
    initialStateIsFunction ? (null as unknown as Date) : theInitialState,
    initialStateIsFunction
      ? (initialState as () => Date)
      : (undefined as unknown as () => Date)
  );
}

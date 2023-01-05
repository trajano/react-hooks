/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import {
  useTimeoutEffect
} from "./useTimeoutEffect";
describe("useTimeoutEffect", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("one second", () => {
    const timeoutCallback = jest.fn();

    renderHook(() => useTimeoutEffect(timeoutCallback, 1000));
    expect(timeoutCallback).toBeCalledTimes(0)
    jest.advanceTimersByTime(999);
    expect(timeoutCallback).toBeCalledTimes(0)
    jest.advanceTimersByTime(1);
    expect(timeoutCallback).toBeCalledTimes(1)
  });
});

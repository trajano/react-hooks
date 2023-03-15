/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";

import { usePollingIf } from "./usePollingIf";

describe("usePollingIf hook test", () => {

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  it("should work with just the callback", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve());
    const { unmount } = renderHook(() =>
      usePollingIf(predicate, func1, { intervalMs: 300, immediate: false }), {});
    const start = Date.now();
    expect(func1).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(299);
    expect(func1).toHaveBeenCalledTimes(0);
    await act(async () => jest.advanceTimersByTime(1));
    expect(func1).toHaveBeenCalledTimes(1);
    expect(Date.now() - start).toBe(300);
    await act(async () => jest.advanceTimersByTime(300));
    expect(func1).toHaveBeenCalledTimes(2);
    expect(Date.now() - start).toBe(600);
    unmount();
    await act(async () => jest.advanceTimersByTime(300));
    expect(func1).toHaveBeenCalledTimes(2);
    expect(Date.now() - start).toBe(900);
  });

  it("should work with just the callback and immediate", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve());
    renderHook(() =>
      usePollingIf(predicate, func1, { intervalMs: 300, immediate: true }), {});
    expect(jest.getTimerCount()).toBe(1);
    const start = Date.now();
    // advance to next tick
    await act(async () => jest.advanceTimersToNextTimer());
    expect(func1).toHaveBeenCalledTimes(1);
    expect(Date.now() - start).toBe(0);
    jest.advanceTimersByTime(299);
    expect(func1).toHaveBeenCalledTimes(1);
    await act(async () => { jest.advanceTimersByTime(1); });
    expect(Date.now() - start).toBe(300);
    expect(func1).toHaveBeenCalledTimes(2);
  });

  it("should handle long running functions", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    const { unmount } = renderHook(() =>
      usePollingIf(predicate, func1, { intervalMs: 300, immediate: true }), {});
    expect(jest.getTimerCount()).toBe(1);
    const start = Date.now();
    // advance to next tick
    await act(async () => jest.advanceTimersToNextTimer());
    expect(func1).toHaveBeenCalledTimes(1);
    expect(Date.now() - start).toBe(0);
    jest.advanceTimersByTime(299);
    expect(func1).toHaveBeenCalledTimes(1);
    await act(async () => { jest.advanceTimersByTime(1); });
    expect(Date.now() - start).toBe(300);
    // still 1 at this point because it hasn't finished
    expect(func1).toHaveBeenCalledTimes(1);

    await act(async () => { jest.advanceTimersByTime(699); });
    expect(Date.now() - start).toBe(999);
    // still 1 at this point because it hasn't finished
    expect(func1).toHaveBeenCalledTimes(1);

    await act(async () => { jest.advanceTimersByTime(1); });
    expect(Date.now() - start).toBe(1000);
    // still 1 at this point because it just finished but the timer has to advance to next tick.
    expect(func1).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersToNextTimer());
    expect(Date.now() - start).toBe(1300);
    expect(func1).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersToNextTimer());
    expect(Date.now() - start).toBe(2300);
    expect(func1).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersToNextTimer());
    expect(Date.now() - start).toBe(2600);
    expect(func1).toHaveBeenCalledTimes(3);

    await act(async () => jest.advanceTimersToNextTimer());
    expect(Date.now() - start).toBe(3600);
    expect(func1).toHaveBeenCalledTimes(3);

    await act(async () => jest.advanceTimersToNextTimer());
    expect(Date.now() - start).toBe(3900);
    expect(func1).toHaveBeenCalledTimes(4);

    unmount();

    expect(func1).toHaveBeenCalledTimes(4);
    // it has to finish up the delay timer in the func1.
    expect(jest.getTimerCount()).toBe(1);
    await act(async () => jest.advanceTimersToNextTimer());
    // there should be no longer be any more calls
    expect(func1).toHaveBeenCalledTimes(4);
    expect(jest.getTimerCount()).toBe(0);
  });

  it("should cancel the current timeout when handle changing functions", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve());
    const func2 = jest.fn(() => Promise.resolve());
    const startInstant = Date.now();
    const { rerender, unmount } = renderHook(({ func }) =>
      usePollingIf(predicate, func, { intervalMs: 300, immediate: true }), { initialProps: { func: func1 } });
    await act(() => Promise.resolve());
    // Should be zero because immediate is still async.
    expect(func1).toHaveBeenCalledTimes(0);

    // advance to next tick
    await act(async () => jest.advanceTimersToNextTimer());
    expect(func1).toHaveBeenCalledTimes(1);
    expect(Date.now()).toEqual(startInstant);

    await act(async () => jest.advanceTimersByTime(300));
    expect(func1).toHaveBeenCalledTimes(2);
    expect(Date.now()).toEqual(startInstant + 300);

    // advance by 200 then change functions
    jest.advanceTimersByTime(200);
    rerender({ func: func2 });
    await act(() => Promise.resolve());
    expect(func1).toHaveBeenCalledTimes(2);
    expect(func2).toHaveBeenCalledTimes(0);
    expect(jest.getTimerCount()).toBe(1);
    // move to next interval
    await act(async () => jest.advanceTimersByTime(100));
    expect(func2).toHaveBeenCalledTimes(1);
    expect(func1).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(300));
    expect(func1).toHaveBeenCalledTimes(2);
    expect(func2).toHaveBeenCalledTimes(2);

    unmount();

    expect(func1).toHaveBeenCalledTimes(2);
    expect(func2).toHaveBeenCalledTimes(2);
  });
});

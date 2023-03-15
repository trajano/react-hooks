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
    jest.advanceTimersByTime(1);
    await jest.advanceTimersToNextTimer();
    expect(Date.now() - start).toBe(300);
    expect(func1).toHaveBeenCalledTimes(2);
  });

  it("should cancel the current timeout when handle changing functions", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve());
    const func2 = jest.fn(() => Promise.resolve());
    const startInstant = Date.now();
    const { rerender } = renderHook(({ func }) =>
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
    console.log("BEFORE")
    rerender({ func: func2 });
    console.log("AFTER1")
    await act(() => Promise.resolve());
    console.log("AFTER2")
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

  });
});

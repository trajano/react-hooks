/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from "@testing-library/react";

import { usePollingIf } from "./usePollingIf";

describe("usePollingIf hook test", () => {

  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());
  it("should work with just the callback", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve());
    renderHook(() =>
      usePollingIf(predicate, func1, 300, false), {});
    const start = Date.now();
    expect(func1).toBeCalledTimes(0);
    jest.advanceTimersByTime(299);
    expect(func1).toBeCalledTimes(0);
    await act(() => jest.advanceTimersByTime(1));
    expect(func1).toBeCalledTimes(1);
    expect(Date.now() - start).toBe(300);
    await act(() => jest.advanceTimersByTime(300));
    expect(func1).toBeCalledTimes(2);
    expect(Date.now() - start).toBe(600);
  });

  it("should work with just the callback and immediate", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve());
    renderHook(() =>
      usePollingIf(predicate, func1, 300, true), {});
    await act(() => Promise.resolve());
    const start = Date.now();
    expect(func1).toBeCalledTimes(1);
    expect(Date.now() - start).toBe(0);
    jest.advanceTimersByTime(299);
    expect(func1).toBeCalledTimes(1);
    await act(() => jest.advanceTimersByTime(1));
    expect(func1).toBeCalledTimes(2);
    expect(Date.now() - start).toBe(300);
  });


  it("should handle changing functions", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve());
    const func2 = jest.fn(() => Promise.resolve());
    const { rerender } = renderHook(({ func }) =>
      usePollingIf(predicate, func, 300, true), { initialProps: { func: func1 } });
    await act(() => Promise.resolve());
    expect(func1).toBeCalledTimes(1);

    // advance to next tick
    await act(() => jest.advanceTimersByTime(300));
    expect(func1).toBeCalledTimes(2);

    // advance by 200 then change functions
    jest.advanceTimersByTime(200);
    rerender({ func: func2 });
    expect(func1).toBeCalledTimes(2);
    expect(func2).toBeCalledTimes(0);

    // move to next interval
    await act(() => jest.advanceTimersByTime(100));
    expect(func1).toBeCalledTimes(2);
    expect(func2).toBeCalledTimes(1);

    await act(() => jest.advanceTimersByTime(300));
    expect(func1).toBeCalledTimes(2);
    expect(func2).toBeCalledTimes(2);

  });

});

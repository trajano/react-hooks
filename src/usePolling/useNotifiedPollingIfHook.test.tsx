/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";

import { useNotifiedPollingIf } from "./useNotifiedPollingIf";

describe("useNotifiedPollingIf hook tests", () => {

  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it("should handle with one function", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve("one"));
    const notifyMe = jest.fn();

    const { result } = renderHook(({ func }) =>
      useNotifiedPollingIf(predicate, func, 300, true), { initialProps: { func: func1 } });
    result.current.subscribe(notifyMe);
    expect(func1).toHaveBeenCalledTimes(0);
    expect(notifyMe).toHaveBeenCalledTimes(0);
    await act(() => Promise.resolve());
    await act(async () => { jest.advanceTimersToNextTimer(); });
    expect(func1).toHaveBeenCalledTimes(1);
    expect(notifyMe).toHaveBeenCalledTimes(1);
    expect(notifyMe).toHaveBeenLastCalledWith("one");

    // advance to next tick
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(func1).toHaveBeenCalledTimes(2);
    expect(notifyMe).toHaveBeenCalledTimes(2);
    expect(notifyMe).toHaveBeenLastCalledWith("one");

    // advance to next tick
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(func1).toHaveBeenCalledTimes(3);
    expect(notifyMe).toHaveBeenCalledTimes(3);
    expect(notifyMe).toHaveBeenLastCalledWith("one");

  });
  it("should handle changing functions", async () => {
    const predicate = () => Promise.resolve(true);
    const func1 = jest.fn(() => Promise.resolve("one"));
    const func2 = jest.fn(() => Promise.resolve("two"));
    const notifyMe = jest.fn();
    const { result, rerender } = renderHook(({ func }) =>
      useNotifiedPollingIf(predicate, func, 300, true), { initialProps: { func: func1 } });
    result.current.subscribe(notifyMe);
    expect(func1).toHaveBeenCalledTimes(0);
    expect(notifyMe).toHaveBeenCalledTimes(0);
    await act(() => Promise.resolve());
    await act(async () => { jest.advanceTimersToNextTimer(); });
    expect(func1).toHaveBeenCalledTimes(1);
    expect(notifyMe).toHaveBeenCalledTimes(1);
    expect(notifyMe).toHaveBeenLastCalledWith("one");

    // advance to next tick
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(func1).toHaveBeenCalledTimes(2);

    // advance by 200 then change functions
    jest.advanceTimersByTime(200);
    rerender({ func: func2 });
    await act(() => Promise.resolve());
    expect(func1).toHaveBeenCalledTimes(2);
    expect(func2).toHaveBeenCalledTimes(0);
    expect(notifyMe).toHaveBeenCalledTimes(2);
    expect(notifyMe).toHaveBeenLastCalledWith("one");

    // move to next interval
    await act(async () => { jest.advanceTimersByTime(100); });
    expect(func1).toHaveBeenCalledTimes(2);
    expect(func2).toHaveBeenCalledTimes(1);
    expect(notifyMe).toHaveBeenCalledTimes(3);
    expect(notifyMe).toHaveBeenLastCalledWith("two");

    await act(async () => { jest.advanceTimersByTime(300); });
    expect(func1).toHaveBeenCalledTimes(2);
    expect(func2).toHaveBeenCalledTimes(2);
    expect(notifyMe).toHaveBeenCalledTimes(4);
    expect(notifyMe).toHaveBeenLastCalledWith("two");

  });

});

/**
 * @jest-environment jsdom
 */
import { add } from "date-fns";
import { act, render, screen } from "@testing-library/react";
import {
  useTimeoutOnEffect,
  useTimeoutOnWithMinuteIntervalEffect,
} from "./useTimeoutOnEffect";
import React from "react";
describe("useTimeoutOnEffect", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("one second max interval", async () => {
    const timeoutCallback = jest.fn();
    const renderCallback = jest.fn();

    function MyComponent() {
      useTimeoutOnEffect(
        timeoutCallback,
        add(Date.now(), { minutes: 1 }),
        1000,
        []
      );
      renderCallback();
      return <div data-testid="test">foo</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("foo");
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 0:00.500
    await act(() => jest.advanceTimersByTime(500));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 0:01.000
    await act(() => jest.advanceTimersByTime(500));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 0:59.999
    await act(() => jest.advanceTimersByTime(58999));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 1:00.000
    await act(() => jest.advanceTimersByTime(1));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(1);
  });

  it("one minute max interval", async () => {
    const timeoutCallback = jest.fn();
    const renderCallback = jest.fn();

    function MyComponent() {
      useTimeoutOnWithMinuteIntervalEffect(
        timeoutCallback,
        add(Date.now(), { minutes: 5 }),
        []
      );
      renderCallback();
      return <div data-testid="test">foo</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("foo");
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 0:00.500
    await act(() => jest.advanceTimersByTime(500));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 0:01.000
    await act(() => jest.advanceTimersByTime(500));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 0:59.999
    await act(() => jest.advanceTimersByTime(58999));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 1:00.000
    await act(() => jest.advanceTimersByTime(1));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 4:00.000
    await act(() => jest.advanceTimersByTime(3 * 60 * 1000));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 4:59.000
    await act(() => jest.advanceTimersByTime(59 * 1000));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(0);

    // 5:00.000
    await act(() => jest.advanceTimersByTime(1000));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(1);

    // 10:00.000
    await act(() => jest.advanceTimersByTime(10 * 60 * 1000));
    expect(renderCallback).toBeCalledTimes(1);
    expect(timeoutCallback).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});

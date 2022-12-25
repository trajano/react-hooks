/**
 * @jest-environment jsdom
 */
/* eslint-disable jsx-a11y/click-events-have-key-events  */
/* eslint-disable jsx-a11y/no-static-element-interactions  */
import { act, render, screen, waitFor } from "@testing-library/react";
import { parseISO } from "date-fns";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { useClock } from "./useClock";

const renderCallback = jest.fn();

function MyComponent() {
  const { useSubscribeEffect } = useClock();
  const [date, setDate] = useState<number>(Date.now());
  useSubscribeEffect(setDate);
  renderCallback(date);
  return <div data-testid="test">{date}</div>;
}

describe("Clock update", () => {
  it("should work when starting at zero seconds", async () => {
    jest.useFakeTimers().setSystemTime(parseISO("2020-01-01T00:00:00Z"));

    const { unmount } = render(<MyComponent />);
    await waitFor(() => {
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    expect(screen.getByTestId("test").textContent).toEqual(
      new Date("2020-01-01T00:00:00Z").getTime().toString()
    );
    jest.advanceTimersByTime(59999);
    await waitFor(() => {
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    expect(screen.getByTestId("test").textContent).toEqual(
      new Date("2020-01-01T00:00:00Z").getTime().toString()
    );
    act(() => {
      jest.advanceTimersByTime(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("test").textContent).toEqual(
        new Date("2020-01-01T00:01:00Z").getTime().toString()
      );
    });
    // clear off duplicate calls
    renderCallback.mock.calls = renderCallback.mock.calls.reduce(
      (prev, next) =>
        isEqual(prev[prev.length - 1], next) ? prev : [...prev, next],
      []
    );
    expect(renderCallback).toBeCalledTimes(2);
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    renderCallback.mock.calls = renderCallback.mock.calls.reduce(
      (prev, next) =>
        isEqual(prev[prev.length - 1], next) ? prev : [...prev, next],
      []
    );
    await waitFor(() => {
      expect(renderCallback.mock.calls.length).toEqual(3);
    });
    expect(screen.getByTestId("test").textContent).toEqual(
      new Date("2020-01-01T00:02:00Z").getTime().toString()
    );
    unmount();
  });
  it("should work when not starting at zero seconds", async () => {
    jest.useFakeTimers().setSystemTime(parseISO("2020-01-01T00:00:12.878Z"));

    const { unmount } = render(<MyComponent />);
    await waitFor(() => {
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    expect(screen.getByTestId("test").textContent).toEqual(
      new Date("2020-01-01T00:00:12.878Z").getTime().toString()
    );
    jest.advanceTimersByTime(59999 - 12878);
    await waitFor(() => {
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    expect(screen.getByTestId("test").textContent).toEqual(
      new Date("2020-01-01T00:00:12.878Z").getTime().toString()
    );
    act(() => {
      jest.advanceTimersByTime(1);
    });
    await waitFor(() => {
      expect(renderCallback.mock.calls.length >= 2).toBeTruthy();
    });
    renderCallback.mockClear();
    expect(screen.getByTestId("test").textContent).toEqual(
      new Date("2020-01-01T00:01:00Z").getTime().toString()
    );
    act(() => {
      jest.advanceTimersByTime(12878);
    });
    await waitFor(() => {
      expect(screen.getByTestId("test").textContent).toEqual(
        new Date("2020-01-01T00:01:00Z").getTime().toString()
      );
    });
    expect(renderCallback).toBeCalledTimes(0);
    act(() => jest.advanceTimersByTime(60000 - 12878));
    // clear off duplicate calls
    renderCallback.mock.calls = renderCallback.mock.calls.reduce(
      (prev, next) =>
        isEqual(prev[prev.length - 1], next) ? prev : [...prev, next],
      []
    );
    await waitFor(() => {
      expect(renderCallback).toBeCalledTimes(1);
    });
    expect(screen.getByTestId("test").textContent).toEqual(
      new Date("2020-01-01T00:02:00Z").getTime().toString()
    );
    act(() => {
      jest.advanceTimersByTime(12878);
    });
    await waitFor(() => {
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    expect(screen.getByTestId("test").textContent).toEqual(
      new Date("2020-01-01T00:02:00Z").getTime().toString()
    );
    unmount();
  });
  afterEach(() => {
    jest.useRealTimers().resetAllMocks();
  });
});

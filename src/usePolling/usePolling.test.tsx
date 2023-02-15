/**
 * @jest-environment jsdom
 */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { usePolling } from "./usePolling";

describe("usePolling", () => {
  it("should work with a real clock", async () => {
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePolling(callback, { intervalMs: 100, immediate: true });
      ++renderCount;
      return <div data-testid="test">{renderCount}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(2);
    });
    expect(renderCount).toEqual(1);
    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(3);
    });
    expect(renderCount).toEqual(1);
  });

  it("should work with just the callback", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePolling(callback);
      ++renderCount;
      return <div data-testid="test">{renderCount}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toHaveBeenCalledTimes(2);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("should not start immediately if specified", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePolling(callback, { intervalMs: 1000, immediate: false });
      ++renderCount;
      return <div data-testid="test">{renderCount}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(2);
    });
    expect(renderCount).toEqual(1);
  });
  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });
});

/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { usePollingIf } from "./usePollingIf";

describe("usePollingIf", () => {
  it("should work with a real clock", async () => {
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePollingIf(() => true, callback, { intervalMs: 100, immediate: true });
      ++renderCount;
      return <div data-testid="test">{renderCount}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(1);
    await waitFor(() => {
      expect(callback).toBeCalledTimes(2);
    });
    expect(renderCount).toEqual(1);
    await waitFor(() => {
      expect(callback).toBeCalledTimes(3);
    });
    expect(renderCount).toEqual(1);
    unmount();
  });

  it("should work with just the callback", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePollingIf(() => true, callback);
      ++renderCount;
      return <div data-testid="test">{renderCount}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(2);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(3);
    unmount();
  });

  it("should not start immediately if specified", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePollingIf(() => true, callback, { intervalMs: 1000, immediate: false });
      ++renderCount;
      return <div data-testid="test">{renderCount}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(0);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(2);
    unmount();
  });

  it("should never call callback as predicate is always false", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePollingIf(() => false, callback);
      ++renderCount;
      return <div data-testid="test">{renderCount}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(0);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(0);
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(0);
    unmount();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});

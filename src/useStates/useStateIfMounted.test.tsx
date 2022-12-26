/**
 * @jest-environment jsdom
 */
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import React, { useEffect } from "react";
import { delay } from "../test-support/delay";
import { useStateIfMounted } from "./useStateIfMounted";

describe("useStateIfMounted", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });
  it("should work and not rerender", async () => {
    const renderCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useStateIfMounted("bar");

      useEffect(() => {
        setFoo("BAZ");
      }, [setFoo]);
      renderCallback();
      return (
        <div className="shouldNotRerender" data-testid="test">
          {foo}
        </div>
      );
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("BAZ");
    await waitFor(() => {
      // React DOM does extra rendering that is outside our control
      expect(renderCallback.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
    renderCallback.mockClear();
    unmount();
    expect(screen.queryByTestId("test")).toBeFalsy();
    expect(renderCallback).toBeCalledTimes(0);
  });

  it("should work and not rerender and unmount later", async () => {
    const renderCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useStateIfMounted("bar");

      useEffect(() => {
        (async () => {
          await delay(10000);
          setFoo("BAZ");
        })();
      }, [setFoo]);

      renderCallback();
      return <div data-testid="test">{foo}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1);
    await act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1);
    unmount();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.queryByTestId("test")).toBeFalsy();
    expect(renderCallback).toBeCalledTimes(1);
  });

  it("should work and not rerender and unmount later 2", async () => {
    const renderCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useStateIfMounted("bar");

      useEffect(() => {
        (async () => {
          await delay(5000);
          setFoo("brin");
        })();
      }, [setFoo]);
      useEffect(() => {
        (async () => {
          await delay(10000);
          setFoo("BAZ");
        })();
      }, [setFoo]);

      renderCallback();
      return (
        <div className="Fpp" data-testid="test">
          {foo}
        </div>
      );
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(4999);
    });
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(3);
    });
    await waitFor(() => {
      expect(renderCallback).toBeCalledTimes(2);
    });
    expect(screen.getByTestId("test").textContent).toEqual("brin");
    unmount();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.queryByTestId("test")).toBeFalsy();
    expect(renderCallback).toBeCalledTimes(2);
  });
});

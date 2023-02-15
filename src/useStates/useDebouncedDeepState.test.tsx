/**
 * @jest-environment jsdom
 */
import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { useDebouncedDeepState } from "./useDebouncedDeepState";

describe("useDebounceDeepState", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should work the same was as useDebouncedState for simple values", async () => {
    const callback = jest.fn();
    let clickCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useDebouncedDeepState("bar", 500);
      callback();
      return (
        <div
          data-testid="elem"
          onClick={() => {
            ++clickCount;
            setFoo(`click ${clickCount}`);
          }}
        >
          {foo}
        </div>
      );
    }
    const { unmount } = render(<MyComponent />);
    const elem = screen.getByTestId("elem");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    jest.advanceTimersByTime(100);
    elem.click();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    jest.advanceTimersByTime(399);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    act(() => {
      jest.advanceTimersByTime(1);
    });

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(2);
    });
    expect(elem.textContent).toEqual("click 1");

    elem.click();
    await waitFor(() => {
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
    expect(elem.textContent).toEqual("click 1");
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
    expect(elem.textContent).toEqual("click 2");
    unmount();
  });

  it("should work stop processing when unmounted", async () => {
    const callback = jest.fn();
    let clickCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useDebouncedDeepState("bar", 500);
      callback();
      return (
        <div
          data-testid="elem"
          onClick={() => {
            ++clickCount;
            setFoo(`click ${clickCount}`);
          }}
        >
          {foo}
        </div>
      );
    }
    const { unmount } = render(<MyComponent />);
    const elem = screen.getByTestId("elem");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    jest.advanceTimersByTime(100);
    elem.click();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    jest.advanceTimersByTime(399);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    unmount();
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should work the same was as useDebouncedState for simple values #2", async () => {
    const callback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useDebouncedDeepState<{ a: number }>({ a: 0 }, 500);
      callback();
      return (
        <div>
          <input
            type="button"
            data-testid="set1"
            onClick={() => {
              setFoo({ a: 1 });
            }}
          />
          <input
            type="button"
            data-testid="set2"
            onClick={() => {
              setFoo({ a: 2 });
            }}
          />
          <div data-testid="elem">{foo.a}</div>
        </div>
      );
    }
    const { unmount } = render(<MyComponent />);
    const elem = screen.getByTestId("elem");
    const set1 = screen.getByTestId("set1");
    const set2 = screen.getByTestId("set2");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("0");

    jest.advanceTimersByTime(100);
    set1.click();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("0");

    jest.advanceTimersByTime(499);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(elem.textContent).toEqual("0");

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(elem.textContent).toEqual("1");

    set1.click();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(elem.textContent).toEqual("1");

    set2.click();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
    expect(elem.textContent).toEqual("2");
    unmount();
  });
});

/**
 * @jest-environment jsdom
 */
import { act, render, waitFor } from "@testing-library/react";
import React from "react";
import { useDebouncedState } from "./useDebouncedState";

describe("useDebounceState", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should work properly", async () => {
    const callback = jest.fn();
    let clickCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useDebouncedState("bar", 500);
      callback();
      return (
        <div
          data-testid="elem"
          onClick={() => {
            ++clickCount;
            setFoo("click " + clickCount);
          }}
        >
          {foo}
        </div>
      );
    }
    const { getByTestId } = render(<MyComponent />);
    const elem = getByTestId("elem");

    expect(callback).toBeCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    jest.advanceTimersByTime(100);
    elem.click();
    expect(callback).toBeCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    jest.advanceTimersByTime(399);
    expect(callback).toBeCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    act(() => {
      jest.advanceTimersByTime(1);
    });

    await waitFor(() => {
      expect(callback).toBeCalledTimes(2);
      expect(elem.textContent).toEqual("click 1");
    });

    elem.click();
    await waitFor(() => {
      expect(callback).toBeCalledTimes(2);
      expect(elem.textContent).toEqual("click 1");
    });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(callback).toBeCalledTimes(3);
      expect(elem.textContent).toEqual("click 2");
    });
  });

  it("should not fire when component is unmounted", async () => {
    const callback = jest.fn();
    let clickCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useDebouncedState("bar", 500);
      callback();
      return (
        <div
          data-testid="elem"
          onClick={() => {
            ++clickCount;
            setFoo("click " + clickCount);
          }}
        >
          {foo}
        </div>
      );
    }
    const { getByTestId, unmount } = render(<MyComponent />);
    const elem = getByTestId("elem");

    expect(callback).toBeCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    jest.advanceTimersByTime(100);
    elem.click();
    expect(callback).toBeCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    jest.advanceTimersByTime(399);
    expect(callback).toBeCalledTimes(1);
    expect(elem.textContent).toEqual("bar");

    unmount();
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(callback).toBeCalledTimes(1);
  });
});

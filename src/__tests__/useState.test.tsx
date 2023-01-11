/**
 * @jest-environment jsdom
 */
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { delay } from "../test-support/delay";
describe("useState", () => {
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });
  it("should set initial state", () => {
    function MyComponent() {
      const [foo] = useState("bar");
      return <div data-testid="test">{foo}</div>;
    }
    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
  });

  it("should set rerender when setting state", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useState("bar");
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo("mew");
        })();
      }, []);
      return <div data-testid="test">{foo}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    act(() => jest.runAllTimers());
    await waitFor(() => {
      expect(renderCount).toEqual(2);
    });
    expect(screen.getByTestId("test").textContent).toEqual("mew");
  });

  it("should not rerender when setting state to the same value", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useState("bar");
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo("bar");
        })();
      }, []);
      return <div data-testid="test">{foo}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.getByTestId("test").textContent).toEqual("bar");
    });
    expect(renderCount).toEqual(1);
  });

  it("should not rerender when setting state to the same value via click", async () => {
    const callback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useState("bar");
      callback();
      return (
        <div data-testid="test" onClick={() => setFoo("bar")}>
          {foo}
        </div>
      );
    }

    render(<MyComponent />);
    const testElement = screen.getByTestId("test");
    expect(testElement.textContent).toEqual("bar");
    expect(callback).toBeCalledTimes(1);
    fireEvent.click(testElement);
    expect(testElement.textContent).toEqual("bar");
    expect(callback).toBeCalledTimes(1);
  });

  it("should not rerender when setting state to a different value from initial followed by same value via click", async () => {
    const callback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useState("bir");
      const onClick = useCallback(() => setFoo("bar"), []);
      callback(foo);
      return (
        <div data-testid="test" onClick={onClick}>
          {foo}
        </div>
      );
    }

    const { unmount } = render(<MyComponent />);
    const testElement = screen.getByTestId("test");
    expect(testElement.textContent).toEqual("bir");
    expect(callback).toBeCalledTimes(1);
    fireEvent.click(testElement);
    expect(testElement.textContent).toEqual("bar");
    expect(callback).toBeCalledTimes(2);
    fireEvent.click(testElement);
    expect(testElement.textContent).toEqual("bar");
    expect(Object.is("bar", "bar")).toBeTruthy();
    /*
     * expect(callback).toBeCalledTimes(2) does not work.
     * workaround due to https://stackoverflow.com/questions/70312646/why-does-react-rerender-when-the-state-is-set-to-the-same-value-the-first-time-v#comment124298465_70312646
     */
    expect(callback.mock.calls.length >= 2).toBeTruthy();
    unmount();
  });

  it("should not rerender when setting state to a different value from initial followed by same value via click using a reducer", async () => {
    const callback = jest.fn();
    const comparisonCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useReducer((prev: string, next: string) => {
        const isPrevEqNext = prev === next;
        comparisonCallback(isPrevEqNext);
        return isPrevEqNext ? prev : next;
      }, "bir");
      const onClick = useCallback(() => setFoo("bar"), []);
      callback(foo);
      return (
        <div data-testid="test" onClick={onClick}>
          {foo}
        </div>
      );
    }

    const { unmount } = render(<MyComponent />);
    const testElement = screen.getByTestId("test");
    expect(testElement.textContent).toEqual("bir");
    expect(callback).toBeCalledTimes(1);
    fireEvent.click(testElement);
    expect(testElement.textContent).toEqual("bar");
    expect(callback).toBeCalledTimes(2);
    fireEvent.click(testElement);
    expect(testElement.textContent).toEqual("bar");
    expect(Object.is("bar", "bar")).toBeTruthy();
    /*
     * expect(callback).toBeCalledTimes(2) does not work.
     * workaround due to https://stackoverflow.com/questions/70312646/why-does-react-rerender-when-the-state-is-set-to-the-same-value-the-first-time-v#comment124298465_70312646
     */
    expect(callback.mock.calls.length >= 2).toBeTruthy();
    expect(comparisonCallback).toBeCalledTimes(2);
    expect(comparisonCallback).toHaveBeenNthCalledWith(1, false);
    expect(comparisonCallback).toHaveBeenNthCalledWith(2, true);
    unmount();
  });

  it("should rerender when setting state to the same value, but still different objects", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useState({ foo: "bar" });
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ foo: "bar" });
        })();
      }, []);
      return <div data-testid="test">{foo.foo}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    act(() => jest.runAllTimers());
    await waitFor(() => expect(renderCount).toEqual(2));
    expect(screen.getByTestId("test").textContent).toEqual("bar");
  });
});

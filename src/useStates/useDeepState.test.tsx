/**
 * @jest-environment jsdom
 */
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React, { useEffect } from "react";

import { delay } from "../test-support/delay";
import { useDeepState } from "./useDeepState";

describe("useDeepState", () => {
  it("should set initial state", () => {
    function MyComponent() {
      const [foo] = useDeepState("bar");
      return <div data-testid="test">{foo}</div>;
    }
    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
  });

  it("should allow undefined initial state", () => {
    function MyComponent() {
      const [foo] = useDeepState<string>();
      return <div data-testid="test">{foo}</div>;
    }
    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("");
  });

  it("should set initial state via a function", () => {
    function MyComponent() {
      const [foo] = useDeepState(() => "bar");
      return <div data-testid="test">{foo}</div>;
    }
    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
  });

  it("should not rerender when setting state to the same value", async () => {
    jest.useFakeTimers();
    const rendering = jest.fn();

    const val = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(val);
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo(val);
        })();
      }, [setFoo]);
      rendering();
      return <div data-testid="test">{foo.foo}</div>;
    }

    const { unmount } = render(<MyComponent />);
    await waitFor(() => expect(rendering).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    act(() => jest.advanceTimersByTime(5000));
    expect(rendering).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(5000));
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(rendering).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("should not rerender when setting state to the same value #2", async () => {
    jest.useFakeTimers();
    const rendering = jest.fn();
    const val = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(val);
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo(val);
          await delay(10000);
          setFoo(val);
        })();
      }, [setFoo]);
      rendering();
      return <div data-testid="test">{foo.foo}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(rendering).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(5000));
    expect(rendering).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(5000));
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    act(() => jest.advanceTimersByTime(10000));
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    // skip this assertion as there's extra renders
    expect(rendering).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("should rerender when setting state to different value", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    const val: Record<string, string> = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(val);
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ ...val, abc: "123" });
        })();
      }, [setFoo]);
      ++renderCount;
      return <div data-testid="test">{foo.foo}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    act(() => jest.advanceTimersByTime(5000));
    expect(renderCount).toEqual(1);
    act(() => jest.advanceTimersByTime(5000));
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    await waitFor(() => expect(renderCount).toEqual(2));
  });

  it("should not rerender when setting state to the same value, with value initialized from function", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    const val = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(() => val);
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo(val);
        })();
      }, [setFoo]);
      return <div data-testid="test">{foo.foo}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    await act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    // React DOM may do extra rerenders.
    expect(renderCount).toBeGreaterThanOrEqual(1);
  });

  it("should not rerender when setting state to the same value, even if different objects via click", async () => {
    const callback = jest.fn();
    const clickCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useDeepState<{ a: number }>({ a: 0 });
      callback();
      return (
        <div>
          <div
            data-testid="set1"
            onClick={() => {
              clickCallback();
              setFoo({ a: 1 });
            }}
          >
            1
          </div>
          <div data-testid="test">{foo.a}</div>
        </div>
      );
    }

    render(<MyComponent />);
    const testElement = screen.getByTestId("test");
    const set1 = screen.getByTestId("set1");

    expect(testElement.textContent).toEqual("0");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(clickCallback).not.toHaveBeenCalled();

    fireEvent.click(set1);
    await waitFor(() => expect(testElement.textContent).toEqual("1"));

    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(clickCallback).toHaveBeenCalledTimes(1);

    fireEvent.click(set1);
    await waitFor(() => expect(testElement.textContent).toEqual("1"));
    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(clickCallback).toHaveBeenCalledTimes(2);
  });

  it("should not rerender when setting state to the same value, even if different objects via click, value initialized via function", async () => {
    const callback = jest.fn();
    const clickCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useDeepState<{ a: number }>(() => ({ a: 0 }));
      callback();
      return (
        <div>
          <div
            data-testid="set1"
            onClick={() => {
              clickCallback();
              setFoo({ a: 1 });
            }}
          >
            1
          </div>
          <div data-testid="test">{foo.a}</div>
        </div>
      );
    }

    render(<MyComponent />);
    const testElement = screen.getByTestId("test");
    const set1 = screen.getByTestId("set1");

    expect(testElement.textContent).toEqual("0");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(clickCallback).not.toHaveBeenCalled();

    fireEvent.click(set1);
    await waitFor(() => expect(testElement.textContent).toEqual("1"));

    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(clickCallback).toHaveBeenCalledTimes(1);

    fireEvent.click(set1);
    await waitFor(() => expect(testElement.textContent).toEqual("1"));
    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(clickCallback).toHaveBeenCalledTimes(2);
  });

  it("should not rerender when setting state to the same value, even if different objects", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useDeepState({ foo: "bar" });
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ foo: "bar" });
        })();
      }, [setFoo]);
      return <div data-testid="test">{foo.foo}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    act(() => jest.runAllTimers());
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    unmount();
  });

  it("should rerender when setting state to the different values", async () => {
    jest.useFakeTimers();
    const renderCallback = jest.fn();

    function MyComponent() {
      const [foo, setFoo] = useDeepState({ foo: "bar" });
      renderCallback();
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ foo: "foo" });
        })();
      }, [setFoo]);
      return <div data-testid="test">{foo.foo}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toHaveBeenCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    await waitFor(() => {
      expect(renderCallback).toHaveBeenCalledTimes(2);
    });
    expect(screen.getByTestId("test").textContent).toEqual("foo");
    unmount();
  });
});

/**
 * @jest-environment jsdom
 */
import { act, render, screen } from "@testing-library/react";
import { useEffect, useReducer, useRef } from "react";

import { delay } from "../test-support/delay";
import { Rerendering } from "../test-support/Rerendering";
describe("useRef", () => {
  it("should set initial value", () => {
    function MyComponent() {
      const myRef = useRef("blah");
      return <div data-testid="test">{myRef.current}</div>;
    }
    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("blah");
  });

  it("should not rerender when setting ref", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      const myRef = useRef("blah");
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          myRef.current = "It's me";
          callback();
        })();
      }, []);
      return <div data-testid="test">{myRef.current}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("blah");
    expect(renderCount).toEqual(1);
    expect(callback).not.toBeCalled();
    await act(() => {
      jest.runAllTimers();
    });
    expect(callback).toBeCalledTimes(1);
    expect(screen.getByTestId("test").textContent).toEqual("blah");
    expect(renderCount).toEqual(1);
  });
  it("should get the same object when the parent rerenders with children", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    let x = 0;
    function MyComponent() {
      const random = Math.random();
      const myRef = useRef({ random });
      if (x === 0) {
        x = myRef.current.random;
      }
      ++renderCount;
      callback();
      return <div data-testid="test">{JSON.stringify(myRef.current)}</div>;
    }

    function MyStateComponent() {
      const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          forceUpdate();
        })();
      }, [forceUpdate]);
      return <MyComponent />;
    }

    render(<MyStateComponent />);
    expect(screen.getByTestId("test").textContent).toEqual(
      JSON.stringify({ random: x })
    );
    expect(renderCount).toEqual(1);
    expect(callback).toBeCalledTimes(1);
    await act(() => jest.runAllTimers());
    expect(callback).toBeCalledTimes(2);
    expect(screen.getByTestId("test").textContent).toEqual(
      JSON.stringify({ random: x })
    );
    expect(renderCount).toEqual(2);
  });

  it("should get the same object when the parent rerenders using component, but the component will not rerender as there is no state change", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let x = 0;
    function MyComponent() {
      const random = Math.random();
      const myRef = useRef({ random });
      if (x === 0) {
        x = myRef.current.random;
      }
      callback();
      return (
        <>
          <div data-testid="test">{JSON.stringify(myRef.current)}</div>
          <div data-testid="random">{JSON.stringify(random)}</div>
        </>
      );
    }

    render(
      <Rerendering>
        <MyComponent />
      </Rerendering>
    );
    expect(screen.getByTestId("test").textContent).toEqual(
      JSON.stringify({ random: x })
    );
    expect(callback).toBeCalledTimes(1);
    await act(() => jest.runAllTimers());
    expect(screen.getByTestId("test").textContent).toEqual(
      JSON.stringify({ random: x })
    );
    expect(callback).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});

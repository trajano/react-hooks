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
import { noop } from "lodash";
import React, { useCallback, useEffect, useReducer, useState } from "react";

import { delay } from "../test-support/delay";
describe("useState batch scenario", () => {
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });
  ;

  it("two set states will trigger only one render", async () => {
    const renderFn = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useState("foo");
      const [bar, setBar] = useState("bar");

      const handleClick = useCallback(() => {
        setFoo("blah");
        setBar("blah");
      }, [])

      renderFn();
      return <div data-testid="test" onClick={handleClick}>{foo}{bar}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("foobar");
    expect(renderFn).toBeCalledTimes(1);
    fireEvent.click(screen.getByTestId("test"))
    expect(renderFn).toBeCalledTimes(2);
    expect(screen.getByTestId("test").textContent).toEqual("blahblah");
    unmount();
    expect(renderFn).toBeCalledTimes(2);
  });

  it("two set states will trigger only one render with effect check", async () => {
    const renderFn = jest.fn();
    const effectFn = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useState("foo");
      const [bar, setBar] = useState("bar");

      const handleClick = useCallback(() => {
        setFoo("blah");
        setBar("blah");
      }, [])

      useEffect(() => {
        noop(foo);
        noop(bar);
        effectFn();
      }, [foo, bar]);
      renderFn();
      return <div data-testid="test" onClick={handleClick}>{foo}{bar}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("foobar");
    expect(renderFn).toBeCalledTimes(1);
    expect(effectFn).toBeCalledTimes(1);
    fireEvent.click(screen.getByTestId("test"))
    expect(renderFn).toBeCalledTimes(2);
    expect(effectFn).toBeCalledTimes(2);
    expect(screen.getByTestId("test").textContent).toEqual("blahblah");
    unmount();
    expect(renderFn).toBeCalledTimes(2);
    expect(effectFn).toBeCalledTimes(2);
  })

  it("two set states will trigger only one render with effect check with async handler", async () => {
    const renderFn = jest.fn();
    const effectFn = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useState("foo");
      const [bar, setBar] = useState("bar");

      const handleClick = useCallback(async () => {
        await new Promise<void>((resolve) => { setFoo("blah"); resolve() })
        await new Promise<void>((resolve) => { setBar("blah"); resolve() })
      }, [])

      useEffect(() => {
        noop(foo);
        noop(bar);
        effectFn();
      }, [foo, bar]);
      renderFn();
      return <div data-testid="test" onClick={handleClick}>{foo}{bar}</div>;
    }

    const { unmount } = render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("foobar");
    expect(renderFn).toBeCalledTimes(1);
    expect(effectFn).toBeCalledTimes(1);
    fireEvent.click(screen.getByTestId("test"))
    expect(renderFn).toBeCalledTimes(2);
    expect(effectFn).toBeCalledTimes(2);
    expect(screen.getByTestId("test").textContent).toEqual("blahbar");
    // second state update after await
    await act(() => Promise.resolve());
    expect(renderFn).toBeCalledTimes(3);
    expect(effectFn).toBeCalledTimes(3);
    expect(screen.getByTestId("test").textContent).toEqual("blahblah");
    unmount();
    expect(renderFn).toBeCalledTimes(3);
    expect(effectFn).toBeCalledTimes(3);
  })


});

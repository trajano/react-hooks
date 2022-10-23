/**
 * @jest-environment jsdom
 */
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { delay } from '../test-support/delay';
describe('useState', () => {
  it("should set initial state", () => {
    function MyComponent() {
      const [foo] = useState("bar");
      return (<div data-testid="test">{foo}</div>);
    }
    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
  })

  it("should set rerender when setting state", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useState("bar");
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo("mew")
        })()
      }, [])
      return (<div data-testid="test">{foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual("mew");
      expect(renderCount).toEqual(2);
    });
  })

  it("should not rerender when setting state to the same value", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useState("bar");
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo("bar")
        })()
      }, [])
      return (<div data-testid="test">{foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual("bar");
      expect(renderCount).toEqual(1);
    });
  })

  it("should not rerender when setting state to the same value via click", async () => {
    const callback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useState("bar");
      callback();
      return (<div data-testid="test" onClick={() => setFoo("bar")}>{foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    const testElement = getByTestId("test");
    expect(testElement.textContent).toEqual("bar");
    expect(callback).toBeCalledTimes(1);
    fireEvent.click(testElement)
    expect(testElement.textContent).toEqual("bar");
    expect(callback).toBeCalledTimes(1);
  })

  it("should not rerender when setting state to a different value from initial followed by same value via click", async () => {
    const callback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useState("bir");
      callback();
      return (<div data-testid="test" onClick={() => setFoo("bar")}>{foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    const testElement = getByTestId("test");
    expect(testElement.textContent).toEqual("bir");
    expect(callback).toBeCalledTimes(1);
    act(() => { fireEvent.click(testElement); });
    expect(testElement.textContent).toEqual("bar");
    expect(callback).toBeCalledTimes(2);
    act(() => { fireEvent.click(testElement); });
    expect(testElement.textContent).toEqual("bar");
    // workaround  due to https://stackoverflow.com/questions/70312646/why-does-react-rerender-when-the-state-is-set-to-the-same-value-the-first-time-v?noredirect=1#comment124298465_70312646
    expect(callback.mock.calls.length >= 2).toBeTruthy();
  })

  it("should rerender when setting state to the same value, but still different objects", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useState({ foo: "bar" });
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ foo: "bar" })
        })()
      }, [])
      return (<div data-testid="test">{foo.foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual("bar");
      expect(renderCount).toEqual(2);
    });
  })

  afterEach(() => {
    jest.useRealTimers();
  })
})

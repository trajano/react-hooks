/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { waitFor } from "@testing-library/dom";
import { delay } from '../delay';
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

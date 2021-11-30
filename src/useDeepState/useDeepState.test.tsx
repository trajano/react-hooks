import { render } from '@testing-library/react';
import { waitFor } from "@testing-library/dom";
import { useEffect } from 'react';
import { delay } from '../delay';
import { useDeepState } from './useDeepState';

describe("useDeepState", () => {
  it("should set initial state", () => {
    function MyComponent() {
      const [foo] = useDeepState("bar");
      return (<div data-testid="test">{foo}</div>);
    }
    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
  })

  it("should not rerender when setting state to the same value", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    const val = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(val);
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo(val)
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
      expect(renderCount).toEqual(1);
    });
  })

  it("should not rerender when setting state to the same value, even if different objects", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useDeepState({ foo: "bar" });
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
      expect(renderCount).toEqual(1);
    });
  })

  it("should rerender when setting state to the different values", async () => {
    jest.useFakeTimers();
    let renderCount = 0;

    function MyComponent() {
      const [foo, setFoo] = useDeepState({ foo: "bar" });
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ foo: "foo" })
        })()
      }, [])
      return (<div data-testid="test">{foo.foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual("foo");
      expect(renderCount).toEqual(2);
    });
  })

})

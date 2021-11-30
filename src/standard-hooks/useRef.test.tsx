/**
 * @jest-environment jsdom
 */
import { waitFor } from "@testing-library/dom";
import { render } from '@testing-library/react';
import { PropsWithChildren, useEffect, useReducer, useRef } from 'react';
import { delay } from '../delay';
import { Rerendering } from '../Rerendering';
describe('useRef', () => {
  it("should set initial value", () => {
    function MyComponent() {
      const myRef = useRef("blah")
      return (<div data-testid="test">{myRef.current}</div>);
    }
    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("blah");
  })

  it("should not rerender when setting ref", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      const myRef = useRef("blah")
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          myRef.current = "It's me"
          callback();
        })()
      }, [])
      return (<div data-testid="test">{myRef.current}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("blah");
    expect(renderCount).toEqual(1);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    await waitFor(() => {
      expect(callback).toBeCalledTimes(1);
      expect(getByTestId("test").textContent).toEqual("blah");
      expect(renderCount).toEqual(1);
    });
  })
  it("should get the same object when the parent rerenders with children", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    let x = 0;
    function MyComponent() {
      const random = Math.random();
      const myRef = useRef({ random })
      if (x === 0) {
        x = myRef.current.random
      }
      ++renderCount;
      callback();
      return (<div data-testid="test">{JSON.stringify(myRef.current)}</div>);
    }

    function MyStateComponent({ children }: PropsWithChildren<{}>) {
      const forceUpdate = useReducer(() => ({}), {})[1] as () => void
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          forceUpdate()
        })()
      }, [])
      return (<MyComponent />);
    }

    const { getByTestId } = render(<MyStateComponent />)
    expect(getByTestId("test").textContent).toEqual(JSON.stringify({ random: x }));
    expect(renderCount).toEqual(1);
    expect(callback).toBeCalledTimes(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(callback).toBeCalledTimes(2);
      expect(getByTestId("test").textContent).toEqual(JSON.stringify({ random: x }));
      expect(renderCount).toEqual(2);
    });
  })

  it("should get the same object when the parent rerenders using component, but the component will not rerender as there is no state change", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let x = 0;
    function MyComponent() {
      const random = Math.random();
      const myRef = useRef({ random })
      if (x === 0) {
        x = myRef.current.random
      }
      callback();
      return (<>
        <div data-testid="test">{JSON.stringify(myRef.current)}</div>
        <div data-testid="random">{JSON.stringify(random)}</div>
      </>);
    }

    const { getByTestId } = render(<Rerendering><MyComponent /></Rerendering>)
    expect(getByTestId("test").textContent).toEqual(JSON.stringify({ random: x }));
    expect(callback).toBeCalledTimes(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(JSON.stringify({ random: x }));
      expect(callback).toBeCalledTimes(1);
    });
  })

  afterEach(() => {
    jest.useRealTimers();
  })
})

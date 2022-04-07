/**
 * @jest-environment jsdom
 */
import { act, render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { delay } from '../test-support/delay';
import { useStateIfMounted } from "./useStateIfMounted";

describe("useStateIfMounted", () => {

  it("should work and not rerender", () => {
    const renderCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useStateIfMounted("bar");

      useEffect(() => {
        setFoo("BAZ");
      }, [])
      renderCallback();
      return (<div data-testid="test">{foo}</div>);
    }

    const { getByTestId, queryByTestId, unmount } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("BAZ");
    expect(renderCallback).toBeCalledTimes(2)
    unmount();
    expect(queryByTestId("test")).toBeFalsy()
    expect(renderCallback).toBeCalledTimes(2)

  })

  it("should work and not rerender and unmount later", async () => {
    jest.useFakeTimers('modern');

    const renderCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useStateIfMounted("bar");

      useEffect(() => {
        (async () => {
          await delay(10000);
          setFoo("BAZ");
        })();
      }, [])

      renderCallback();
      return (<div data-testid="test">{foo}</div>);
    }

    const { getByTestId, queryByTestId, unmount } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    await act(async () => jest.advanceTimersByTime(5000));
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    unmount();
    await act(async () => jest.advanceTimersByTime(5000));
    expect(queryByTestId("test")).toBeFalsy()
    expect(renderCallback).toBeCalledTimes(1)
  })

  it("should work and not rerender and unmount later", async () => {
    jest.useFakeTimers('modern');

    const renderCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useStateIfMounted("bar");

      useEffect(() => {
        (async () => {
          await delay(5000);
          setFoo("brin");
        })();
      }, [])
      useEffect(() => {
        (async () => {
          await delay(10000);
          setFoo("BAZ");
        })();
      }, [])

      renderCallback();
      return (<div data-testid="test">{foo}</div>);
    }

    const { getByTestId, queryByTestId, unmount } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    await act(async () => jest.advanceTimersByTime(4999));
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    await act(async () => jest.advanceTimersByTime(3));
    expect(getByTestId("test").textContent).toEqual("brin");
    expect(renderCallback).toBeCalledTimes(2)
    unmount();
    await act(async () => jest.advanceTimersByTime(5000));
    expect(queryByTestId("test")).toBeFalsy()
    expect(renderCallback).toBeCalledTimes(2)

  })

})

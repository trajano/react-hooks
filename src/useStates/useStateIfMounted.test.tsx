/**
 * @jest-environment jsdom
 */
import { act, render, screen } from '@testing-library/react';
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
      }, [setFoo])
      renderCallback();
      return (<div data-testid="test">{foo}</div>);
    }

    const { unmount } = render(<MyComponent />)
    expect(screen.getByTestId("test").textContent).toEqual("BAZ");
    expect(renderCallback).toBeCalledTimes(2)
    unmount();
    expect(screen.queryByTestId("test")).toBeFalsy()
    expect(renderCallback).toBeCalledTimes(2)

  })

  it("should work and not rerender and unmount later", async () => {
    jest.useFakeTimers();

    const renderCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useStateIfMounted("bar");

      useEffect(() => {
        (async () => {
          await delay(10000);
          setFoo("BAZ");
        })();
      }, [setFoo])

      renderCallback();
      return (<div data-testid="test">{foo}</div>);
    }

    const { unmount } = render(<MyComponent />)
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    await act(async () => { jest.advanceTimersByTime(5000) });
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    unmount();
    await act(async () => { jest.advanceTimersByTime(5000) });
    expect(screen.queryByTestId("test")).toBeFalsy()
    expect(renderCallback).toBeCalledTimes(1)
  })

  it("should work and not rerender and unmount later 2", async () => {
    jest.useFakeTimers();

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

    const { unmount } = render(<MyComponent />)
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    await act(async () => { jest.advanceTimersByTime(4999) });
    expect(screen.getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    await act(async () => { jest.advanceTimersByTime(3) });
    expect(screen.getByTestId("test").textContent).toEqual("brin");
    expect(renderCallback).toBeCalledTimes(2)
    unmount();
    await act(async () => { jest.advanceTimersByTime(5000) });
    expect(screen.queryByTestId("test")).toBeFalsy()
    expect(renderCallback).toBeCalledTimes(2)

  })

})

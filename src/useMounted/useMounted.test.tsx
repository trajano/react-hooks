/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import React, { useEffect } from 'react';
import { delay } from '../test-support/delay';
import { useMounted } from "./useMounted";

describe("useMounted", () => {

  it("should work and not rerender", async () => {
    const callback = jest.fn();

    function MyComponent() {
      const isMounted = useMounted();

      useEffect(() => {
        callback(isMounted())
      }, [])

      return (<div data-testid="test">Hello world</div>);
    }

    const { unmount } = render(<MyComponent />)
    expect(callback.mock.calls).toEqual([[true]])
    unmount();
    expect(callback.mock.calls).toEqual([[true]])

  })

  it("should work and not rerender and unmount later", async () => {
    jest.useFakeTimers('modern');
    const callback = jest.fn();

    function MyComponent() {
      const isMounted = useMounted();

      useEffect(() => {
        (async () => {
          await delay(10000);
          callback(isMounted());
        })();
      }, [])

      return (<div data-testid="test">Hello world</div>);
    }

    const { unmount } = render(<MyComponent />)
    await waitFor(() => expect(callback).toBeCalledTimes(0));
    jest.advanceTimersByTime(5000);
    unmount();
    jest.advanceTimersByTime(5000);
    await waitFor(() => expect(callback).toBeCalledTimes(1));
    expect(callback.mock.calls).toEqual([[false]])
  })

})

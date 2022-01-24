/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import React, { useRef } from 'react';
import { RerenderingProvider, useRerendering } from "../test-support/RerenderingContext";
describe('useRef with context', () => {
  it("should get the same object when the parent rerenders using component, but the component will rerender as context has changed", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let x = 0;
    function MyComponent() {
      const _ignored = useRerendering();
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

    const { getByTestId } = render(<RerenderingProvider><MyComponent /></RerenderingProvider>)
    expect(getByTestId("test").textContent).toEqual(JSON.stringify({ random: x }));
    expect(callback).toBeCalledTimes(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(JSON.stringify({ random: x }));
      expect(callback).toBeCalledTimes(2);
    });
  })

  afterAll(() => {
    jest.useRealTimers();
  })
})

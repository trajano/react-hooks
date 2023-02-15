/**
 * @jest-environment jsdom
 */
import { act, render, screen, waitFor } from "@testing-library/react";
import React, { useRef } from "react";

import {
  RerenderingProvider,
  useRerendering,
} from "../test-support/RerenderingContext";
describe("useRef with context", () => {
  it("should get the same object when the parent rerenders using component, but the component will rerender as context has changed", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let x = 0;
    function MyComponent() {
      const random = Math.random();
      const myRef = useRef({ random });
      const { calls } = useRerendering();
      if (x === 0) {
        x = myRef.current.random;
      }
      callback();
      return (
        <>
          <div data-testid="test">{JSON.stringify(myRef.current)}</div>
          <div data-testid="calls">{calls}</div>
          <div data-testid="random">{JSON.stringify(random)}</div>
        </>
      );
    }

    const { unmount } = render(
      <RerenderingProvider>
        <MyComponent />
      </RerenderingProvider>
    );
    expect(screen.getByTestId("test").textContent).toEqual(
      JSON.stringify({ random: x })
    );
    expect(callback).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("calls").textContent).toBe("0");
    const d = Date.now();
    expect(jest.getTimerCount()).toBe(1);
    act(() => jest.runAllTimers());
    expect(jest.getTimerCount()).toBe(0);
    expect(Date.now()).toBe(d + 10000);
    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(2);
    });
    expect(screen.getByTestId("test").textContent).toEqual(
      JSON.stringify({ random: x })
    );
    expect(screen.getByTestId("calls").textContent).toBe("1");
    unmount();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});

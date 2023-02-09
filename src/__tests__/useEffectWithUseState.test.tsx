/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import React, { useEffect, useState } from "react";

describe("useEffect with useState", () => {
  it("no useEffect", () => {
    function MyComponent() {
      const [foo] = useState("foo");
      return <span data-testid="asdf">{foo}</span>;
    }
    render(<MyComponent></MyComponent>);
    expect(screen.getByTestId("asdf").textContent).toBe("foo");
  });

  it("with useEffect", () => {
    function MyComponent() {
      const [foo, setFoo] = useState("foo");
      useEffect(() => {
        setFoo("bar");
      }, []);
      return <span data-testid="asdf">{foo}</span>;
    }
    render(<MyComponent></MyComponent>);
    expect(screen.getByTestId("asdf").textContent).toBe("bar");
  });

  it("with useEffect async", async () => {
    function MyComponent() {
      const [foo, setFoo] = useState("foo");
      useEffect(() => {
        (async () => {
          setFoo("bar");
        })();
      }, []);
      return <span data-testid="asdf">{foo}</span>;
    }
    const { unmount } = render(<MyComponent></MyComponent>);
    expect(screen.getByTestId("asdf").textContent).toBe("bar");
    unmount();
  });

  it("with useEffect async and timeout", async () => {
    jest.useFakeTimers();
    function MyComponent() {
      const [foo, setFoo] = useState("foo");
      useEffect(() => {
        (async () => {
          await new Promise<string>((resolve) =>
            setTimeout(() => resolve("bar"), 5000)
          );
          setFoo("bar");
        })();
      }, []);
      return <span data-testid="asdf">{foo}</span>;
    }
    const { unmount } = render(<MyComponent></MyComponent>);
    expect(screen.getByTestId("asdf").textContent).toBe("foo");
    jest.advanceTimersByTime(4999);
    expect(screen.getByTestId("asdf").textContent).toBe("foo");
    jest.advanceTimersByTime(1);
    await waitFor(() =>
      expect(screen.getByTestId("asdf").textContent).toBe("bar")
    );
    unmount();
  });

  it("with useEffect async set state and timeout and cleanup", async () => {
    jest.useFakeTimers();
    let theRenderCount = 0;
    const trackFn = jest.fn((label: string) => { });
    function MyComponent() {
      const renderCount = theRenderCount;
      const [foo, setFoo] = useState("foo");
      useEffect(() => {
        trackFn(`useEffect ${renderCount}`);
        (async () => {
          await new Promise<string>((resolve) =>
            setTimeout(() => resolve("bar"), 5000)
          );
          setFoo("bar");
        })();
        return () => trackFn(`useEffect cleanup ${renderCount}`);
      }, [foo]);
      ++theRenderCount;
      trackFn(`render ${renderCount}`);
      return <span data-testid="asdf">{foo}</span>;
    }
    const { unmount } = render(<MyComponent></MyComponent>);
    expect(screen.getByTestId("asdf").textContent).toBe("foo");
    jest.advanceTimersByTime(4999);
    expect(screen.getByTestId("asdf").textContent).toBe("foo");
    jest.advanceTimersByTime(1);
    await waitFor(() =>
      expect(screen.getByTestId("asdf").textContent).toBe("bar")
    );

    trackFn("before unmount");
    unmount();
    expect(trackFn.mock.calls).toEqual([
      ['render 0'],
      ['useEffect 0'],
      ['render 1'],
      ['useEffect cleanup 0'],
      ['useEffect 1'],
      ['before unmount'],
      ['useEffect cleanup 1']
    ])
  });

});

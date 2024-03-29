/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";

import { delay } from "../test-support/delay";
import { useAsyncSetEffect } from "./useAsyncSetEffect";

describe("useAsyncSetEffect", () => {
  it("should work", async () => {
    function MyComponent() {
      const [foo, setFoo] = useState("bar");

      useAsyncSetEffect(() => Promise.resolve("foo"), setFoo, []);
      return <div data-testid="test">{foo}</div>;
    }
    const { unmount } = render(<MyComponent />);
    const element = screen.getByTestId("test");
    await waitFor(() => expect(element.textContent).toEqual("bar"));
    await waitFor(() => expect(element.textContent).toEqual("foo"));
    unmount();
  });

  it("should work with default deps", async () => {
    jest.useFakeTimers();
    function MyComponent() {
      const [foo, setFoo] = useState("bar");

      useAsyncSetEffect(() => Promise.resolve("foo"), setFoo);
      return <div data-testid="test">{foo}</div>;
    }
    const { unmount } = render(<MyComponent />);
    const element = screen.getByTestId("test");
    await waitFor(() => expect(element.textContent).toEqual("bar"));
    jest.runOnlyPendingTimers();
    await waitFor(() => expect(element.textContent).toEqual("foo"));
    unmount();
  });

  it("should work with delay", async () => {
    jest.useFakeTimers();
    function MyComponent() {
      const [foo, setFoo] = useState("bar");

      useAsyncSetEffect(
        async () => {
          await delay(10000);
          return Promise.resolve("foo");
        },
        setFoo,
        []
      );
      return <div data-testid="test">{foo}</div>;
    }
    const { unmount } = render(<MyComponent />);
    const element = screen.getByTestId("test");
    await waitFor(() => expect(element.textContent).toEqual("bar"));
    jest.runAllTimers();
    await waitFor(() => expect(element.textContent).toEqual("foo"));
    unmount();
  });

  it("should not call state when umounted", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    function MyComponent() {
      const [foo] = useState("bar");

      useAsyncSetEffect(
        async () => {
          await delay(10000);
          return Promise.resolve("foo");
        },
        callback,
        []
      );
      return <div data-testid="test">{foo}</div>;
    }
    const { unmount } = render(<MyComponent />);
    const element = screen.getByTestId("test");
    await waitFor(() => expect(element.textContent).toEqual("bar"));
    await waitFor(() => expect(callback).not.toHaveBeenCalled());
    unmount();
    jest.runAllTimers();
    await waitFor(() => expect(element.textContent).toEqual("bar"));
    await waitFor(() => expect(callback).not.toHaveBeenCalled());
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});

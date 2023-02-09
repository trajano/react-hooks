import { act, render } from "@testing-library/react";
import { useEffect, useLayoutEffect } from "react";

it("should call the methods in the expected order", async () => {

  const trackingFn = jest.fn();
  const subscriptions: (() => void)[] = [];

  const MyGrandChildComponent = () => {
    useEffect(() => {
      trackingFn("useEffect MyGrandChildComponent");
      subscriptions.push(() => { trackingFn("subscription MyGrandChildComponent") })
      return () => trackingFn("useEffect cleanup MyGrandChildComponent");
    })
    useLayoutEffect(() => {
      trackingFn("useLayoutEffect MyGrandChildComponent");
      return () => trackingFn("useLayoutEffect cleanup MyGrandChildComponent");
    })
    try {
      trackingFn("render MyGrandChildComponent");
      return <div />
    } finally {
      trackingFn("finally MyGrandChildComponent");
    }
  }

  const MyChildComponent = () => {
    useEffect(() => {
      trackingFn("useEffect MyChildComponent");
      subscriptions.push(() => { trackingFn("subscription MyChildComponent") })
      return () => trackingFn("useEffect cleanup MyChildComponent");
    })
    useLayoutEffect(() => {
      trackingFn("useLayoutEffect MyChildComponent");
      return () => trackingFn("useLayoutEffect cleanup MyChildComponent");
    })
    try {
      trackingFn("render MyChildComponent");
      return <MyGrandChildComponent />
    } finally {
      trackingFn("finally MyChildComponent");
    }
  }

  const MyComponent = () => {
    useEffect(() => {
      trackingFn("useEffect MyComponent");
      subscriptions.push(() => { trackingFn("subscription MyComponent") })
      return () => trackingFn("useEffect cleanup MyComponent");
    })
    useLayoutEffect(() => {
      trackingFn("useLayoutEffect MyComponent");
      return () => trackingFn("useLayoutEffect cleanup MyComponent");
    })
    try {
      trackingFn("render MyComponent");
      return <MyChildComponent />
    } finally {
      trackingFn("finally MyComponent");
    }
  }

  const { unmount } = render(<MyComponent />);

  await act(() => Promise.resolve());
  subscriptions.forEach(f => f());
  unmount();
  expect(trackingFn.mock.calls).toEqual([
    ['render MyComponent'],
    ['finally MyComponent'],
    ['render MyChildComponent'],
    ['finally MyChildComponent'],
    ['render MyGrandChildComponent'],
    ['finally MyGrandChildComponent'],
    ['useLayoutEffect MyGrandChildComponent'],
    ['useLayoutEffect MyChildComponent'],
    ['useLayoutEffect MyComponent'],
    ['useEffect MyGrandChildComponent'],
    ['useEffect MyChildComponent'],
    ['useEffect MyComponent'],
    ['subscription MyGrandChildComponent'],
    ['subscription MyChildComponent'],
    ['subscription MyComponent'],
    ['useLayoutEffect cleanup MyComponent'],
    ['useLayoutEffect cleanup MyChildComponent'],
    ['useLayoutEffect cleanup MyGrandChildComponent'],
    ['useEffect cleanup MyComponent'],
    ['useEffect cleanup MyChildComponent'],
    ['useEffect cleanup MyGrandChildComponent']
  ])
});

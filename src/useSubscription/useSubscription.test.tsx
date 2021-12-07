/**
 * @jest-environment jsdom
 */
/* eslint-disable jsx-a11y/click-events-have-key-events  */
/* eslint-disable jsx-a11y/no-static-element-interactions  */
import { render, waitFor } from '@testing-library/react';
import React, { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { useSubscription } from "./useSubscription";
import type { SubscriptionManager } from "./SubscriptionManager";

describe("useSubscription", () => {
  it("should notify with clicks", async () => {
    const callback = jest.fn();
    const MyContext = createContext<SubscriptionManager>({} as SubscriptionManager);
    function MyContextProvider({ children }: PropsWithChildren<Record<string, unknown>>) {
      const { subscribe, notify, useSubscribeEffect } = useSubscription();
      return <MyContext.Provider value={{ subscribe, notify, useSubscribeEffect }}>{children}</MyContext.Provider>
    }
    function MyComponent() {
      const { subscribe, notify } = useContext(MyContext);
      function onClick() {
        notify();
      }
      useEffect(() => subscribe(callback), []);
      return (<div data-testid="test" onClick={onClick}>abc</div>);
    }
    const { getByTestId } = render(<MyContextProvider><MyComponent /></MyContextProvider>)
    const element = getByTestId("test");
    expect(element.textContent).toEqual("abc");
    await waitFor(() => expect(callback).toBeCalledTimes(0));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(1));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(2));
  })

  it("should notify with clicks using generated hook", async () => {
    const callback = jest.fn();
    const MyContext = createContext<SubscriptionManager>({} as SubscriptionManager);
    function MyContextProvider({ children }: PropsWithChildren<Record<string, unknown>>) {
      const { subscribe, notify, useSubscribeEffect } = useSubscription();
      return <MyContext.Provider value={{ subscribe, notify, useSubscribeEffect }}>{children}</MyContext.Provider>
    }
    function MyComponent() {
      const { useSubscribeEffect, notify } = useContext(MyContext);
      function onClick() {
        notify();
      }
      useSubscribeEffect(callback);
      return (<div data-testid="test" onClick={onClick}>abc</div>);
    }
    const { getByTestId } = render(<MyContextProvider><MyComponent /></MyContextProvider>)
    const element = getByTestId("test");
    expect(element.textContent).toEqual("abc");
    await waitFor(() => expect(callback).toBeCalledTimes(0));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(1));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(2));
  })
});
